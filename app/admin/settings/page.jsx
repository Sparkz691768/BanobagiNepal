'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { FiTrash2, FiPlus } from 'react-icons/fi'

const EMPTY_ENTRY = { name: '', contact_person: '', phone: '', email: '', address: '', hours: '' }

const LOCATION_FIELDS = [
  { key: 'name', label: 'Business / Location Name', placeholder: 'Enter name' },
  { key: 'contact_person', label: 'Contact Person', placeholder: 'Enter contact person' },
  { key: 'phone', label: 'Phone Number', placeholder: '+977 ...', type: 'tel' },
  { key: 'email', label: 'Email Address', placeholder: 'name@example.com', type: 'email' },
  { key: 'address', label: 'Address', placeholder: 'Enter full address', multiline: true },
  { key: 'hours', label: 'Opening / Contact Hours', placeholder: 'Sun–Fri, 10:00 AM–6:00 PM' },
]

function LocationCard({ entry, index, onChange, onDelete }) {
  return (
    <div className="border border-gray-200 p-4 mb-4 relative">
      <button
        type="button"
        onClick={() => onDelete(index)}
        className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
        title="Remove"
      >
        <FiTrash2 size={14} />
      </button>
      <div className="space-y-3">
        {LOCATION_FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="block text-xs font-medium text-body mb-1">{field.label}</span>
            {field.multiline ? (
              <textarea
                value={entry[field.key] || ''}
                onChange={(e) => onChange(index, field.key, e.target.value)}
                className="input-field w-full"
                placeholder={field.placeholder}
                rows={2}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={entry[field.key] || ''}
                onChange={(e) => onChange(index, field.key, e.target.value)}
                className="input-field w-full"
                placeholder={field.placeholder}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [announcement, setAnnouncement] = useState('')
  const [freeShipping, setFreeShipping] = useState('2000')
  const [distributors, setDistributors] = useState([{ ...EMPTY_ENTRY }])
  const [stores, setStores] = useState([{ ...EMPTY_ENTRY }])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        setAnnouncement(d.announcement || '')
        setFreeShipping(d.free_shipping_amount || '2000')

        // Load multi-entry arrays
        try {
          const dist = JSON.parse(d.distributors || '[]')
          setDistributors(dist.length > 0 ? dist : [{ ...EMPTY_ENTRY }])
        } catch {
          // Migrate legacy single entry
          const legacy = { name: d.distributor_name, contact_person: d.distributor_contact_person, phone: d.distributor_phone, email: d.distributor_email, address: d.distributor_address, hours: d.distributor_hours }
          setDistributors(legacy.name ? [legacy] : [{ ...EMPTY_ENTRY }])
        }

        try {
          const st = JSON.parse(d.stores || '[]')
          setStores(st.length > 0 ? st : [{ ...EMPTY_ENTRY }])
        } catch {
          const legacy = { name: d.store_name, contact_person: d.store_contact_person, phone: d.store_phone, email: d.store_email, address: d.store_address, hours: d.store_hours }
          setStores(legacy.name ? [legacy] : [{ ...EMPTY_ENTRY }])
        }

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function updateEntry(list, setList, index, key, value) {
    const updated = list.map((e, i) => i === index ? { ...e, [key]: value } : e)
    setList(updated)
  }

  function deleteEntry(list, setList, index) {
    if (list.length === 1) { setList([{ ...EMPTY_ENTRY }]); return }
    setList(list.filter((_, i) => i !== index))
  }

  async function saveField(key, value) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Saved!')
    } catch {
      toast.error('Failed to save')
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement,
          free_shipping_amount: freeShipping,
          distributors: JSON.stringify(distributors),
          stores: JSON.stringify(stores),
        }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return <div className="p-8 text-center text-muted text-sm">Admin access required.</div>
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Admin</p>
        <h1 className="font-display text-3xl font-light text-dark">Site Settings</h1>
      </div>

      {loading ? (
        <div className="text-muted text-sm">Loading…</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Announcement bar */}
          <div className="bg-white border border-gray-200 p-6">
            <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-3">
              Announcement Bar
            </label>
            <p className="text-xs text-muted mb-3">
              This text appears in the blue bar at the top of every page. Use &nbsp;·&nbsp; to separate items.
            </p>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="input-field w-full"
              placeholder="Free shipping on orders over Rs. 2,000 · Authentic Korean Beauty"
            />
            <div className="mt-4 bg-primary text-white text-center text-xs py-2 tracking-widest uppercase font-medium px-4">
              {announcement || 'Preview will appear here'}
            </div>
          </div>

          {/* Free shipping threshold */}
          <div className="bg-white border border-gray-200 p-6">
            <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-3">
              Free Shipping Threshold (Rs.)
            </label>
            <p className="text-xs text-muted mb-3">
              The minimum order amount to qualify for free shipping. Shown in the Trust Bar on the homepage.
            </p>
            <div className="flex items-center gap-3 max-w-xs">
              <input
                type="number"
                value={freeShipping}
                onChange={(e) => setFreeShipping(e.target.value)}
                className="input-field flex-1"
                placeholder="2000"
                min="0"
              />
              <button
                type="button"
                onClick={() => saveField('free_shipping_amount', freeShipping)}
                className="btn-primary px-4 py-3 text-xs whitespace-nowrap"
              >
                Save
              </button>
            </div>
            <div className="mt-3 text-xs text-muted">
              Preview: <span className="text-body font-medium">On orders over Rs. {Number(freeShipping || 2000).toLocaleString()}</span>
            </div>
          </div>

          {/* Distributors */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-dark">Distributor Information</h2>
              <button
                type="button"
                onClick={() => setDistributors([...distributors, { ...EMPTY_ENTRY }])}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors font-medium"
              >
                <FiPlus size={13} /> Add Distributor
              </button>
            </div>
            <p className="text-xs text-muted mb-4">Official distributor details shown on the Contact Us page.</p>
            {distributors.map((entry, i) => (
              <LocationCard
                key={i}
                entry={entry}
                index={i}
                onChange={(idx, key, val) => updateEntry(distributors, setDistributors, idx, key, val)}
                onDelete={(idx) => deleteEntry(distributors, setDistributors, idx)}
              />
            ))}
          </div>

          {/* Stores */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-dark">Physical Store Information</h2>
              <button
                type="button"
                onClick={() => setStores([...stores, { ...EMPTY_ENTRY }])}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors font-medium"
              >
                <FiPlus size={13} /> Add Store
              </button>
            </div>
            <p className="text-xs text-muted mb-4">Physical shop details shown on the Contact Us page.</p>
            {stores.map((entry, i) => (
              <LocationCard
                key={i}
                entry={entry}
                index={i}
                onChange={(idx, key, val) => updateEntry(stores, setStores, idx, key, val)}
                onDelete={(idx) => deleteEntry(stores, setStores, idx)}
              />
            ))}
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      )}
    </div>
  )
}
