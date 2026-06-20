import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceClient()

    // Verify access
    const { data: order } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', params.orderId)
      .maybeSingle()

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    if (
      session.user.role === 'customer' &&
      order.user_id !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('chats')
      .select('*, users(name)')
      .eq('order_id', params.orderId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const messages = data.map((m) => ({
      ...m,
      sender_name: m.users?.name,
    }))

    return NextResponse.json(messages)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
