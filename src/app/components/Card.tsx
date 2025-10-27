import React from 'react';
import { CartItem } from '../types';
import ServiceCard from './ServiceCard';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (serviceId: string) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onRemoveItem, onCheckout }: CartProps) {
  const calculateTotals = () => {
    const gross = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  if (items.length === 0) {
    return (
      <div className="bg-custom-beige rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Twój koszyk jest pusty</p>
      </div>
    );
  }

  return (
    <div className="bg-custom-beige rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Koszyk</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.serviceId} className="flex justify-between items-center pb-4 border-b">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">Ilość: {item.quantity}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">{formatPrice(item.price)}</p>
              <button
                onClick={() => onRemoveItem(item.serviceId)}
                className="text-red-500 hover:text-red-700"
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span>Netto:</span>
          <span>{formatPrice(net)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>VAT (23%):</span>
          <span>{formatPrice(vat)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Razem:</span>
          <span>{formatPrice(gross)}</span>
        </div>
      </div>
      
      <button
        onClick={onCheckout}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Przejdź do płatności
      </button>
    </div>
  );
}
