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
    sub: 'Powered by PDRN × Volufiline™\nfor targeted wrinkle care',
    href: '/shop',
  },
  {
    image: '/images/home/banobagi-products-display.jpg',
    alt: 'BANOBAGI products display',
    eyebrow: 'Best Seller',
    title: 'Jelly Mask\nCollection',
    sub: 'Intensive hydration & barrier repair\nwith collagen gel technology',
    href: '/shop',
  },
  {
    image: '/images/home/banobagi-pdrn-products.jpg',
    alt: 'BANOBAGI PDRN products',
    eyebrow: 'Dermatologist Approved',
    title: 'Milk Thistle\nRepair Line',
    sub: 'Clinically formulated for sensitive skin\nwith natural milk thistle extract',
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
    <section className="relative bg-[#e8edf1] overflow-hidden" style={{ height: '560px' }}>

      {/* Left: Text */}
      <div className={`absolute left-0 top-0 bottom-0 z-20 flex flex-col justify-center px-10 sm:px-16 max-w-xs sm:max-w-sm transition-all duration-300 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#1A5C8A] font-semibold mb-4">{slide.eyebrow}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A2E] leading-tight mb-4 whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="text-sm text-[#7F8C8D] leading-relaxed mb-8 whitespace-pre-line">{slide.sub}</p>
        <Link
          href={slide.href}
          className="inline-flex items-center self-start text-xs font-semibold tracking-[0.2em] uppercase text-[#1A5C8A] border-b border-[#1A5C8A]/40 pb-0.5 hover:border-[#1A5C8A] transition-colors"
        >
          Shop Now
        </Link>
      </div>

      {/* Right: Product Image */}
      <div className={`absolute right-0 top-0 bottom-0 w-1/2 sm:w-3/5 transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          priority={current === 0}
          sizes="60vw"
          className="object-contain object-center p-6"
        />
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300/50" />

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`transition-all duration-400 rounded-full ${i === current ? 'bg-[#1A5C8A] w-5 h-1.5' : 'bg-gray-400/40 w-1.5 h-1.5 hover:bg-gray-500/60'}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        type="button"
        onClick={() => advance(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center bg-white/60 hover:bg-white transition-colors text-[#1A1A2E]"
      >
        <FiChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => advance(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center bg-white/60 hover:bg-white transition-colors text-[#1A1A2E]"
      >
        <FiChevronRight size={18} />
      </button>
    </section>
  )
}
