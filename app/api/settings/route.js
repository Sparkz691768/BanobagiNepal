import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

const DEFAULTS = {
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
  announcement: 'Free shipping on orders over Rs. 2,000  ·  Authentic Korean Beauty',
}

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error) throw error

    const result = { ...DEFAULTS }
    for (const row of data || []) {
      result[row.key] = row.value
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(DEFAULTS)
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

    for (const [key, value] of Object.entries(updates)) {
      if (!(key in DEFAULTS)) continue

      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: String(value || ''), updated_at: new Date().toISOString() }, { onConflict: 'key' })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
