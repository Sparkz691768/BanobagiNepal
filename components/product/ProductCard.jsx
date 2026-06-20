'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingBag } from 'react-icons/fi'
import { formatPrice } from '@/lib/utils'
import StarRating from './StarRating'
import useCart from '@/hooks/useCart'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const addItem = useCart((s) => s.addItem)

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock < 1) return
    addItem(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  const image = product.images?.[0]
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-3">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-xs">
            No Image
          </div>
        )}

        {discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 tracking-widest">
            -{discount}%
          </span>
        )}

        {product.stock < 1 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted">Out of Stock</span>
          </div>
        )}

        {/*
          Desktop: slide up on hover.
          Touch devices: always visible at bottom (no hover state on touch).
          @media (hover: none) targets touchscreens.
        */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock < 1}
          className={[
            'absolute bottom-0 left-0 right-0',
            'bg-dark text-white text-xs font-semibold tracking-widest uppercase py-3',
            'flex items-center justify-center gap-2',
            'disabled:opacity-50',
            // Desktop: hidden until hover
            'translate-y-full group-hover:translate-y-0 transition-transform duration-300',
            // Touch: always visible
            'touch-visible',
          ].join(' ')}
        >
          <FiShoppingBag size={14} />
          Add to Cart
        </button>
      </div>

      <div>
        <p className="text-xs text-muted uppercase tracking-widest mb-1">Banobagi</p>
        <h3 className="text-sm font-medium text-body leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-1">
          <StarRating rating={product.rating || 0} readonly size={12} />
          <span className="text-xs text-muted">({product.review_count || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-dark">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-muted line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
