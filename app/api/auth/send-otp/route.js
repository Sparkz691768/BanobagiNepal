import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { createToken } from '@/lib/tokens'
import { sendOtpEmail } from '@/lib/email'

/**
 * POST /api/auth/send-otp
 * body: { name, email, password }
 *
 * Validates the registration data, hashes the password, stores a
 * pending_registration row in verification_tokens (the hashed password
 * is embedded in the token payload so we don't create the user yet),
 * and fires the OTP email.
 */
export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    // Pre-hash password so we can store it safely in the token metadata
    const hashed = await bcrypt.hash(password, 12)

    // We store a JSON payload as the "token" row using a separate metadata column.
    // Instead of altering the schema we embed it: generate OTP separately,
    // and store { otp, hashedPwd, name } in a second verification_tokens row typed 'pending_reg'.
    const otp = await createToken(email, 'email_verification', 10)

    // Also store the pending registration data keyed by email so verify-email can retrieve it.
    // We reuse the same table with type='pending_registration' and the hashed password as the token value.
    await supabase
      .from('verification_tokens')
      .update({ used: true })
      .eq('email', email)
      .eq('type', 'pending_registration')
      .eq('used', false)

    await supabase.from('verification_tokens').insert({
      email,
      token: JSON.stringify({ name, hashedPassword: hashed }),
      type: 'pending_registration',
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    })

    await sendOtpEmail(email, otp, name)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-otp error:', err)
    return NextResponse.json({ error: 'Failed to send verification code. Please try again.' }, { status: 500 })
  }
}
