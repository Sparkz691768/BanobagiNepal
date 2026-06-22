'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown, FiPackage } from 'react-icons/fi'
import useCart from '@/hooks/useCart'

const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

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
      .then((data) => {
        if (!Array.isArray(data)) return
        setCategories(data)
      })
  }, [])

  // Build tree: main categories with their subcategories
  const mainCategories = categories.filter((c) => !c.parent_id)
  const getSubsFor = (id) => categories.filter((c) => c.parent_id === id)

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
            {/* Shop mega menu */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="nav-link flex items-center gap-1" type="button">
                Shop <FiChevronDown size={14} />
              </button>
              {shopOpen && (
                <div className="absolute top-full left-0 z-50 bg-white shadow-2xl border border-gray-100"
                  style={{ minWidth: mainCategories.length > 0 ? `${Math.min(mainCategories.length, 4) * 180}px` : '220px' }}
                >
                  {/* All Products link */}
                  <div className="px-6 py-3 border-b border-gray-100">
                    <Link
                      href="/shop"
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                      onClick={() => setShopOpen(false)}
                    >
                      <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                      All Products
                    </Link>
                  </div>

                  {mainCategories.length > 0 ? (
                    /* Mega menu columns */
                    <div className={`grid py-5 px-6 gap-x-8 gap-y-1`}
                      style={{ gridTemplateColumns: `repeat(${Math.min(mainCategories.length, 4)}, minmax(160px, 1fr))` }}
                    >
                      {mainCategories.map((cat) => {
                        const subs = getSubsFor(cat.id)
                        return (
                          <div key={cat.id} className="min-w-0">
                            <Link
                              href={`/shop?category=${cat.slug}`}
                              className="block text-xs font-semibold tracking-[0.15em] uppercase text-dark hover:text-primary transition-colors mb-2"
                              onClick={() => setShopOpen(false)}
                            >
                              {toTitleCase(cat.name)}
                            </Link>
                            {subs.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/shop?category=${sub.slug}`}
                                className="block text-sm text-muted hover:text-primary transition-colors py-1 truncate"
                                onClick={() => setShopOpen(false)}
                              >
                                {toTitleCase(sub.name)}
                              </Link>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    /* Fallback: flat list when no parent categories set */
                    <div className="py-3">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/shop?category=${c.slug}`}
                          className="block px-6 py-2 text-sm text-body hover:text-primary hover:bg-light-fill transition-colors"
                          onClick={() => setShopOpen(false)}
                        >
                          {toTitleCase(c.name)}
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
                <div className="absolute top-full left-0 w-52 bg-white shadow-xl border border-gray-100 py-3 z-50 rounded-sm">
                  {brandLinks.map((bl) => (
                    <Link
                      key={bl.href}
                      href={bl.href}
                      className="block px-5 py-2 text-sm text-body hover:text-primary hover:pl-6 transition-all duration-150"
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
            <Link href="/shop" className="text-body text-sm font-semibold py-3 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
              All Products
            </Link>
            {mainCategories.map((cat) => {
              const subs = getSubsFor(cat.id)
              return (
                <div key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="block text-body text-sm font-medium py-3 border-b border-gray-50 hover:text-primary transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {toTitleCase(cat.name)}
                  </Link>
                  {subs.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/shop?category=${sub.slug}`}
                      className="block text-muted text-sm py-2 pl-5 border-b border-gray-50 border-l-2 border-l-primary/20 hover:text-primary hover:border-l-primary transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {toTitleCase(sub.name)}
                    </Link>
                  ))}
                </div>
              )
            })}
            {/* Fallback: show flat list when no parent categories exist */}
            {mainCategories.length === 0 && categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="text-muted text-sm py-2.5 pl-4 border-b border-gray-50 border-l-2 border-l-primary/20 hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {toTitleCase(c.name)}
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
