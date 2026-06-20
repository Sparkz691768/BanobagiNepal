'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { formatPrice, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { FiMessageSquare } from 'react-icons/fi'

export default function AdminOrdersPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-muted">Loading orders...</div>

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Manage</p>
        <h1 className="font-display text-3xl font-light text-dark">All Orders</h1>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="overflow-x-auto -mx-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order', 'Customer', 'City', 'Status', 'Payment', isAdmin ? 'Amount' : null, 'Date', ''].filter(Boolean).map((h) => (
                  <th key={h} className="text-left text-xs font-semibold tracking-widest uppercase text-muted px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline text-xs font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-body">{order.shipping_name}</td>
                  <td className="px-4 py-3 text-muted text-xs">{order.shipping_city}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  {isAdmin && <td className="px-4 py-3 font-medium text-body">{formatPrice(order.total_amount)}</td>}
                  <td className="px-4 py-3 text-muted text-xs">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-muted hover:text-primary">
                      <FiMessageSquare size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="py-16 text-center text-muted text-sm">No orders yet.</div>
        )}
      </div>
    </div>
  )
}
