'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const slides = [
  {
    image: '/images/home/banobagi-in-the-world.jpg',
    alt: 'BANOBAGI in the world and professional beauty consultant CEO Ban, Jaeyong',
  },
  {
    image: '/images/home/banobagi-products-display.jpg',
    alt: 'BANOBAGI jelly mask, repair serum, and anti-aging cream product display',
  },
  {
    image: '/images/home/banobagi-pdrn-products.jpg',
    alt: 'BANOBAGI PDRN lifting ampoule, collagen gel mask, and anti-aging cream',
  },
  {
    bg: 'from-slate-900 via-slate-800 to-slate-900',
    eyebrow: 'New Arrivals',
    headline: 'Korean Medical\nBeauty',
    subheadline: 'Clinically Formulated · Dermatologist Approved',
    cta: 'Explore Collection',
    href: '/shop',
  },
  {
    bg: 'from-[#4F2BB8] via-primary to-[#4F2BB8]',
    eyebrow: 'Best Sellers',
    headline: 'Radiant Skin\nAwaits',
    subheadline: "Science-backed formulas from Korea's leading labs",
    cta: 'Shop Serums',
    href: '/shop?category=serum',
  },
  {
    bg: 'from-[#4F2BB8] via-accent to-[#4F2BB8]',
    eyebrow: 'Sun Protection',
    headline: 'Protect &\nRestore',
    subheadline: 'Advanced suncare and skin barrier solutions',
    cta: 'Shop Suncare',
    href: '/shop?category=suncare',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length)
        setAnimating(false)
      }, 300)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  function goTo(i) {
    if (i === current) return
    setAnimating(true)
    setTimeout(() => { setCurrent(i); setAnimating(false) }, 300)
  }

  const slide = slides[current]

  return (
    <section
      className={`bg-gradient-to-br ${slide.bg} relative flex items-center justify-center transition-all duration-700`}
      style={{ minHeight: '100svh' }}
    >
      {slide.image && (
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          priority={current === 0}
          sizes="100vw"
          className="object-contain bg-[#e8edf1]"
        />
      )}

      {/* Subtle grain overlay */}
      {!slide.image && <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />}

      {!slide.image && <div
        className={`relative z-10 text-center text-white max-w-4xl mx-auto px-6 transition-all duration-300 ${
          animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-8 h-px bg-white/40" />
          <p className="text-[11px] tracking-[0.45em] uppercase text-white/60 font-sans">
            {slide.eyebrow}
          </p>
          <span className="w-8 h-px bg-white/40" />
        </div>

        {/* Headline */}
        <h1 className="font-display text-6xl sm:text-8xl font-light leading-[1.05] mb-6 whitespace-pre-line">
          {slide.headline}
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base text-white/60 mb-12 font-sans font-light tracking-[0.15em] uppercase">
          {slide.subheadline}
        </p>

        {/* CTA */}
        <Link
          href={slide.href}
          className="group inline-flex items-center gap-3 border border-white/30 text-white text-xs font-semibold tracking-[0.2em] uppercase px-10 py-4 hover:bg-white hover:text-dark transition-all duration-300"
        >
          {slide.cta}
          <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>}

      {/* Slide number */}
      <div className="absolute bottom-10 right-10 text-white/30 font-sans text-xs tracking-[0.3em]">
        {String(current + 1).padStart(2, '0')}&nbsp;—&nbsp;{String(slides.length).padStart(2, '0')}
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ${
              i === current ? 'bg-white w-6 h-1.5' : 'bg-white/30 w-1.5 h-1.5 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-10 hidden sm:flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-8 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 w-full bg-white/60 h-1/2 animate-[slideDown_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  )
}
