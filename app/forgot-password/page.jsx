'use client'

import { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FiMail, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { toast.error('Enter your email address'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSent(true)
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-[96px] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-dark items-center justify-center p-16">
        <div className="text-white max-w-sm">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-4">Account Recovery</p>
          <h2 className="font-display text-5xl font-light leading-tight mb-6">
            Regain Access to Your Account
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Enter your registered email address and we will send you a secure password reset link, valid for 30 minutes.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {!sent ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-light-fill mb-6">
                  <FiMail size={22} className="text-primary" />
                </div>
                <h1 className="font-display text-3xl font-light text-dark mb-2">Forgot Password</h1>
                <p className="text-sm text-muted">
                  We&apos;ll send a reset link to your inbox. Works for customers, employees, and admins.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoFocus
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <p className="text-center text-sm text-muted">
                  <Link href="/login" className="text-primary hover:underline">
                    â† Back to Sign In
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 mx-auto mb-6">
                <FiCheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="font-display text-3xl font-light text-dark mb-3">Check Your Inbox</h1>
              <p className="text-sm text-muted mb-2 leading-relaxed">
                If an active account exists for <span className="text-body font-medium">{email}</span>, a password reset link has been sent.
              </p>
              <p className="text-xs text-muted mb-8">
                The link expires in 30 minutes. Check your spam folder if you don&apos;t see it.
              </p>
              <Link href="/login" className="btn-primary inline-block px-8 py-3">
                Back to Sign In
              </Link>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => { setSent(false) }}
                  className="text-sm text-muted hover:text-primary"
                >
                  Try a different email
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

