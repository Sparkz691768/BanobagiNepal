import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { consumeToken } from '@/lib/tokens'

/**
 * POST /api/auth/reset-password
 * body: { token, password, confirmPassword }
 */
export async function POST(req) {
  try {
    const { token, password, confirmPassword } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    const result = await consumeToken(token, 'password_reset')
    if (!result.valid) {
      return NextResponse.json({ error: result.reason }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: user } = await supabase
      .from('users')
      .select('id, is_active')
      .eq('email', result.email)
      .maybeSingle()

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    if (!user.is_active) {
      return NextResponse.json({ error: 'This account has been deactivated' }, { status: 403 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const { error } = await supabase
      .from('users')
      .update({ password: hashed })
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('reset-password error:', err)
    return NextResponse.json({ error: err.message || 'Reset failed' }, { status: 500 })
  }
}
