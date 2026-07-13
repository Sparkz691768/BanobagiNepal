import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { createToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/email'

/**
 * POST /api/auth/forgot-password
 * body: { email }
 *
 * Always returns 200 (prevents email enumeration).
 * Only sends the email if the account exists and is active.
 */
export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: user } = await supabase
      .from('users')
      .select('id, name, is_active')
      .eq('email', email)
      .maybeSingle()

    // Silently succeed even if no account — prevents enumeration
    if (!user || !user.is_active) {
      return NextResponse.json({ success: true })
    }

    const token = await createToken(email, 'password_reset', 30)
    await sendPasswordResetEmail(email, token, user.name)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('forgot-password error:', err)
    return NextResponse.json({ error: 'Unable to send reset email. Please try again.' }, { status: 500 })
  }
}
