'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

const COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-900' },
  { bg: 'bg-sky-50', text: 'text-sky-900' },
  { bg: 'bg-indigo-50', text: 'text-indigo-900' },
  { bg: 'bg-purple-50', text: 'text-purple-900' },
  { bg: 'bg-amber-50', text: 'text-amber-900' },
  { bg: 'bg-pink-50', text: 'text-pink-900' },
  { bg: 'bg-rose-50', text: 'text-rose-900' },
  { bg: 'bg-teal-50', text: 'text-teal-900' },
]

export default function CategorySection() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        // Show subcategories if hierarchy exists, otherwise show all
        const subs = data.filter((c) => c.parent_id)
        setCategories(subs.length > 0 ? subs : data)
      })
      .catch(() => {})
  }, [])

  if (categories.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted mb-3">Explore</p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-dark">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat, i) => {
          const { bg, text } = COLORS[i % COLORS.length]
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`group relative ${bg} aspect-square flex flex-col items-center justify-center gap-3 overflow-hidden transition-all duration-300 hover:shadow-md`}
            >
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/5 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300" />
              <span className={`relative font-display text-xl sm:text-2xl font-light ${text} text-center px-3`}>
                {toTitleCase(cat.name)}
              </span>
              <span className="relative text-[10px] tracking-[0.2em] uppercase text-muted/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop Now
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
