'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

export default function CategorySection() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        const subs = data.filter((c) => c.parent_id)
        setCategories(subs.length > 0 ? subs : data)
      })
      .catch(() => {})
  }, [])

  if (categories.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted mb-3">Collections</p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-dark">Shop by Category</h2>
        </div>
        <Link href="/shop" className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-primary hover:text-accent transition-colors font-medium">
          View All <FiArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative bg-white aspect-square flex flex-col items-center justify-center gap-2 overflow-hidden hover:bg-dark transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative font-display text-xl sm:text-2xl font-light text-dark group-hover:text-white transition-colors duration-500 text-center px-4 leading-tight">
              {toTitleCase(cat.name)}
            </span>
            <span className="relative flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-muted group-hover:text-white/60 transition-colors duration-500">
              Shop Now <FiArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link href="/shop" className="text-xs tracking-widest uppercase text-primary font-medium">
          View All Categories →
        </Link>
      </div>
    </section>
  )
}
