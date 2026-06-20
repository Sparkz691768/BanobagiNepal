import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated(val) {
        set({ _hasHydrated: val })
      },

      addItem(product, quantity = 1) {
        const items = get().items
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },

      removeItem(id) {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity(id, quantity) {
        if (quantity < 1) {
          set({ items: get().items.filter((i) => i.id !== id) })
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart() {
        set({ items: [] })
      },
    }),
    {
      name: 'banobagiNepal-cart',
      // createJSONStorage uses a getter so localStorage is never accessed on the server
      storage: createJSONStorage(() => localStorage),
      // Skip SSR hydration to prevent server/client mismatch
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

// Manually trigger hydration only on the client
if (typeof window !== 'undefined') {
  useCart.persist.rehydrate()
}

export default useCart
