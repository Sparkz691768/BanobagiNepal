'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FiSearch, FiX } from 'react-icons/fi'
import ProductGrid from '@/components/product/ProductGrid'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

const sortOptions = [
  { value: 'created_at', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
]

export default function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Local search input state — debounced before pushing to URL
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const debounceRef = useRef(null)

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'created_at'

  function setParam(key, value) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/shop?${params.toString()}`, { scroll: false })
  }

  function handleSearchChange(e) {
    const val = e.target.value
    setSearchInput(val)
    // Debounce: wait 400ms after last keystroke before updating URL
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setParam('search', val)
    }, 400)
  }

  function clearSearch() {
    setSearchInput('')
    clearTimeout(debounceRef.current)
    setParam('search', '')
  }

  useEffect(() => {
    return () => clearTimeout(debounceRef.current)
  }, [])

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setProducts([])
          setError(data?.error || 'Failed to load products')
        }
        setLoading(false)
      })
      .catch(() => {
        setProducts([])
        setError('Network error. Please check your connection.')
        setLoading(false)
      })
  }, [category, search, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Collection</p>
        <h1 className="font-display text-4xl font-light text-dark">
          {category ? (categories.find((c) => c.slug === category)?.name || 'Shop') : 'All Products'}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 flex-wrap">
        {/* Search */}
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
          <input
            type="search"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="input-field pl-9 pr-9"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark min-h-0 min-w-0 p-0"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setParam('category', e.target.value)}
          className="input-field w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="input-field w-full sm:w-auto"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-muted text-sm mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-outline text-xs px-6 py-2"
          >
            Try Again
          </button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
