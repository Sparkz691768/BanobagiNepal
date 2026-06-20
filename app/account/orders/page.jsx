'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatPrice, formatDate, STATUS_COLORS, STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'

export default function AccountOrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session === undefined) return // still loading
    if (!session) { setLoading(false); return }
    fetchOrders()
  }, [session])

  async function fetchOrders() {
    try {
      // Customers fetch their own orders via admin API (filtered by user)
      const res = await fetch('/api/account/orders')
      if (res.ok) setOrders(await res.json())
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="pt-[96px] flex items-center justify-center min-h-screen text-muted">Loading...</div>

  return (
    <div className="pt-[96px] max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Account</p>
        <h1 className="font-display text-4xl font-light text-dark">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn-primary inline-block px-8 py-3">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border border-gray-200 p-5 bg-white hover:border-primary transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm font-medium text-body">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className="text-sm font-semibold text-dark">{formatPrice(order.total_amount + (order.delivery_fee || 0))}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

