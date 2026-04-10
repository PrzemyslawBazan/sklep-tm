'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart, useCartActions, useTotalItems, useIsCartHydrated } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function CartPage() {
  const cart = useCart();
  const { removeFromCart, updateQuantity, updateNote } = useCartActions();
  const totalItems = useTotalItems();
  const isHydrated = useIsCartHydrated();
  const router = useRouter();
  const [inputValue, setInputValue] = useState<Record<string, string>>({});
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { user, isAdmin } = useAuth();

  const calculateTotals = () => {
    const gross = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const net = gross / 1.23;
    const vat = gross - net;
    return { net, vat, gross };
  };

  const { net, vat, gross } = calculateTotals();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(price);

  const handleCheckout = () =>
    isAdmin ? router.push('/admincheckout') : router.push('/checkout');

  const goBack = (): void => router.back();

  const handleRemove = (serviceId: string, userId?: string) => {
    setRemovingId(serviceId);
    setTimeout(() => {
      removeFromCart(serviceId, userId);
      setRemovingId(null);
    }, 280);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['DM_Sans',sans-serif]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-7 h-7 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin" />
          <p className="text-sm text-gray-400">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(16px); }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 font-['DM_Sans',sans-serif]">

        <div className="h-14 px-8 flex items-center bg-white border-b border-gray-200">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót
            </button>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="font-medium text-gray-900">Koszyk</span>
          </nav>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-10">

          <div className="mb-8" style={{ animation: 'fadeUp 0.4s ease' }}>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Koszyk
            </h1>
            <p className="text-sm mt-1 text-gray-500">
              {totalItems} {totalItems === 1 ? 'przedmiot' : 'przedmiotów'} w koszyku
            </p>
          </div>

          {cart.length === 0 ? (
            <div
              className="py-20 text-center rounded-2xl bg-white border border-gray-200"
              style={{ animation: 'fadeUp 0.4s ease' }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-blue-50">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold mb-1 text-gray-900">
                Twój koszyk jest pusty
              </h2>
              <p className="text-sm mb-8 text-gray-500">
                Dodaj usługi do koszyka, aby kontynuować
              </p>
              <button
                onClick={goBack}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-px"
              >
                Przeglądaj usługi
              </button>
            </div>
          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2 flex flex-col gap-3">
                {cart.map((item, index) => (
                  <div
                    key={item.serviceId}
                    className="rounded-2xl bg-white border border-gray-200 transition-all duration-200 hover:border-blue-200 hover:shadow-[0_2px_12px_rgba(37,99,235,0.06)]"
                    style={{
                      animation: removingId === item.serviceId
                        ? 'fadeOut 0.28s ease forwards'
                        : `fadeUp 0.4s ease ${index * 0.06}s both`,
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs mt-0.5 text-gray-400">
                            {formatPrice(item.price)} / szt.
                          </p>
                        </div>

                        <div className="flex items-center rounded-lg overflow-hidden border border-blue-200 bg-blue-50/40">
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1, user?.id)}
                            className="p-2 text-blue-600/70 hover:text-blue-700 hover:bg-blue-100 transition-colors duration-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            value={inputValue[item.serviceId] ?? item.quantity}
                            min={1}
                            onChange={(e) => {
                              setInputValue((prev) => ({ ...prev, [item.serviceId]: e.target.value }));
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val > 0) updateQuantity(item.serviceId, val, user?.id);
                            }}
                            onBlur={() => {
                              const raw = inputValue[item.serviceId];
                              const val = parseInt(raw, 10);
                              if (!raw || isNaN(val) || val < 1) updateQuantity(item.serviceId, 1, user?.id);
                              setInputValue((prev) => { const next = { ...prev }; delete next[item.serviceId]; return next; });
                            }}
                            className="w-10 text-center text-sm font-semibold text-blue-700 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1, user?.id)}
                            className="p-2 text-blue-600/70 hover:text-blue-700 hover:bg-blue-100 transition-colors duration-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemove(item.serviceId, user?.id)}
                          className="p-2 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                          title="Usuń z koszyka"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor={`note-${item.serviceId}`}
                          className="block text-xs font-medium mb-1.5 text-gray-500"
                        >
                          Notatka
                        </label>
                        <textarea
                          id={`note-${item.serviceId}`}
                          value={item.note || ''}
                          onChange={(e) => updateNote(item.serviceId, e.target.value, user?.id)}
                          placeholder="Dodaj szczególne wymagania lub uwagi..."
                          rows={2}
                          className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg resize-none transition-all duration-150 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div
                  className="rounded-2xl overflow-hidden sticky top-8 bg-white border border-gray-200"
                  style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}
                >
                  <div className="h-1 bg-blue-600" />

                  <div className="px-5 py-4 border-b border-gray-200">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                      Podsumowanie
                    </h3>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Netto</span>
                      <span className="text-sm font-medium text-gray-900">{formatPrice(net)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">VAT (23%)</span>
                      <span className="text-sm font-medium text-gray-900">{formatPrice(vat)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-semibold text-gray-900">Razem</span>
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                          {formatPrice(gross)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
                    >
                      Przejdź do płatności
                    </button>
                    <p className="text-xs text-center mt-3 text-gray-400">
                      Bezpieczna płatność · Faktura VAT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}