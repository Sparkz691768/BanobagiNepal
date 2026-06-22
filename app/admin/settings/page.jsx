'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [announcement, setAnnouncement] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { setAnnouncement(d.announcement || ''); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcement }),
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
    <div className="p-6 sm:p-8 max-w-2xl">
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
            {/* Live preview */}
            <div className="mt-4 bg-primary text-white text-center text-xs py-2 tracking-widest uppercase font-medium px-4">
              {announcement || 'Preview will appear here'}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      )}
    </div>
  )
}
