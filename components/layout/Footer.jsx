'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'

const SOCIAL_LINKS = [
  { icon: FaInstagram, href: 'https://www.instagram.com/banobagiofficialnepal', label: 'Instagram' },
  { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61586055162580', label: 'Facebook' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@banobagiofficialinnepal', label: 'TikTok' },
]

const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to subscribe')
      }
      toast.success('Thank you for subscribing!')
      setEmail('')
    } catch (err) {
      toast.error(err.message || 'Failed to subscribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col xs:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 min-w-0 px-4 py-3 text-sm text-body bg-white border border-gray-200 focus:outline-none focus:border-primary"
          style={{ borderRadius: 0 }}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white text-xs font-semibold tracking-widest uppercase px-5 py-3 hover:bg-accent transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-60"
          style={{ minHeight: '44px' }}
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </div>
    </form>
  )
}

export default function Footer() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const subCategories = categories.filter((c) => c.parent_id)
  const shopLinks = subCategories.length > 0 ? subCategories : categories

  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex flex-col leading-none mb-4">
              <span className="font-display text-2xl font-semibold tracking-wide">BanobagiNepal</span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-muted font-sans">Korean Beauty</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Authentic Korean medical-grade beauty products, carefully curated for the Nepali market.
            </p>
            {/* Contact email */}
            <a
              href="mailto:asainternational260328@gmail.com"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mb-4"
            >
              <FiMail size={13} />
              asainternational260328@gmail.com
            </a>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-gray-400 hover:text-white transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="col-span-1">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-gray-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              {shopLinks.map((item) => (
                <li key={item.id}>
                  <Link href={`/shop?category=${item.slug}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {toTitleCase(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand links */}
          <div className="col-span-1">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Brand</h4>
            <ul className="space-y-2.5">
              <li><Link href="/brand#story" className="text-sm text-gray-300 hover:text-white transition-colors">Brand Story</Link></li>
              <li><Link href="/brand#philosophy" className="text-sm text-gray-300 hover:text-white transition-colors">Our Philosophy</Link></li>
              <li><Link href="/brand#founder" className="text-sm text-gray-300 hover:text-white transition-colors">Founder&apos;s Note</Link></li>
              <li><Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter — full width on mobile, normal on desktop */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">Get the latest arrivals and exclusive offers.</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-gray-500 order-2 sm:order-1">
            © {new Date().getFullYear()} BanobagiNepal. All rights reserved.
          </p>
          <div className="flex items-center gap-5 order-1 sm:order-2">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="text-gray-500 hover:text-white transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500 order-3">Authentic Korean Beauty · Nepal</p>
        </div>
      </div>
    </footer>
  )
}
