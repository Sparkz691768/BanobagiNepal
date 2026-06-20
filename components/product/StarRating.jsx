'use client'

import { FiStar } from 'react-icons/fi'

export default function StarRating({ rating, onRate, readonly = false, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate && onRate(star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-500'}`}
        >
          <FiStar
            size={size}
            className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  )
}
