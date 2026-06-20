import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { order_id, message, attachment_url } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    const supabase = createServiceClient()

    // Verify access
    const { data: order } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', order_id)
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
      .insert({
        order_id,
        sender_id: session.user.id,
        sender_role: session.user.role,
        message: message || '',
        attachment_url: attachment_url || null,
      })
      .select()
      .single()

    if (error) throw error

    // Mark other messages as read
    await supabase
      .from('chats')
      .update({ is_read: true })
      .eq('order_id', order_id)
      .neq('sender_id', session.user.id)

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
