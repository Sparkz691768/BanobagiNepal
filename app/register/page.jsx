'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

// Steps: 'form' â†’ 'otp'
export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  function validateForm() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.password || form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  /* â”€â”€ Step 1: send OTP â”€â”€ */
  async function handleSendOtp(e) {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Verification code sent to ${form.email}`)
      setStep('otp')
    } catch (err) {
      toast.error(err.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  /* â”€â”€ Step 2: verify OTP â†’ create account â”€â”€ */
  async function handleVerifyOtp(e) {
    e.preventDefault()
    if (!otp.trim()) { toast.error('Enter the 6-digit code'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: otp.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Auto sign in
      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (signInResult?.error) throw new Error('Account created but sign-in failed. Please log in manually.')

      toast.success('Account verified! Welcome to BanobagiNepal.')
      router.push('/')
    } catch (err) {
      toast.error(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  /* â”€â”€ Resend OTP â”€â”€ */
  async function handleResend() {
    setResending(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOtp('')
      toast.success('New code sent!')
    } catch (err) {
      toast.error(err.message || 'Failed to resend')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen pt-[96px] flex">
      {/* Left editorial panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark to-body items-center justify-center p-16">
        <div className="text-white max-w-sm">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-4">Join Us</p>
          <h2 className="font-display text-5xl font-light leading-tight mb-6">
            {step === 'otp' ? 'Check Your Email' : 'Discover the Art of Korean Beauty'}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            {step === 'otp'
              ? `We've sent a 6-digit verification code to ${form.email}. Enter it to activate your account.`
              : 'Create your account and access curated Korean medical beauty products, exclusive offers, and a seamless shopping experience.'}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {step === 'form' && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-light text-dark mb-2">Create Account</h1>
                <p className="text-sm text-muted">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
              </div>
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <Input label="Full Name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Your full name" />
                <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="your@email.com" />
                <Input label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder="Min. 6 characters" />
                <Input label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} placeholder="Repeat password" />
                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? 'Sending code...' : 'Continue'}
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-light text-dark mb-2">Verify Your Email</h1>
                <p className="text-sm text-muted">
                  Enter the 6-digit code sent to <span className="text-body font-medium">{form.email}</span>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="000000"
                    autoFocus
                  />
                  <p className="text-xs text-muted mt-1">Code expires in 10 minutes</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-sm text-primary hover:underline disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : "Didn't receive it? Resend code"}
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => { setStep('form'); setOtp('') }}
                    className="text-sm text-muted hover:text-body"
                  >
                    â† Change email or details
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

