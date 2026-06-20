'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const slides = [
  {
    bg: 'bg-gradient-to-br from-slate-800 to-slate-900',
    headline: 'Korean Medical Beauty',
    subheadline: 'Clinically Formulated, Dermatologist Approved',
    cta: 'Explore Collection',
    href: '/shop',
  },
  {
    bg: 'bg-gradient-to-br from-primary/90 to-dark',
    headline: 'Radiant Skin Awaits',
    subheadline: "Science-backed formulas from Korea's leading labs",
    cta: 'Shop Serums',
    href: '/shop?category=serum',
  },
  {
    bg: 'bg-gradient-to-br from-body to-slate-800',
    headline: 'Protect & Restore',
    subheadline: 'Advanced suncare and skin barrier solutions',
    cta: 'Shop Suncare',
    href: '/shop?category=suncare',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <section className={`${slide.bg} relative flex items-center justify-center transition-all duration-1000`} style={{ minHeight: '100svh' }}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
        <p className="text-xs tracking-[0.4em] uppercase text-white/70 mb-4 font-sans">
          BanobagiNepal
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-light leading-tight mb-6">
          {slide.headline}
        </h1>
        <p className="text-base sm:text-lg text-white/80 mb-10 font-sans font-light tracking-wide">
          {slide.subheadline}
        </p>
        <Link
          href={slide.href}
          className="inline-block btn-primary bg-white text-dark hover:bg-light-fill hover:text-primary px-10 py-4"
        >
          {slide.cta}
        </Link>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 text-white/60 font-sans text-sm tracking-widest">
        {String(current + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(slides.length).padStart(2, '0')}
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
