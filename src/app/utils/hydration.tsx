'use client';

import { useEffect } from 'react';
import { useCartStore } from '../contexts/CartContext';

export default function StoreHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}