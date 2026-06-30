'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'

export default function ProductRecommendations({ purchasedItems = [] }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const purchasedIds = useMemo(
    () => purchasedItems.map((item) => item.id || item.product_id).filter(Boolean),
    [purchasedItems]
  )
  const purchasedKey = purchasedIds.join(',')

  useEffect(() => {
    let active = true

    fetch('/api/products?sort=rating')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setProducts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (active) setProducts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [purchasedKey])

  const recommendations = useMemo(() => {
    const purchasedSet = new Set(purchasedIds)
    const purchasedCategories = new Set(
      products
        .filter((product) => purchasedSet.has(product.id))
        .flatMap((product) => product.category_ids || [])
    )

    return products
      .filter((product) => !purchasedSet.has(product.id) && product.stock > 0)
      .map((product) => {
        const categoryMatches = (product.category_ids || []).filter((id) => purchasedCategories.has(id)).length
        const score = categoryMatches * 100 + (product.is_featured ? 20 : 0) + Number(product.rating || 0)
        return { product, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ product }) => product)
  }, [products, purchasedIds])

  if (!loading && recommendations.length === 0) return null

  return (
    <section className="mt-14 border-t border-gray-200 pt-12">
      <div className="mb-7">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Recommended for You</p>
        <h2 className="font-display text-3xl font-light text-dark">Frequently Bought Together</h2>
        <p className="text-sm text-muted mt-2">
          Customers also choose these products to complete their skincare routine.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" aria-label="Loading recommendations">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 mb-4" />
              <div className="h-3 bg-gray-100 w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
