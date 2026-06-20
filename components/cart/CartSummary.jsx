'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { formatPrice } from '@/lib/utils'
import useCart from '@/hooks/useCart'

const FREE_SHIPPING = 2000

export default function CartSummary() {
  const items = useCart((s) => s.items)
  const { data: session } = useSession()
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shippingFree = total >= FREE_SHIPPING
  const remaining = FREE_SHIPPING - total
  const checkoutHref = session ? '/checkout' : '/login?callbackUrl=/checkout'

  return (
    <div className="border border-gray-200 p-6 bg-white">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-6">
        Order Summary
      </h2>

      {/* Free shipping bar */}
      <div className="mb-6">
        {shippingFree ? (
          <p className="text-xs text-green-600 font-medium mb-2">
            ✓ You qualify for free shipping!
          </p>
        ) : (
          <p className="text-xs text-muted mb-2">
            Add {formatPrice(remaining)} more for free shipping
          </p>
        )}
        <div className="h-1.5 bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${Math.min((total / FREE_SHIPPING) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="text-body">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Shipping</span>
          <span className={shippingFree ? 'text-green-600' : 'text-body'}>
            {shippingFree ? 'FREE' : 'Calculated at checkout'}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <span className="font-semibold text-body">Total</span>
          <span className="font-semibold text-dark text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <Link href={checkoutHref} className="btn-primary w-full block text-center">
        {session ? 'Proceed to Checkout' : 'Sign In to Checkout'}
      </Link>
    </div>
  )
}
