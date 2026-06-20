'use client'

import Link from 'next/link'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import useCart from '@/hooks/useCart'
import { FiShoppingBag } from 'react-icons/fi'

export default function CartPage() {
  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s._hasHydrated)

  return (
    <div className="pt-[96px] max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Your</p>
        <h1 className="font-display text-4xl font-light text-dark">Shopping Cart</h1>
      </div>

      {!hasHydrated ? (
        <div className="text-center py-24 text-muted text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <FiShoppingBag size={48} className="text-muted mx-auto mb-4" />
          <p className="text-lg text-muted mb-6">Your cart is empty</p>
          <Link href="/shop" className="btn-primary inline-block px-10 py-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="border-t border-gray-200">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  )
}

