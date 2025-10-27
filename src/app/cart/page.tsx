'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useCart, useCartActions, useTotalItems, useIsCartHydrated } from '../contexts/CartContext';

export default function CartPage() {
  const cart = useCart();
  const { removeFromCart, updateQuantity, updateNote } = useCartActions();
  const totalItems = useTotalItems();
  const isHydrated = useIsCartHydrated();
  const router = useRouter();

  const calculateTotals = () => {
    const gross = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const net = gross / 1.23; // Assuming 23% VAT
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

  const goBack = () => {
    router.back();
  };

  // Show loading state while Zustand rehydrates from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-beige py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Powrót</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b">
            <h1 className="text-2xl font-semibold text-gray-800">
              Twój koszyk ({totalItems} przedmiotów)
            </h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Twój koszyk jest pusty</h3>
              <p className="text-gray-500 mb-6">Dodaj usługi do koszyka, aby kontynuować</p>
              <button
                onClick={goBack}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Przeglądaj usługi
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.serviceId} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Cena jednostkowa: {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.serviceId)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Usuń z koszyka"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor={`note-${item.serviceId}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Notatka (opcjonalnie)
                      </label>
                      <textarea
                        id={`note-${item.serviceId}`}
                        value={item.note || ''}
                        onChange={(e) => updateNote(item.serviceId, e.target.value)}
                        placeholder="Dodaj szczególne wymagania lub uwagi do tej usługi..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 px-6 py-6 border-t">
                <div className="max-w-sm ml-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Netto:</span>
                      <span className="font-medium">{formatPrice(net)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT (23%):</span>
                      <span className="font-medium">{formatPrice(vat)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                      <span>Razem:</span>
                      <span>{formatPrice(gross)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium mt-6"
                  >
                    Przejdź do płatności
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}