import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { CartItem, Service } from '../types/index';
import supabase from '../lib/supabase';

const safeLocalStorage: StateStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('[CartStore] Failed to read from localStorage:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('[CartStore] Failed to write to localStorage:', e);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[CartStore] Failed to remove from localStorage:', e);
    }
  },
};


interface CartStore {
  cart: CartItem[];
  isHydrated: boolean;
  isSyncing: boolean;

  addToCart: (service: Service, userId?: string) => Promise<void>;
  removeFromCart: (serviceId: string, userId?: string) => Promise<void>;
  updateQuantity: (serviceId: string, quantity: number, userId?: string) => Promise<void>;
  updateNote: (serviceId: string, note: string, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;

  syncCartFromDB: (userId: string) => Promise<void>;
  mergeGuestCartAndSync: (userId: string) => Promise<void>;
  clearCartOnLogout: () => void;

  setHydrated: () => void;
}


export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isHydrated: false,
      isSyncing: false,

      addToCart: async (service: Service, userId?: string) => {
        set((state) => {
          const existing = state.cart.find(item => item.serviceId === service.id);
          if (existing) {
            return {
              cart: state.cart.map(item =>
                item.serviceId === service.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, {
              serviceId: service.id,
              name: service.name,
              price: service.price,
              quantity: 1,
              addedAt: new Date(),
            }],
          };
        });

        if (!userId) return;

        try {
          const updatedItem = get().cart.find(item => item.serviceId === service.id);
          await supabase.from('cart_items').upsert(
            {
              user_id: userId,
              product_id: service.id,
              name: service.name,
              price: service.price,
              quantity: updatedItem?.quantity ?? 1,
            },
            { onConflict: 'user_id,product_id' }
          );
        } catch (e) {
          console.error('[CartStore] Failed to sync addToCart with DB:', e);
        }
      },

      removeFromCart: async (serviceId: string, userId?: string) => {
        set((state) => ({
          cart: state.cart.filter(item => item.serviceId !== serviceId),
        }));

        if (!userId) return;

        try {
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', serviceId);
        } catch (e) {
          console.error('[CartStore] Failed to sync removeFromCart with DB:', e);
        }
      },

      updateQuantity: async (serviceId: string, quantity: number, userId?: string) => {
        if (quantity <= 0) {
          get().removeFromCart(serviceId, userId);
          return;
        }

        set((state) => ({
          cart: state.cart.map(item =>
            item.serviceId === serviceId ? { ...item, quantity } : item
          ),
        }));

        if (!userId) return;

        try {
          await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', serviceId);
        } catch (e) {
          console.error('[CartStore] Failed to sync updateQuantity with DB:', e);
        }
      },

      updateNote: async (serviceId: string, note: string, userId?: string) => {
        set((state) => ({
          cart: state.cart.map(item =>
            item.serviceId === serviceId ? { ...item, note } : item
          ),
        }));

        if (!userId) return;

        try {
          await supabase
            .from('cart_items')
            .update({ note })
            .eq('user_id', userId)
            .eq('product_id', serviceId);
        } catch (e) {
          console.error('[CartStore] Failed to sync updateNote with DB:', e);
        }
      },

      clearCart: async (userId?: string) => {
        set({ cart: [] });

        if (!userId) return;

        try {
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);
        } catch (e) {
          console.error('[CartStore] Failed to sync clearCart with DB:', e);
        }
      },

      syncCartFromDB: async (userId: string) => {
        set({ isSyncing: true });

        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId);

          if (error) {
            console.error('[CartStore] Failed to sync cart from DB:', error);
            set({ isSyncing: false });
            return;
          }

          const cart: CartItem[] = (data ?? []).map((row) => ({
            serviceId: row.product_id,
            name: row.name,
            price: row.price,
            quantity: row.quantity,
            note: row.note ?? undefined,
            addedAt: new Date(row.created_at),
          }));

          set({ cart, isSyncing: false });
        } catch (e) {
          console.error('[CartStore] Unexpected error in syncCartFromDB:', e);
          set({ isSyncing: false });
        }
      },

      mergeGuestCartAndSync: async (userId: string) => {
        set({ isSyncing: true });

        try {
          const guestCart = get().cart;

          if (guestCart.length > 0) {
            const upsertPayload = guestCart.map((item) => ({
              user_id: userId,
              product_id: item.serviceId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              note: item.note ?? null,
            }));

            await supabase
              .from('cart_items')
              .upsert(upsertPayload, { onConflict: 'user_id,product_id' });
          }

          await get().syncCartFromDB(userId);
        } catch (e) {
          console.error('[CartStore] Failed to merge guest cart:', e);
          set({ isSyncing: false });
        }
      },

      clearCartOnLogout: () => {
        set({ cart: [], isSyncing: false });
        safeLocalStorage.removeItem('cart-storage');
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[CartStore] Rehydration failed, clearing corrupted storage:', error);
          safeLocalStorage.removeItem('cart-storage');
        }
        state?.setHydrated();
      },
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);


export const useCart = () => useCartStore((state) => state.cart);
export const useIsCartHydrated = () => useCartStore((state) => state.isHydrated);
export const useIsSyncing = () => useCartStore((state) => state.isSyncing);

export const useAddToCart = () => useCartStore((state) => state.addToCart);
export const useRemoveFromCart = () => useCartStore((state) => state.removeFromCart);
export const useUpdateQuantity = () => useCartStore((state) => state.updateQuantity);
export const useUpdateNote = () => useCartStore((state) => state.updateNote);
export const useClearCart = () => useCartStore((state) => state.clearCart);

export const useSyncCartFromDB = () => useCartStore((state) => state.syncCartFromDB);
export const useMergeGuestCartAndSync = () => useCartStore((state) => state.mergeGuestCartAndSync);
export const useClearCartOnLogout = () => useCartStore((state) => state.clearCartOnLogout);

export const useTotalItems = () => useCartStore((state) =>
  state.cart.reduce((sum, item) => sum + item.quantity, 0)
);
export const useTotalPrice = () => useCartStore((state) =>
  state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);
export const useIsCartEmpty = () => useCartStore((state) => state.cart.length === 0);

export const useCartActions = () => ({
  addToCart: useAddToCart(),
  removeFromCart: useRemoveFromCart(),
  updateQuantity: useUpdateQuantity(),
  updateNote: useUpdateNote(),
  clearCart: useClearCart(),
});

export const useCartTotals = () => ({
  totalItems: useTotalItems(),
  totalPrice: useTotalPrice(),
  isEmpty: useIsCartEmpty(),
});