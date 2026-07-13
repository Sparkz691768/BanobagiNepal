import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: 'email' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
