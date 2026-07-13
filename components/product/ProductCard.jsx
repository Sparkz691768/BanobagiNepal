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
      {/* Image — fixed square ratio on mobile, 3/4 on desktop */}
      <div className="relative aspect-square sm:aspect-[3/4] bg-gray-50 overflow-hidden mb-3">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out p-2"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-muted text-[10px] tracking-widest uppercase">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="bg-primary text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 tracking-widest">
              -{discount}%
            </span>
          )}
          {product.stock < 1 && (
            <span className="bg-dark text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 tracking-widest uppercase">
              Sold Out
            </span>
          )}
        </div>

        {product.stock < 1 && <div className="absolute inset-0 bg-white/50" />}

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock < 1}
          className={[
            'absolute bottom-0 left-0 right-0',
            'bg-dark/95 text-white text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase py-3',
            'flex items-center justify-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out',
            'touch-visible',
          ].join(' ')}
        >
          <FiShoppingBag size={12} />
          Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-[9px] sm:text-[10px] text-muted uppercase tracking-[0.2em]">Banobagi</p>
        <h3 className="text-xs sm:text-sm font-medium text-body leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating || 0} readonly size={10} />
          <span className="text-[10px] text-muted">({product.review_count || 0})</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
          <span className="text-xs sm:text-sm font-semibold text-dark">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-[10px] sm:text-xs text-muted line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
