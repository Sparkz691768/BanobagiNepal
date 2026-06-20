'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FiLock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  function validate() {
    const e = {}
    if (!form.password || form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: form.password,
          confirmPassword: form.confirm,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
      toast.success('Password updated!')
    } catch (err) {
      toast.error(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  // Missing token in URL
  if (!token) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center w-14 h-14 bg-red-50 mx-auto mb-5">
          <FiAlertTriangle size={28} className="text-red-500" />
        </div>
        <h1 className="font-display text-3xl font-light text-dark mb-3">Invalid Link</h1>
        <p className="text-sm text-muted mb-6">
          This password reset link is missing required information. Please request a new one.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-block px-8 py-3">
          Request New Link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-green-50 mx-auto mb-6">
          <FiCheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="font-display text-3xl font-light text-dark mb-3">Password Updated!</h1>
        <p className="text-sm text-muted mb-8">
          Your password has been changed successfully. You can now sign in with your new password.
        </p>
        <Link href="/login" className="btn-primary inline-block px-8 py-3">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-light-fill mb-6">
          <FiLock size={22} className="text-primary" />
        </div>
        <h1 className="font-display text-3xl font-light text-dark mb-2">Reset Password</h1>
        <p className="text-sm text-muted">
          Choose a strong new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Input
            label="New Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            placeholder="Min. 6 characters"
            autoFocus
          />
          <PasswordStrength password={form.password} />
        </div>
        <Input
          label="Confirm New Password"
          type="password"
          value={form.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
          placeholder="Repeat new password"
        />
        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Updating...' : 'Set New Password'}
        </Button>
        <p className="text-center text-sm text-muted">
          <Link href="/login" className="text-primary hover:underline">â† Back to Sign In</Link>
        </p>
      </form>
    </>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null

  let strength = 0
  if (password.length >= 6) strength++
  if (password.length >= 10) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-green-600']

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1 flex-1 transition-colors ${i <= strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      {strength > 0 && (
        <p className={`text-xs ${strength <= 2 ? 'text-yellow-600' : 'text-green-600'}`}>
          {levels[strength]}
        </p>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen pt-[96px] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark to-body items-center justify-center p-16">
        <div className="text-white max-w-sm">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-4">Security</p>
          <h2 className="font-display text-5xl font-light leading-tight mb-6">
            Choose a Strong New Password
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Use at least 8 characters with a mix of letters, numbers, and symbols. Never reuse passwords across sites.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Suspense fallback={<p className="text-muted text-sm">Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

