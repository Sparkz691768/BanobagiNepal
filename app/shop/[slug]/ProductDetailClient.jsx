'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { formatPrice, formatDate } from '@/lib/utils'
import StarRating from '@/components/product/StarRating'
import ReviewForm from '@/components/product/ReviewForm'
import useCart from '@/hooks/useCart'
import toast from 'react-hot-toast'

export default function ProductDetailClient({ product, initialReviews }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isGalleryPaused, setIsGalleryPaused] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState(initialReviews)
  const addItem = useCart((s) => s.addItem)

  const images = product.images?.length ? product.images : []
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null
  const maxQty = product.stock

  useEffect(() => {
    if (images.length < 2 || isGalleryPaused) return

    const timer = setTimeout(() => {
      setSelectedImage((current) => (current + 1) % images.length)
    }, 4000)

    return () => clearTimeout(timer)
  }, [selectedImage, images.length, isGalleryPaused])

  function showPreviousImage() {
    setSelectedImage((current) => (current - 1 + images.length) % images.length)
  }

  function showNextImage() {
    setSelectedImage((current) => (current + 1) % images.length)
  }

  function handleAddToCart() {
    if (product.stock < 1) return
    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
  }

  async function refreshReviews() {
    const res = await fetch(`/api/reviews?product_id=${product.id}`)
    if (res.ok) setReviews(await res.json())
  }

  return (
    <div className="pt-[96px] max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div
            className="relative aspect-square bg-gray-50 mb-4 overflow-hidden group/gallery"
            onMouseEnter={() => setIsGalleryPaused(true)}
            onMouseLeave={() => setIsGalleryPaused(false)}
          >
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
                No Image
              </div>
            )}
            {discount && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 tracking-widest">
                -{discount}%
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Show previous product image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-dark shadow-md flex items-center justify-center hover:bg-white hover:text-primary transition-all sm:opacity-0 sm:group-hover/gallery:opacity-100 focus:opacity-100"
                >
                  <FiChevronLeft size={23} />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label="Show next product image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-dark shadow-md flex items-center justify-center hover:bg-white hover:text-primary transition-all sm:opacity-0 sm:group-hover/gallery:opacity-100 focus:opacity-100"
                >
                  <FiChevronRight size={23} />
                </button>
                <span className="absolute right-4 bottom-4 rounded-full bg-dark/70 px-3 py-1 text-[11px] text-white tracking-wider">
                  {selectedImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={`Show product image ${i + 1}`}
                  aria-current={i === selectedImage ? 'true' : undefined}
                  className={`relative w-20 h-20 bg-gray-50 overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">
            {product.categories?.name || 'Banobagi'}
          </p>
          <h1 className="font-display text-4xl font-light text-dark mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating || 0} readonly size={18} />
            <span className="text-sm text-muted">({product.review_count || 0} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-medium text-dark">{formatPrice(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-lg text-muted line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-body leading-relaxed mb-8">{product.description}</p>
          )}

          {product.stock < 1 ? (
            <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-muted text-center mb-6">
              Currently Out of Stock
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-semibold tracking-widest uppercase text-body">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-4 text-sm w-10 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <span className="text-xs text-muted">{product.stock} in stock</span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                <FiShoppingBag size={16} />
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-gray-100 pt-12">
        <h2 className="font-display text-3xl font-light text-dark mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">
              Write a Review
            </h3>
            <ReviewForm productId={product.id} onReviewAdded={refreshReviews} />
          </div>
          <div>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-body">{review.users?.name || 'Customer'}</span>
                      <span className="text-xs text-muted">{formatDate(review.created_at)}</span>
                    </div>
                    <StarRating rating={review.rating} readonly size={14} />
                    {review.comment && (
                      <p className="text-sm text-body mt-2 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
