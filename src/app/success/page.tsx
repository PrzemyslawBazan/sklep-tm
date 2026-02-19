'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClearCart } from '../contexts/CartContext';

// Separate component for the content that uses useSearchParams
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useClearCart();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const hasVerified = useRef(false);
  const [date, setDate] = useState<string>();
  const [shortId, setShortId] = useState<string>();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    console.log('Session ID:', sessionId);
    
    if (sessionId && !hasVerified.current) {
      verifyPayment(sessionId);
      hasVerified.current = true;
    } else if (!sessionId) {
      console.log('No session ID found, redirecting...');
      router.push('/');
    }
  }, []); 

  const shortenOrderId = (order : any) => {
    console.log(order)
    if (order.id) {
      const shorten = order.id.split("-")[4];
      setShortId(shorten)
    } else {
      setShortId("BrakId")
    }
  }
  
  const sendRequest = async (orderData : any) => {
  try {
    if (!orderData || typeof orderData !== 'object') {
      throw new Error('Invalid orderData: must be a non-null object');
    }

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
        setDate(data.order.paid_at)
        setOrderDetails(data.order);
        await sendRequest(data.order);
        shortenOrderId(data.order);
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-blue-100 border-t-blue-600 animate-spin" />
          <p className="text-sm text-slate-400 tracking-wide">Weryfikujemy płatność…</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-10 text-center max-w-sm mx-auto">
          <div className="mx-auto mb-5 h-12 w-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-700 text-sm font-semibold mb-1">Nie znaleziono zamówienia</p>
          <p className="text-slate-400 text-xs mb-7">Szczegóły zamówienia są niedostępne.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md"
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
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* ── Hero banner ─────────────────────────────────────────────── */}
          <div className="relative bg-blue-600 px-10 py-14 text-center overflow-hidden">
            {/* Subtle dot pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* Emerald glow — top right */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-emerald-400 opacity-20 blur-3xl" />
            {/* Lighter blue glow — bottom left */}
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-blue-300 opacity-20 blur-3xl" />

            {/* Rocket */}
            <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/20" />
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="w-12 h-12 drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Exhaust flame */}
                <ellipse cx="24" cy="41" rx="4" ry="6" fill="#f97316" opacity="0.75" />
                <ellipse cx="24" cy="40" rx="2.5" ry="4" fill="#fbbf24" opacity="0.95" />
                {/* Body */}
                <path d="M24 6 C16 14 14 24 14 32 L24 36 L34 32 C34 24 32 14 24 6Z" fill="white" />
                {/* Nose shade */}
                <path d="M24 6 C21 10 20 13 20 16 L24 18 L28 16 C28 13 27 10 24 6Z" fill="#dbeafe" />
                {/* Porthole */}
                <circle cx="24" cy="22" r="4" fill="#16a34a" opacity="0.85" />
                <circle cx="24" cy="22" r="2.5" fill="#4ade80" />
                <circle cx="23" cy="21" r="0.8" fill="white" opacity="0.8" />
                {/* Left fin */}
                <path d="M14 32 L8 38 L14 36 Z" fill="#bfdbfe" />
                {/* Right fin */}
                <path d="M34 32 L40 38 L34 36 Z" fill="#bfdbfe" />
              </svg>
            </div>

            <h1 className="relative text-2xl font-bold text-white tracking-tight mb-2">
              Dziękujemy za zamówienie!
            </h1>
            <p className="relative text-sm text-blue-100">
              Potwierdzenie i szczegóły zamówienia znajdziesz poniżej.
            </p>
          </div>

          {/* ── Body ────────────────────────────────────────────────────── */}
          <div className="p-8 space-y-5">

            {/* Info cards */}
            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-4">Szczegóły zamówienia</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Numer zamówienia</span>
                    <span className="font-medium text-slate-800">{shortId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Kwota</span>
                    <span className="font-semibold text-blue-600">{total.toFixed(2)} PLN</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-4">Dane kontaktowe</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Firma</span>
                    <span className="font-medium text-slate-800">{orderDetails.customers?.company_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Email</span>
                    <span className="font-medium text-slate-800">{orderDetails.customers?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Next steps */}
            <section className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
              <ul className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
                  Otrzymasz fakturę VAT na podany adres email
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
                  Skontaktujemy się w celu umówienia konsultacji
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
                  W razie pytań: hello@taxm.pl
                </li>
              </ul>
            </section>

            {/* CTA */}
            <div className="flex justify-center pt-1">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-semibold hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md hover:shadow-lg"
              >
                Wróć do strony głównej →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="h-10 w-10 rounded-full border-2 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}