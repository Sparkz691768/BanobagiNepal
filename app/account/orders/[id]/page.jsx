'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { formatPrice, formatDate, STATUS_COLORS, STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import ChatWindow from '@/components/chat/ChatWindow'
import Image from 'next/image'

export default function CustomerOrderDetailPage({ params }) {
  const { data: session } = useSession()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  async function fetchOrder() {
    const res = await fetch(`/api/orders/${params.id}`)
    if (res.ok) setOrder(await res.json())
    setLoading(false)
  }

  function handleStatusChange(status, paymentStatus) {
    setOrder((o) => ({
      ...o,
      status: status || o.status,
      payment_status: paymentStatus || o.payment_status,
    }))
  }

  if (loading) return <div className="pt-[96px] flex items-center justify-center min-h-screen text-muted">Loading...</div>
  if (!order) return <div className="pt-[96px] flex items-center justify-center min-h-screen text-muted">Order not found</div>

  const items = Array.isArray(order.items) ? order.items : []

  return (
    <div className="pt-[96px] max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Your Order</p>
        <h1 className="font-display text-3xl font-light text-dark">
          #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="text-sm text-muted mt-1">{formatDate(order.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        {/* Order Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Status */}
          <div className="border border-gray-200 p-5 bg-white">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">Status</h2>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-3 py-1.5 ${STATUS_COLORS[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
              <span className={`text-xs font-semibold px-3 py-1.5 ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>
                {order.payment_status === 'paid' ? 'Payment Confirmed' : 'Awaiting Payment'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="border border-gray-200 p-5 bg-white">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">Items</h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-14 h-16 bg-gray-50 flex-shrink-0">
                    {item.images?.[0] && (
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-body">{item.name}</p>
                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-body">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-body">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Delivery</span>
                <span className={order.delivery_fee > 0 ? 'text-body' : 'text-green-600 font-medium'}>
                  {order.delivery_fee > 0 ? formatPrice(order.delivery_fee) : 'Free'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-semibold text-body">Grand Total</span>
                <span className="font-display text-lg font-medium text-dark">
                  {formatPrice(order.total_amount + (order.delivery_fee || 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="border border-gray-200 p-5 bg-white">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">Delivery Address</h2>
            <p className="text-sm text-body">{order.shipping_name}</p>
            <p className="text-sm text-muted">{order.shipping_address}</p>
            <p className="text-sm text-muted">{order.shipping_city}</p>
            <p className="text-sm text-muted">{order.shipping_phone}</p>
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-2">
          <div className="bg-light-fill border border-blue-100 p-5 mb-6">
            <p className="text-sm text-primary font-medium leading-relaxed">
              {order.payment_status === 'unpaid'
                ? 'Please wait while our team provides your payment QR code in the chat below.'
                : order.status === 'confirmed'
                ? 'Your payment has been confirmed! Your order is being prepared.'
                : `Your order is currently ${STATUS_LABELS[order.status]}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">
          Chat with Us
        </h2>
        <ChatWindow
          orderId={order.id}
          orderStatus={order.status}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  )
}
