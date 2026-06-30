'use client'

import { useEffect, useState } from 'react'
import { FiPackage, FiRefreshCw, FiShield, FiAward } from 'react-icons/fi'

export default function TrustBar() {
  const [freeShipping, setFreeShipping] = useState('2,000')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.free_shipping_amount) {
          setFreeShipping(Number(d.free_shipping_amount).toLocaleString())
        }
      })
      .catch(() => {})
  }, [])

  const items = [
    { icon: FiShield, label: '100% Authentic', sub: 'Sourced directly from Korea' },
    { icon: FiPackage, label: 'Free Shipping', sub: `On orders over Rs. ${freeShipping}` },
    { icon: FiAward, label: 'Dermatologist Tested', sub: 'Clinically approved formulas' },
    { icon: FiRefreshCw, label: 'Easy Returns', sub: '3-day hassle-free returns' },
  ]

  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 px-6 py-8 text-center sm:text-left">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-primary/20 bg-light-fill">
                <item.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-dark uppercase">{item.label}</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
