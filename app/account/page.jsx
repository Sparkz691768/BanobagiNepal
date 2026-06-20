'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FiPackage, FiUser, FiLock, FiCheck } from 'react-icons/fi'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { data: session } = useSession()
  const user = session?.user
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', password: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function validatePw() {
    const e = {}
    if (!pwForm.current) e.current = 'Current password is required'
    if (!pwForm.password || pwForm.password.length < 6) e.password = 'At least 6 characters'
    if (pwForm.password !== pwForm.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    const errs = validatePw()
    if (Object.keys(errs).length) { setPwErrors(errs); return }
    setSaving(true)
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Password changed successfully!')
      setShowPasswordForm(false)
      setPwForm({ current: '', password: '', confirm: '' })
      setPwErrors({})
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-[96px] max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Account</p>
        <h1 className="font-display text-4xl font-light text-dark">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Profile card */}
        <div className="border border-gray-200 p-6 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <FiUser className="text-primary" size={20} />
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body">Profile</h2>
          </div>
          <p className="font-medium text-body mb-1">{user?.name}</p>
          <p className="text-sm text-muted mb-1">{user?.email}</p>
          {user?.role && user.role !== 'customer' && (
            <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-primary text-white px-2 py-1 mt-2">
              {user.role}
              {user.employee_id && ` Â· ${user.employee_id}`}
            </span>
          )}
        </div>

        {/* Orders shortcut */}
        <Link
          href="/account/orders"
          className="border border-gray-200 p-6 bg-white hover:border-primary transition-colors group"
        >
          <div className="flex items-center gap-3 mb-4">
            <FiPackage className="text-primary" size={20} />
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body group-hover:text-primary transition-colors">
              My Orders
            </h2>
          </div>
          <p className="text-sm text-muted">View your order history and track deliveries</p>
        </Link>
      </div>

      {/* Change password section */}
      <div className="border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setShowPasswordForm((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiLock className="text-primary" size={18} />
            <span className="text-xs font-semibold tracking-widest uppercase text-body">Change Password</span>
          </div>
          <span className="text-xs text-muted">{showPasswordForm ? 'âˆ’' : '+'}</span>
        </button>

        {showPasswordForm && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <p className="text-xs text-muted mt-4 mb-4">
              You can also use{' '}
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password
              </Link>{' '}
              if you don&apos;t remember your current password.
            </p>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 max-w-sm">
              <Input
                label="Current Password"
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                error={pwErrors.current}
                placeholder="Your current password"
              />
              <Input
                label="New Password"
                type="password"
                value={pwForm.password}
                onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
                error={pwErrors.password}
                placeholder="Min. 6 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                error={pwErrors.confirm}
                placeholder="Repeat new password"
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  {saving ? 'Saving...' : <><FiCheck size={13} /> Update Password</>}
                </Button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(false); setPwErrors({}) }}
                  className="btn-outline text-xs px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

