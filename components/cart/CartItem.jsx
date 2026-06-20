'use client'

import Image from 'next/image'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { formatPrice } from '@/lib/utils'
import useCart from '@/hooks/useCart'

export default function CartItem({ item }) {
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0">
        {item.images?.[0] ? (
          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-body leading-snug mb-1 truncate">{item.name}</h3>
        <p className="text-sm font-semibold text-primary mb-3">{formatPrice(item.price)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-200">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 hover:bg-gray-50 transition-colors"
            >
              <FiMinus size={12} />
            </button>
            <span className="px-3 text-sm w-8 text-center">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.stock != null && item.quantity >= item.stock}
              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiPlus size={12} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-muted hover:text-red-500 transition-colors"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
