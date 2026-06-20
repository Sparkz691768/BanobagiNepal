import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { is_active } = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('users')
      .update({ is_active })
      .eq('id', params.id)
      .eq('role', 'employee')
      .select('id, name, email, employee_id, is_active')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
