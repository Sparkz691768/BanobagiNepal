import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { consumeToken } from '@/lib/tokens'
import { isRateLimited, recordAttempt, clearAttempts } from '@/lib/rateLimit'

/**
 * POST /api/auth/verify-email
 * body: { email, otp }
 *
 * Verifies the OTP, retrieves the pending registration data,
 * creates the user account, and marks all tokens as used.
 */
export async function POST(req) {
  try {
    const { email, otp } = await req.json()
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    // Block brute-forcing the 6-digit code: max 5 wrong tries per 15 minutes
    if (await isRateLimited(email, 'otp_verify', 5, 15)) {
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new code.' },
        { status: 429 }
      )
    }

    // Validate OTP (bound to this email)
    const result = await consumeToken(String(otp).trim(), 'email_verification', email)
    if (!result.valid) {
      await recordAttempt(email, 'otp_verify', 15)
      return NextResponse.json({ error: result.reason }, { status: 400 })
    }
    await clearAttempts(email, 'otp_verify')
    if (result.email !== email) {
      return NextResponse.json({ error: 'Code does not match this email' }, { status: 400 })
    }

    // Retrieve pending registration data
    const supabase = createServiceClient()
    const { data: pending } = await supabase
      .from('verification_tokens')
      .select('token')
      .eq('email', email)
      .eq('type', 'pending_registration')
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!pending) {
      return NextResponse.json({ error: 'Registration data expired. Please register again.' }, { status: 400 })
    }

    let regData
    try {
      regData = JSON.parse(pending.token)
    } catch {
      return NextResponse.json({ error: 'Invalid registration data' }, { status: 400 })
    }

    // Mark pending registration as used
    await supabase
      .from('verification_tokens')
      .update({ used: true })
      .eq('email', email)
      .eq('type', 'pending_registration')

    // Check for duplicate (race condition guard)
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Account already exists. Please sign in.' }, { status: 409 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name: regData.name,
        email,
        password: regData.hashedPassword,
        role: 'customer',
        is_active: true,
      })
      .select('id, name, email, role')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, user })
  } catch (err) {
    console.error('verify-email error:', err)
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 })
  }
}
