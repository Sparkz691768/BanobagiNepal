'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown, FiPackage } from 'react-icons/fi'
import useCart from '@/hooks/useCart'

const brandLinks = [
  { label: 'Brand Story', href: '/brand#story' },
  { label: 'Our Philosophy', href: '/brand#philosophy' },
  { label: "Founder's Note", href: '/brand#founder' },
  { label: 'Press & Media', href: '/brand#media' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s._hasHydrated)
  const totalItems = hasHydrated ? items.reduce((sum, i) => sum + i.quantity, 0) : 0
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [brandOpen, setBrandOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [shopOpen, setShopOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data) })
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar */}
      <div className="bg-primary text-white text-center text-xs py-2 tracking-widest uppercase font-medium px-4">
        <span className="hidden sm:inline">Free shipping on orders over Rs. 2,000 &nbsp;·&nbsp; Authentic Korean Beauty</span>
        <span className="sm:hidden">Free shipping over Rs. 2,000</span>
      </div>

      {/* Main nav */}
      <nav
        className={`transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold text-dark tracking-wide">
              BanobagiNepal
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted font-sans">
              Korean Beauty
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="nav-link flex items-center gap-1" type="button">
                Shop <FiChevronDown size={14} />
              </button>
              {shopOpen && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    href="/shop"
                    className="block px-4 py-2 text-sm font-medium text-primary hover:bg-light-fill transition-colors"
                    onClick={() => setShopOpen(false)}
                  >
                    All Products
                  </Link>
                  {categories.length > 0 && (
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/shop?category=${c.slug}`}
                          className="block px-4 py-2 text-sm text-body hover:bg-light-fill hover:text-primary transition-colors"
                          onClick={() => setShopOpen(false)}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Brand dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBrandOpen(true)}
              onMouseLeave={() => setBrandOpen(false)}
            >
              <button className="nav-link flex items-center gap-1" type="button">
                Brand <FiChevronDown size={14} />
              </button>
              {brandOpen && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg border border-gray-100 py-2 z-50">
                  {brandLinks.map((bl) => (
                    <Link
                      key={bl.href}
                      href={bl.href}
                      className="block px-4 py-2 text-sm text-body hover:bg-light-fill hover:text-primary transition-colors"
                    >
                      {bl.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="nav-link">Our Story</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Orders */}
            {session && (
              <Link href="/account/orders" className="text-body hover:text-primary transition-colors" title="My Orders">
                <FiPackage size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative text-body hover:text-primary transition-colors">
              <FiShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User dropdown */}
            <div className="relative">
              <button
                type="button"
                className="text-body hover:text-primary transition-colors"
                onClick={() => setUserOpen((o) => !o)}
              >
                <FiUser size={20} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border border-gray-100 py-2 z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-body truncate">{session.user.name}</p>
                        <p className="text-xs text-muted truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-body hover:bg-light-fill"
                        onClick={() => setUserOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-body hover:bg-light-fill"
                        onClick={() => setUserOpen(false)}
                      >
                        My Orders
                      </Link>
                      {(session.user.role === 'admin' ||
                        session.user.role === 'employee') && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-primary font-medium hover:bg-light-fill"
                          onClick={() => setUserOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUserOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-body hover:bg-light-fill"
                        onClick={() => setUserOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-body hover:bg-light-fill"
                        onClick={() => setUserOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden text-body hover:text-primary"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-2 flex flex-col">
            {/* Shop with categories */}
            <Link href="/shop" className="text-body text-sm font-medium py-3 border-b border-gray-50" onClick={() => setMenuOpen(false)}>
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="text-muted text-sm py-2.5 pl-3 border-b border-gray-50 border-l-2 border-l-gray-100 hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {c.name}
              </Link>
            ))}

            {/* Brand sub-links */}
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted mt-3 mb-1">Brand</p>
            {brandLinks.map((bl) => (
              <Link
                key={bl.href}
                href={bl.href}
                className="text-body text-sm py-3 pl-3 border-b border-gray-50 border-l-2 border-l-light-fill"
                onClick={() => setMenuOpen(false)}
              >
                {bl.label}
              </Link>
            ))}
            <Link href="/about" className="text-body text-sm font-medium py-3 border-b border-gray-50" onClick={() => setMenuOpen(false)}>
              Our Story
            </Link>
            <Link href="/contact" className="text-body text-sm font-medium py-3 border-b border-gray-50" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>

            {/* Account shortcuts */}
            <div className="pt-3 pb-2 flex flex-col gap-1">
              {session ? (
                <>
                  <p className="text-xs text-muted pb-1">Signed in as <span className="text-body font-medium">{session.user.name}</span></p>
                  <Link href="/account" className="text-sm text-body py-2" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link href="/account/orders" className="text-sm text-body py-2" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  {(session.user.role === 'admin' || session.user.role === 'employee') && (
                    <Link href="/admin" className="text-sm text-primary font-medium py-2" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                  )}
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                    className="text-sm text-red-600 text-left py-2 min-h-0"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-primary font-medium py-2" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link href="/register" className="text-sm text-body py-2" onClick={() => setMenuOpen(false)}>Create Account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
