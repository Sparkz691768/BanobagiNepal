'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { FiTrash2 } from 'react-icons/fi'

const EMPTY_SETTINGS = {
  announcement: '',
  free_shipping_amount: '2000',
  distributor_name: '', distributor_contact_person: '', distributor_phone: '',
  distributor_email: '', distributor_address: '', distributor_hours: '',
  store_name: '', store_contact_person: '', store_phone: '', store_email: '',
  store_address: '', store_hours: '',
}

const LOCATION_FIELDS = [
  { key: 'name', label: 'Business / Location Name', placeholder: 'Enter name' },
  { key: 'contact_person', label: 'Contact Person', placeholder: 'Enter contact person' },
  { key: 'phone', label: 'Phone Number', placeholder: '+977 ...', type: 'tel' },
  { key: 'email', label: 'Email Address', placeholder: 'name@example.com', type: 'email' },
  { key: 'address', label: 'Address', placeholder: 'Enter full address', multiline: true },
  { key: 'hours', label: 'Opening / Contact Hours', placeholder: 'Sun–Fri, 10:00 AM–6:00 PM' },
]

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [settings, setSettings] = useState(EMPTY_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { setSettings({ ...EMPTY_SETTINGS, ...d }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleClearSection(prefix) {
    const cleared = { ...settings }
    LOCATION_FIELDS.forEach((field) => {
      cleared[`${prefix}_${field.key}`] = ''
    })
    setSettings(cleared)
    toast.success(`${prefix === 'distributor' ? 'Distributor' : 'Store'} information cleared — click Save to apply`)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
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
    return (
      <div className="p-8 text-center text-muted text-sm">
        Admin access required.
      </div>
    )
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
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              className="input-field w-full"
              placeholder="Free shipping on orders over Rs. 2,000 · Authentic Korean Beauty"
            />
            {/* Live preview */}
            <div className="mt-4 bg-primary text-white text-center text-xs py-2 tracking-widest uppercase font-medium px-4">
              {settings.announcement || 'Preview will appear here'}
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
            <input
              type="number"
              value={settings.free_shipping_amount}
              onChange={(e) => setSettings({ ...settings, free_shipping_amount: e.target.value })}
              className="input-field w-full max-w-xs"
              placeholder="2000"
              min="0"
            />
            <div className="mt-3 text-xs text-muted">
              Preview: <span className="text-body font-medium">On orders over Rs. {Number(settings.free_shipping_amount || 2000).toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { prefix: 'distributor', title: 'Distributor Information', description: 'Official distributor details shown on the Contact Us page.' },
              { prefix: 'store', title: 'Physical Store Information', description: 'Physical shop details shown on the Contact Us page.' },
            ].map(({ prefix, title, description }) => (
              <section key={prefix} className="bg-white border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="text-sm font-semibold text-dark">{title}</h2>
                  <button
                    type="button"
                    onClick={() => handleClearSection(prefix)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
                    title={`Clear all ${title} fields`}
                  >
                    <FiTrash2 size={13} />
                    Delete
                  </button>
                </div>
                <p className="text-xs text-muted mb-5">{description}</p>
                <div className="space-y-4">
                  {LOCATION_FIELDS.map((field) => {
                    const settingKey = `${prefix}_${field.key}`
                    const sharedProps = {
                      value: settings[settingKey],
                      onChange: (e) => setSettings({ ...settings, [settingKey]: e.target.value }),
                      className: 'input-field w-full',
                      placeholder: field.placeholder,
                    }

                    return (
                      <label key={settingKey} className="block">
                        <span className="block text-xs font-medium text-body mb-1.5">{field.label}</span>
                        {field.multiline ? (
                          <textarea {...sharedProps} rows={3} />
                        ) : (
                          <input {...sharedProps} type={field.type || 'text'} />
                        )}
                      </label>
                    )
                  })}
                </div>
              </section>
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
