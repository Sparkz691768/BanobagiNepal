'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    image: '/images/home/banobagi-in-the-world.jpg',
    alt: 'BANOBAGI in the world',
    eyebrow: 'New Arrival',
    title: 'PDRN Volumizing\nEye Cream Launch',
    sub: 'Powered by PDRN × Volufiline™ for targeted wrinkle care',
    href: '/shop',
  },
  {
    image: '/images/home/banobagi-products-display.jpg',
    alt: 'BANOBAGI products display',
    eyebrow: 'Best Seller',
    title: 'Jelly Mask\nCollection',
    sub: 'Intensive hydration & barrier repair with collagen gel technology',
    href: '/shop',
  },
  {
    image: '/images/home/banobagi-pdrn-products.jpg',
    alt: 'BANOBAGI PDRN products',
    eyebrow: 'Dermatologist Approved',
    title: 'Milk Thistle\nRepair Line',
    sub: 'Clinically formulated for sensitive skin with natural milk thistle extract',
    href: '/shop',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => advance(1), 5500)
    return () => clearInterval(timer)
  }, [current])

  function advance(dir) {
    setAnimating(true)
    setTimeout(() => {
      setCurrent((c) => (c + dir + slides.length) % slides.length)
      setAnimating(false)
    }, 250)
  }

  function goTo(i) {
    if (i === current) return
    setAnimating(true)
    setTimeout(() => { setCurrent(i); setAnimating(false) }, 250)
  }

  const slide = slides[current]

  return (
    <section className="relative bg-[#e8edf1] overflow-hidden">

      {/* ── MOBILE layout: image top, text bottom ── */}
      <div className="sm:hidden flex flex-col">
        {/* Image */}
        <div className={`relative w-full h-56 transition-all duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-contain object-center p-4"
          />
        </div>
        {/* Text */}
        <div className={`px-6 pb-10 pt-2 transition-all duration-300 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold mb-2">{slide.eyebrow}</p>
          <h1 className="font-display text-2xl font-semibold text-dark leading-tight mb-3 whitespace-pre-line">{slide.title}</h1>
          <p className="text-xs text-muted leading-relaxed mb-5">{slide.sub}</p>
          <Link href={slide.href} className="inline-flex items-center text-xs font-semibold tracking-[0.2em] uppercase text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors">
            Shop Now
          </Link>
        </div>
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 pb-4">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'bg-primary w-5 h-1.5' : 'bg-gray-400/40 w-1.5 h-1.5'}`}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP layout: text left, image right ── */}
      <div className="hidden sm:block relative" style={{ height: '520px' }}>
        {/* Left text */}
        <div className={`absolute left-0 top-0 bottom-0 z-20 flex flex-col justify-center px-16 max-w-sm transition-all duration-300 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold mb-4">{slide.eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold text-dark leading-tight mb-4 whitespace-pre-line">{slide.title}</h1>
          <p className="text-sm text-muted leading-relaxed mb-8">{slide.sub}</p>
          <Link href={slide.href} className="inline-flex items-center self-start text-xs font-semibold tracking-[0.2em] uppercase text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors">
            Shop Now
          </Link>
        </div>

        {/* Right image */}
        <div className={`absolute right-0 top-0 bottom-0 w-3/5 transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={current === 0}
            sizes="60vw"
            className="object-contain object-center p-8"
          />
        </div>

        {/* Arrows */}
        <button type="button" onClick={() => advance(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center bg-white/70 hover:bg-white transition-colors text-dark">
          <FiChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => advance(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center bg-white/70 hover:bg-white transition-colors text-dark">
          <FiChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'bg-primary w-5 h-1.5' : 'bg-gray-400/40 w-1.5 h-1.5 hover:bg-gray-500/60'}`}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-300/50" />
    </section>
  )
}
