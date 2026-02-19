import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutFormProps {
  onSubmit: (customer: Customer) => void;
  loading: boolean;
  initialData?: Customer | null;
  onCustomerSelect?: (stripeCustomerId: string | null) => void;
}

interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  metadata?: {
    companyName?: string;
    nip?: string;
  };
}

export default function CheckoutForm({ onSubmit, loading, initialData, onCustomerSelect  }: CheckoutFormProps) {
  const { isAdmin } = useAuth();
  const [stripeCustomers, setStripeCustomers] = useState<StripeCustomer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  const [formData, setFormData] = useState<Customer>({
    email: '',
    companyName: '',
    nip: '',
    regon: '',
    krs: '',
    contactPerson: {
      firstName: '',
      lastName: '',
      phone: '',
      position: '',
    },
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'PL',
    },
  });

  useEffect(() => {
    if (isAdmin) {
      fetchStripeCustomers();
    }
  }, [isAdmin]);

  const fetchStripeCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await fetch('/api/stripe/customers');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Customers list:', data);
        setStripeCustomers(data.customers || []);
      } else {
        console.error('Failed to fetch customers:', response.status);
      }
    } catch (error) {
      console.error('Error fetching Stripe customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerSelect = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    
    if (onCustomerSelect) {
      onCustomerSelect(customerId || null);
    }

    if (!customerId) {
      setFormData({
        email: '',
        companyName: '',
        nip: '',
        regon: '',
        krs: '',
        contactPerson: {
          firstName: '',
          lastName: '',
          phone: '',
          position: '',
        },
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: 'PL',
        },
      });
      return;
    }

    try {
      const response = await fetch(`/api/stripe/customers/${customerId}`);
      
      if (response.ok) {
        const data = await response.json();
        const customer = data.customer;
        
        console.log('Customer details from Stripe:', customer);
        
        setFormData({
          email: customer.email || '',
          companyName: customer.metadata?.companyName || customer.name || '',
          nip: customer.metadata?.nip || '',
          regon: customer.metadata?.regon || '',
          krs: customer.metadata?.krs || '',
          contactPerson: {
            firstName: customer.metadata?.firstName || '',
            lastName: customer.metadata?.lastName || '',
            phone: customer.phone || customer.metadata?.phone || '',
            position: customer.metadata?.position || '',
          },
          address: {
            street: customer.address?.line1 || '',
            city: customer.address?.city || '',
            postalCode: customer.address?.postal_code || '',
            country: customer.address?.country || 'PL',
          },
        });
      } else {
        console.error('Failed to fetch customer:', response.status);
        alert('Nie udało się pobrać danych klienta');
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      alert('Błąd podczas pobierania danych klienta');
    }
  };

  // Listen for autofill event from parent component
  useEffect(() => {
    const handleAutofill = (event: Event) => {
      const customEvent = event as CustomEvent<Customer>;
      if (customEvent.detail) {
        setFormData(customEvent.detail);
      }
    };

    window.addEventListener('autofillCustomerData', handleAutofill);
    
    return () => {
      window.removeEventListener('autofillCustomerData', handleAutofill);
    };
  }, []);

  // Auto-fill on mount if initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Customer] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
//
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Admin Customer Selector */}
      {isAdmin && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
          <h3 className="text-xs font-bold mb-4 text-amber-400 uppercase tracking-widest">
            Panel Administratora
          </h3>
          <div>
            <label className="block text-xs font-semibold mb-2 text-slate-400 uppercase tracking-widest">
              Wybierz klienta ze Stripe
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              disabled={loadingCustomers}
              className="w-full px-3.5 py-2.5 border border-slate-600 rounded-xl bg-slate-800 text-slate-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Wybierz klienta lub wypełnij ręcznie --</option>
              {stripeCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name || customer.email} ({customer.email})
                </option>
              ))}
            </select>
            {loadingCustomers && (
              <p className="text-xs text-slate-400 mt-2">Ładowanie klientów...</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold mb-5 text-stone-800 uppercase tracking-widest">Dane firmy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Nazwa firmy *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">NIP *</label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">REGON</label>
            <input
              type="text"
              name="regon"
              value={formData.regon}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">KRS</label>
            <input
              type="text"
              name="krs"
              value={formData.krs}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold mb-5 text-stone-800 uppercase tracking-widest">Osoba kontaktowa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Imię *</label>
            <input
              type="text"
              name="contactPerson.firstName"
              value={formData.contactPerson.firstName}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Nazwisko *</label>
            <input
              type="text"
              name="contactPerson.lastName"
              value={formData.contactPerson.lastName}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Telefon *</label>
            <input
              type="tel"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Stanowisko</label>
            <input
              type="text"
              name="contactPerson.position"
              value={formData.contactPerson.position}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold mb-5 text-stone-800 uppercase tracking-widest">Adres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Ulica i numer *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Miasto *</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone-400 uppercase tracking-widest">Kod pocztowy *</label>
            <input
              type="text"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              required
              pattern="[0-9]{2}-[0-9]{3}"
              placeholder="00-000"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-stone-300 transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-3.5 rounded-2xl hover:bg-blue-800 active:scale-[0.99] transition-all font-semibold text-sm tracking-wide shadow-md hover:shadow-lg disabled:bg-stone-300 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {loading ? 'Przetwarzanie...' : 'Przejdź do płatności →'}
      </button>
    </form>
  );
}