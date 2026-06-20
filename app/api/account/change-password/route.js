import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new passwords are required' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch current hashed password
    const { data: user } = await supabase
      .from('users')
      .select('password, is_active')
      .eq('id', session.user.id)
      .maybeSingle()

    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'Account not found or inactive' }, { status: 403 })
    }

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Prevent setting same password
    const same = await bcrypt.compare(newPassword, user.password)
    if (same) {
      return NextResponse.json({ error: 'New password must be different from your current password' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    const { error } = await supabase
      .from('users')
      .update({ password: hashed })
      .eq('id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to change password' }, { status: 500 })
  }
}
