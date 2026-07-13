import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

// Keys readable by anyone (used in Navbar, TrustBar, etc.)
const PUBLIC_KEYS = new Set(['announcement', 'free_shipping_amount'])

const DEFAULTS = {
  distributors: '[]',
  stores: '[]',
  announcement: 'Free shipping on orders over Rs. 2,000  ·  Authentic Korean Beauty',
  free_shipping_amount: '2000',
  distributor_name: '',
  distributor_contact_person: '',
  distributor_phone: '',
  distributor_email: '',
  distributor_address: '',
  distributor_hours: '',
  store_name: '',
  store_contact_person: '',
  store_phone: '',
  store_email: '',
  store_address: '',
  store_hours: '',
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'employee'

    const supabase = createServiceClient()
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error) throw error

    const result = { ...DEFAULTS }
    for (const row of data || []) {
      result[row.key] = row.value
    }

    // Non-admin callers only get public keys
    if (!isAdmin) {
      return NextResponse.json({
        announcement: result.announcement,
        free_shipping_amount: result.free_shipping_amount,
      })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({
      announcement: DEFAULTS.announcement,
      free_shipping_amount: DEFAULTS.free_shipping_amount,
    })
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await req.json()
    const supabase = createServiceClient()

    // Batch all upserts in a single call
    const rows = Object.entries(updates)
      .filter(([key]) => key in DEFAULTS)
      .map(([key, value]) => ({
        key,
        value: String(value || ''),
        updated_at: new Date().toISOString(),
      }))

    if (rows.length === 0) return NextResponse.json({ success: true })

    const { error } = await supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
