'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import CheckoutForm from '../components/CheckoutForm';
import { Customer } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart, useClearCart, useIsCartHydrated } from '../contexts/CartContext';
import supabase from '../lib/supabase';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savedCustomerData, setSavedCustomerData] = useState<Customer | null>(null);
  const[selectedStripeCustomerId,setSelectedStripeCustomerId]=useState<string|null>(null);
  const cart = useCart();
  const clearCart = useClearCart();
  const isHydrated = useIsCartHydrated();
  const { user, isAdmin } = useAuth();

  // Fetch saved customer data on mount
  useEffect(() => {
    const fetchSavedData = async () => {
      if (!user?.id) return;

      try {
        const { data: customerData, error } = await supabase
          .from('customers')
          .select(`
            *,
            addresses (
              street,
              city,
              postal_code,
              country
            )
          `)
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (customerData) {
          const customer = customerData;
          // Handle both single object and array for addresses
          const addressData = Array.isArray(customer.addresses) 
            ? customer.addresses[0] 
            : customer.addresses;

          setSavedCustomerData({
            email: customer.email || '',
            companyName: customer.company_name || '',
            nip: customer.nip || '',
            regon: customer.regon || '',
            krs: customer.krs || '',
            address: {
              street: addressData?.street || '',
              city: addressData?.city || '',
              postalCode: addressData?.postal_code || '',
              country: 'PL',
            },
            contactPerson: {
              firstName: customer.contact_first_name || '',
              lastName: customer.contact_last_name || '',
              phone: customer.contact_phone || '',
              position: customer.contact_position || '',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching saved customer data:', error);
      }
    };

    fetchSavedData();
  }, [user]);

  // Redirect if cart is empty after hydration
  useEffect(() => {
    if (isHydrated && cart.length === 0) {
      router.push('/');
    }
  }, [cart.length, isHydrated, router]);

  
  const handleCustomerSelect = ( stripeCustomerId : string | null ) => {
     setSelectedStripeCustomerId(stripeCustomerId ); 
     console.log ('Selected Stripe Customer ID:', stripeCustomerId); 
    };

  const handleCheckout = async (customer: Customer) => {
    if (!user?.id) {
      alert('Musisz być zalogowany aby złożyć zamówienie');
      return;
    }

    setLoading(true);
    
    try {
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          street: customer.address.street,
          city: customer.address.city,
          postal_code: customer.address.postalCode,
          country: customer.address.country,
        })
        .select()
        .single();

      if (addressError) throw addressError;

      // Check if customer already exists
      const { data: existingCustomer, error: existingCustomerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .eq('email', customer.email)
        .limit(1)
        .single();

      if (existingCustomerError && existingCustomerError.code !== 'PGRST116') {
        throw existingCustomerError;
      }

      let finalCustomerData;

      if (existingCustomer) {
        // Customer exists, use their data
        finalCustomerData = existingCustomer;
      } else {
        // Create new customer (without stripe_customer_id - it will be created by API)
        const { data: newCustomerData, error: customerError } = await supabase
          .from('customers')
          .insert({
            user_id: user.id,
            email: customer.email,
            company_name: customer.companyName,
            nip: customer.nip,
            regon: customer.regon,
            krs: customer.krs,
            address_id: addressData.id,
            contact_first_name: customer.contactPerson.firstName,
            contact_last_name: customer.contactPerson.lastName,
            contact_phone: customer.contactPerson.phone,
            contact_position: customer.contactPerson.position,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        finalCustomerData = newCustomerData;
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: finalCustomerData.id,
          user_id: user.id,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        service_id: item.serviceId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        note: item.note || null,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;

      // Call API to create Stripe session
      // The API will create a Stripe customer if customerStripeId is null
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          customerId: finalCustomerData.id,
          customerStripeId: finalCustomerData.stripe_customer_id || null,
          items: cart,
          userInfo: {
            userId: user.id,
            email: customer.email,
            name: `${customer.contactPerson.firstName} ${customer.contactPerson.lastName}`,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Stripe checkout error:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionUrl } = await response.json();
      
      // Redirect to Stripe
      window.location.href = sessionUrl;

    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Wystąpił błąd: ${error instanceof Error ? error.message : 'Spróbuj ponownie.'}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Koszyk jest pusty</h2>
          <p className="text-gray-600 mb-6">
            Dodaj produkty do koszyka przed przejściem do płatności.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Powrót do sklepu
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Podsumowanie zamówienia</h2>
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.serviceId} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} PLN</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold flex justify-between">
            <span>Razem (z VAT):</span>
            <span>{calculateTotal().toFixed(2)} PLN</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Dane do faktury</h2>
          {savedCustomerData && (
            <button
              type="button"
              onClick={() => {
                console.log('Autofilling with data:', savedCustomerData);
                const event = new CustomEvent('autofillCustomerData', { 
                  detail: savedCustomerData 
                });
                window.dispatchEvent(event);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Użyj standardowego adresu
            </button>
          )}
        </div>
        <CheckoutForm 
          onSubmit={handleCheckout} 
          loading={loading} 
          initialData={savedCustomerData}
          onCustomerSelect={handleCustomerSelect}
        />
      </div>
    </main>
  );
}