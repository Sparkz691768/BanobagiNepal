'use client'

import { useState } from 'react'
import { FiTruck } from 'react-icons/fi'
import CopyButton from './CopyButton'
import toast from 'react-hot-toast'

export default function DeliveryCard({ order, onAssigned }) {
  const [loading, setLoading] = useState(false)

  const totalPackages = order.items
    ? order.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0

  const deliveryText = `BANOBAGINEPAL
Delivery Order #BNB-${order.id?.slice(0, 8).toUpperCase()}
════════════════════════════
Recipient:  ${order.shipping_name}
Phone:      ${order.shipping_phone}
Address:    ${order.shipping_address}
City:       ${order.shipping_city}
════════════════════════════
Packages:   ${totalPackages}
════════════════════════════
Notes:      ${order.shipping_notes || 'None'}
════════════════════════════`

  async function handleMarkOutForDelivery() {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'out_for_delivery' }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Order marked as out for delivery')
      onAssigned?.()
    } catch {
      toast.error('Failed to update order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-gray-200 bg-white p-6 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <FiTruck className="text-primary" size={20} />
        <h3 className="text-xs font-semibold tracking-widest uppercase text-body">
          Nepal Can Delivery Details
        </h3>
      </div>

      <div className="font-mono text-xs bg-gray-50 p-4 border border-gray-100 whitespace-pre-wrap leading-relaxed text-body mb-4">
        {deliveryText}
      </div>

      <p className="text-[10px] text-red-500 tracking-wide uppercase font-medium mb-4">
        ⚠ No prices, amounts, or product names included
      </p>

      <div className="flex flex-col gap-2">
        <CopyButton text={deliveryText} />
        <button
          type="button"
          onClick={handleMarkOutForDelivery}
          disabled={loading || order.status === 'out_for_delivery'}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FiTruck size={14} />
          {order.status === 'out_for_delivery'
            ? 'Marked as Out for Delivery'
            : loading
            ? 'Updating...'
            : 'Mark as Out for Delivery'}
        </button>
      </div>
    </div>
  )
}
