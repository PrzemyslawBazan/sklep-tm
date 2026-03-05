'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/CartContext';

export function CartButton() {
  const cart = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/cart')}
      aria-label={`Koszyk – ${totalItems} pozycji`}
      className="relative inline-flex items-center justify-center h-9 w-9
                 text-zinc-600 rounded-md
                 transition-colors duration-150
                 hover:bg-zinc-100 hover:text-zinc-900"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {totalItems > 0 && (
        <span
          className="absolute top-0.5 right-0.5
                     inline-flex items-center justify-center
                     min-w-[1.125rem] h-[1.125rem] px-1
                     bg-emerald-500 text-zinc-950 text-[10px] font-bold
                     rounded-full"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}