'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClearCart } from '../contexts/CartContext';

// Separate component for the content that uses useSearchParams
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useClearCart();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    console.log('Session ID:', sessionId);
    
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      console.log('No session ID found, redirecting...');
      router.push('/');
    }
  }, []); 
  
  const sendRequest = async (orderData : any) => {
  try {
    // Validate input
    if (!orderData || typeof orderData !== 'object') {
      throw new Error('Invalid orderData: must be a non-null object');
    }

    // Send request to your Next.js API endpoint
    const response = await fetch('/api/n8n', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        source: 'shop-app',
        order: orderData
      })
    });
   // const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('Order sent successfully:', {
      orderId: orderData.id || 'unknown',
      status: response.status,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      data: result.data,
      status: response.status
    };

  } catch (error : unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
  }
};  

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log('Verifying payment for session:', sessionId);
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      console.log('Verification response:', data);
      
      if (data.success) {
        console.log('Payment verified, order details:', data.order);
        setOrderDetails(data.order);
        await sendRequest(data.order);
        // Clear cart using Zustand instead of localStorage
        clearCart();
      } else {
        console.log('Payment verification failed, redirecting to checkout');
        router.push('/checkout');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      router.push('/checkout');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Weryfikujemy płatność...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md mx-auto">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Nie znaleziono szczegółów zamówienia</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  // Calculate total
  const total = orderDetails.order_items?.reduce((sum: number, item: { price: number, quantity: number }) => {
    return sum + (item.price * item.quantity);
  }, 0) || 0;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-10 text-center text-white">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Dziękujemy za zamówienie!</h1>
            <p className="mt-2 text-white/80">Potwierdzenie i szczegóły zamówienia znajdziesz poniżej.</p>
          </div>

          <div className="p-8 space-y-8">
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Szczegóły zamówienia</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Numer zamówienia</span>
                    <span className="font-medium">{orderDetails.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Kwota</span>
                    <span className="font-semibold">{total.toFixed(2)} PLN</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Dane kontaktowe</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Firma</span>
                    <span className="font-medium">{orderDetails.customers?.company_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium">{orderDetails.customers?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-gray-50 border border-gray-200 p-6">
              <ul className="grid gap-3 text-sm text-gray-700 md:grid-cols-3">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  Otrzymasz fakturę VAT na podany adres email
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  Skontaktujemy się w celu umówienia konsultacji
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  W razie pytań: hello@taxm.pl
                </li>
              </ul>
            </section>

            <div className="flex justify-center">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors"
              >
                Wróć do strony głównej
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Main component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}