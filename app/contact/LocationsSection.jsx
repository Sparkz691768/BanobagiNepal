'use client'

import { useState, useEffect } from 'react'
import { FiClock, FiMail, FiMapPin, FiPhone, FiShoppingBag, FiTruck, FiUser } from 'react-icons/fi'

function LocationCard({ entry, label, Icon }) {
  const { name, contact_person, phone, email, address, hours } = entry
  const details = [
    { key: 'contact', icon: FiUser, value: contact_person },
    { key: 'address', icon: FiMapPin, value: address },
    { key: 'phone', icon: FiPhone, value: phone, href: phone ? `tel:${phone.replace(/\s/g, '')}` : '' },
    { key: 'email', icon: FiMail, value: email, href: email ? `mailto:${email}` : '' },
    { key: 'hours', icon: FiClock, value: hours },
  ].filter((d) => d.value)

  return (
    <article className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-light-fill text-primary flex items-center justify-center">
          <Icon size={21} />
        </div>
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted">{label}</p>
          <h3 className="font-display text-2xl text-dark">{name || label}</h3>
        </div>
      </div>
      {details.length ? (
        <div className="space-y-3">
          {details.map(({ key, icon: DetailIcon, value, href }) => (
            <div key={key} className="flex items-start gap-3 text-sm text-muted">
              <DetailIcon className="mt-0.5 text-primary shrink-0" size={17} />
              {href ? <a href={href} className="hover:text-primary transition-colors">{value}</a> : <span>{value}</span>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Details will be updated soon.</p>
      )}
    </article>
  )
}

export default function LocationsSection() {
  const [distributors, setDistributors] = useState([])
  const [stores, setStores] = useState([])

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        try { setDistributors(JSON.parse(d.distributors || '[]')) } catch {}
        try { setStores(JSON.parse(d.stores || '[]')) } catch {}
      })
      .catch(() => {})
  }, [])

  if (distributors.length === 0 && stores.length === 0) return null

  return (
    <div className="space-y-8">
      {distributors.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">Authorized Distributors</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {distributors.map((entry, i) => (
              <LocationCard key={i} entry={entry} label="Authorized Distributor" Icon={FiTruck} />
            ))}
          </div>
        </div>
      )}
      {stores.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">Physical Stores</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((entry, i) => (
              <LocationCard key={i} entry={entry} label="Physical Store" Icon={FiShoppingBag} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
