import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Service } from '../types/index';

interface CartStore {
  // State
  cart: CartItem[];
  isHydrated: boolean;
  
  // Actions
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  updateNote: (serviceId: string, note: string) => void;
  clearCart: () => void;
  
  // Internal action for hydration
  setHydrated: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: [],
      isHydrated: false,

      // Actions
      addToCart: (service: Service) => {
        set((state) => {
          const existing = state.cart.find(item => item.serviceId === service.id);
          
          if (existing) {
            return {
              cart: state.cart.map(item =>
                item.serviceId === service.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          
          return {
            cart: [...state.cart, {
              serviceId: service.id,
              name: service.name,
              price: service.price,
              quantity: 1,
              addedAt: new Date(),
            }]
          };
        });
      },

      removeFromCart: (serviceId: string) => {
        set((state) => ({
          cart: state.cart.filter(item => item.serviceId !== serviceId)
        }));
      },

      updateQuantity: (serviceId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(serviceId);
          return;
        }
        
        set((state) => ({
          cart: state.cart.map(item =>
            item.serviceId === serviceId
              ? { ...item, quantity }
              : item
          )
        }));
      },

      updateNote: (serviceId: string, note: string) => {
        set((state) => ({
          cart: state.cart.map(item =>
            item.serviceId === serviceId
              ? { ...item, note }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // Hydration action
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // This runs after rehydration is complete
        state?.setHydrated();
      },
      // Only persist the cart array, not the hydration state
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// Selector hooks for better performance
export const useCart = () => useCartStore((state) => state.cart);

export const useIsCartHydrated = () => useCartStore((state) => state.isHydrated);

// Individual action hooks to prevent object creation
export const useAddToCart = () => useCartStore((state) => state.addToCart);
export const useRemoveFromCart = () => useCartStore((state) => state.removeFromCart);
export const useUpdateQuantity = () => useCartStore((state) => state.updateQuantity);
export const useUpdateNote = () => useCartStore((state) => state.updateNote);
export const useClearCart = () => useCartStore((state) => state.clearCart);

// Individual computed value hooks
export const useTotalItems = () => useCartStore((state) => 
  state.cart.reduce((sum, item) => sum + item.quantity, 0)
);

export const useTotalPrice = () => useCartStore((state) => 
  state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

export const useIsCartEmpty = () => useCartStore((state) => state.cart.length === 0);

// Legacy hooks for backward compatibility (use individual hooks instead)
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