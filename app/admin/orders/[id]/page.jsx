'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { formatPrice, formatDate, STATUS_COLORS, STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import ChatWindow from '@/components/chat/ChatWindow'
import DeliveryCard from '@/components/delivery/DeliveryCard'
import { FiTruck, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminOrderDetailPage({ params }) {
  const { data: session } = useSession()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelivery, setShowDelivery] = useState(false)
  const [deliveryFeeInput, setDeliveryFeeInput] = useState('')
  const [savingFee, setSavingFee] = useState(false)

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

  async function handleSetDeliveryFee(fee) {
    setSavingFee(true)
    const isFree = fee === 0
    const newTotal = order.total_amount - (order.delivery_fee || 0) + fee
    const msg = isFree
      ? `Great news! Delivery is free for your order. Your total remains Rs. ${(order.total_amount - (order.delivery_fee || 0)).toLocaleString()}.`
      : `A delivery fee of Rs. ${fee.toLocaleString()} has been applied. Your updated total is Rs. ${newTotal.toLocaleString()}.`
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_fee: fee, _deliveryFeeMessage: msg }),
      })
      if (!res.ok) throw new Error('Failed')
      setOrder((o) => ({ ...o, delivery_fee: fee }))
      setDeliveryFeeInput('')
    } catch {
      alert('Failed to update delivery fee')
    } finally {
      setSavingFee(false)
    }
  }

  if (loading) return <div className="p-8 text-muted">Loading...</div>
  if (!order) return <div className="p-8 text-muted">Order not found</div>

  const items = Array.isArray(order.items) ? order.items : []
  const isAdmin = session?.user?.role === 'admin'
  const isStaff = session?.user?.role === 'admin' || session?.user?.role === 'employee'
  const canAssignDelivery = order.payment_status === 'paid' && order.status !== 'out_for_delivery' && order.status !== 'delivered' && order.status !== 'cancelled'

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <Link href="/admin/orders" className="flex items-center gap-1 text-muted hover:text-primary text-sm mb-4">
          <FiArrowLeft size={14} /> Back to Orders
        </Link>
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Order Detail</p>
        <h1 className="font-display text-3xl font-light text-dark">
          #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="text-sm text-muted mt-1">{formatDate(order.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white border border-gray-200 p-5">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">Order Status</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`text-xs font-semibold px-3 py-1.5 ${STATUS_COLORS[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
              <span className={`text-xs font-semibold px-3 py-1.5 ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>
                {order.payment_status === 'paid' ? 'Paid' : 'Awaiting Payment'}
              </span>
            </div>

            {canAssignDelivery && (
              <button
                type="button"
                onClick={() => setShowDelivery(!showDelivery)}
                className="flex items-center gap-2 btn-primary text-xs px-4 py-2"
              >
                <FiTruck size={14} />
                {showDelivery ? 'Hide Delivery Card' : 'Assign to Nepal Can'}
              </button>
            )}
          </div>

          {/* Delivery Fee */}
          {order.status !== 'cancelled' && (
            <div className="bg-white border border-gray-200 p-5">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">Delivery Fee</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted">Current:</span>
                <span className="text-sm font-semibold text-body">
                  {order.delivery_fee > 0 ? formatPrice(order.delivery_fee) : 'Free'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={savingFee || order.delivery_fee === 0}
                  onClick={() => handleSetDeliveryFee(0)}
                  className="text-xs font-bold tracking-widest uppercase px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition-colors"
                >
                  Free Delivery
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 150"
                    value={deliveryFeeInput}
                    onChange={(e) => setDeliveryFeeInput(e.target.value)}
                    className="input-field w-28 text-sm py-2"
                  />
                  <button
                    type="button"
                    disabled={savingFee || !deliveryFeeInput}
                    onClick={() => handleSetDeliveryFee(Number(deliveryFeeInput))}
                    className="text-xs font-bold tracking-widest uppercase px-4 py-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
                  >
                    {savingFee ? 'Saving...' : 'Apply Fee'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Card */}
          {showDelivery && (
            <DeliveryCard
              order={order}
              onAssigned={() => {
                setShowDelivery(false)
                fetchOrder()
              }}
            />
          )}

          {/* Items */}
          <div className="bg-white border border-gray-200 p-5">
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

          {/* Shipping Info */}
          <div className="bg-white border border-gray-200 p-5">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">Shipping Info</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted">Name</span><span className="text-body font-medium">{order.shipping_name}</span>
              <span className="text-muted">Phone</span><span className="text-body">{order.shipping_phone}</span>
              <span className="text-muted">Email</span><span className="text-body">{order.shipping_email}</span>
              <span className="text-muted">Address</span><span className="text-body">{order.shipping_address}</span>
              <span className="text-muted">City</span><span className="text-body">{order.shipping_city}</span>
              {order.shipping_notes && (
                <><span className="text-muted">Notes</span><span className="text-body">{order.shipping_notes}</span></>
              )}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">Customer Chat</h2>
          <ChatWindow
            orderId={order.id}
            orderStatus={order.status}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  )
}
