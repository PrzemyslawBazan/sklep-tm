'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart, useCartActions, useTotalItems, useIsCartHydrated } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function CartPage() {
  const cart = useCart();
  const { removeFromCart, updateQuantity, updateNote } = useCartActions();
  const totalItems = useTotalItems();
  const isHydrated = useIsCartHydrated();
  const router = useRouter();
  const { user } = useAuth()

  const calculateTotals = () => {
    const gross = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const net = gross / 1.23;
    const vat = gross - net;
    return { net, vat, gross };
  };

  const { net, vat, gross } = calculateTotals();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const goBack = (): void => {
    router.back();
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#EDEBE9] border-t-[#0078D4] rounded-full animate-spin" />
          <p className="text-sm text-[#605E5C]">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F8] font-[system-ui]">
      <div className="h-12 bg-white border-b border-[#EDEBE9] px-6 flex items-center">
        <nav className="flex items-center gap-1.5 text-sm">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-[#0078D4] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót
          </button>
          <ChevronRight className="w-3 h-3 text-[#A19F9D]" />
          <span className="text-[#323130]">Koszyk</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#323130]">Koszyk</h1>
          <p className="text-sm text-[#605E5C] mt-1">
            {totalItems} {totalItems === 1 ? 'przedmiot' : 'przedmiotów'} w koszyku
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-[#EDEBE9] p-12 text-center">
            <div className="w-12 h-12 bg-[#F3F2F1] rounded-sm flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-6 h-6 text-[#A19F9D]" />
            </div>
            <h2 className="text-[#323130] font-semibold mb-1">Twój koszyk jest pusty</h2>
            <p className="text-sm text-[#605E5C] mb-6">
              Dodaj usługi do koszyka, aby kontynuować
            </p>
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-sm rounded-sm transition-colors"
            >
              Przeglądaj usługi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#EDEBE9]">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#F3F2F1] border-b border-[#EDEBE9] text-xs font-semibold text-[#605E5C] uppercase tracking-wide">
                  <div className="col-span-5">Usługa</div>
                  <div className="col-span-3 text-center">Ilość</div>
                  <div className="col-span-3 text-right">Cena</div>
                  <div className="col-span-1"></div>
                </div>

                {cart.map((item, index) => (
                  <div
                    key={item.serviceId}
                    className={`${index !== cart.length - 1 ? 'border-b border-[#EDEBE9]' : ''}`}
                  >
                    <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center">
                      <div className="col-span-5">
                        <h3 className="text-sm font-medium text-[#323130]">{item.name}</h3>
                        <p className="text-xs text-[#605E5C] mt-0.5">
                          {formatPrice(item.price)} / szt.
                        </p>
                      </div>

                      <div className="col-span-3 flex justify-center">
                        <div className="inline-flex items-center border border-[#8A8886] rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1, user?.id)}
                            className="p-1.5 text-[#605E5C] hover:bg-[#F3F2F1] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-sm text-[#323130]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1, user?.id)}
                            className="p-1.5 text-[#605E5C] hover:bg-[#F3F2F1] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-3 text-right">
                        <span className="text-sm font-semibold text-[#323130]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => removeFromCart(item.serviceId, user?.id)}
                          className="p-1.5 text-[#A19F9D] hover:text-[#A4262C] hover:bg-[#FDE7E9] rounded-sm transition-colors"
                          title="Usuń z koszyka"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <label
                        htmlFor={`note-${item.serviceId}`}
                        className="block text-xs font-semibold text-[#323130] mb-1"
                      >
                        Notatka
                      </label>
                      <textarea
                        id={`note-${item.serviceId}`}
                        value={item.note || ''}
                        onChange={(e) => updateNote(item.serviceId, e.target.value, user?.id)}
                        placeholder="Dodaj szczególne wymagania lub uwagi..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm placeholder:text-[#A19F9D] focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-[#EDEBE9] sticky top-6">
                <div className="px-4 py-3 bg-[#F3F2F1] border-b border-[#EDEBE9]">
                  <h3 className="text-xs font-semibold text-[#323130] uppercase tracking-wide">
                    Podsumowanie
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#605E5C]">Netto</span>
                    <span className="text-sm text-[#323130]">{formatPrice(net)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#605E5C]">VAT (23%)</span>
                    <span className="text-sm text-[#323130]">{formatPrice(vat)}</span>
                  </div>
                  <div className="border-t border-[#EDEBE9] pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#323130]">Razem</span>
                      <span className="text-lg font-semibold text-[#323130]">{formatPrice(gross)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[#EDEBE9]">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-2.5 bg-[#107C10] hover:bg-[#0E6A0E] text-white text-sm font-semibold rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#107C10] focus:ring-offset-1"
                  >
                    Przejdź do płatności
                  </button>
                  <p className="text-xs text-[#605E5C] text-center mt-3">
                    Bezpieczna płatność · Faktura VAT
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}