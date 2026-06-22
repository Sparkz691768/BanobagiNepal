'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiTag,
  FiUsers,
  FiChevronRight,
  FiSettings,
} from 'react-icons/fi'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: FiGrid },
  { label: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
  { label: 'Products', href: '/admin/products', icon: FiPackage },
  { label: 'Categories', href: '/admin/categories', icon: FiTag },
  { label: 'Employees', href: '/admin/employees', icon: FiUsers, adminOnly: true },
  { label: 'Settings', href: '/admin/settings', icon: FiSettings, adminOnly: true },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const filteredNav = navItems.filter((item) => !item.adminOnly || isAdmin)

  function isActive(item) {
    return item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  }

  return (
    <div className="pt-[96px] flex min-h-screen">
      {/* ── Desktop sidebar ── */}
      <aside className="w-56 bg-dark text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="px-4 py-6 border-b border-white/10">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-1">Panel</p>
          <p className="font-display text-lg font-medium">
            {isAdmin ? 'Admin' : 'Employee'}
          </p>
        </div>
        <nav className="py-4 flex-1">
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                isActive(item)
                  ? 'bg-primary text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} />
                {item.label}
              </div>
              {isActive(item) && <FiChevronRight size={14} />}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Page content ── */}
      <main className="flex-1 bg-gray-50 overflow-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* ── Mobile bottom nav bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark text-white border-t border-white/10 z-40 safe-bottom">
        <div className="flex items-stretch">
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 text-[10px] tracking-wide transition-colors ${
                isActive(item)
                  ? 'text-white bg-primary/60'
                  : 'text-white/50'
              }`}
            >
              <item.icon size={18} />
              <span className="leading-none">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
