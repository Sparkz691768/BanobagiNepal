import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Customer can only view own orders
    if (session.user.role === 'customer' && data.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const updates = {}

    if (body.status) updates.status = body.status
    if (body.payment_status) updates.payment_status = body.payment_status
    if (body.delivery_fee !== undefined) updates.delivery_fee = body.delivery_fee
    if (body.status === 'out_for_delivery') {
      updates.delivery_assigned_at = new Date().toISOString()
      updates.assigned_to = session.user.id
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    // Post system message to chat on status change
    if (body.status === 'confirmed' || body.status === 'cancelled') {
      const msg =
        body.status === 'confirmed'
          ? 'Payment confirmed! Your order is being prepared.'
          : 'Your order has been cancelled. Please contact us if you have questions.'

      await supabase.from('chats').insert({
        order_id: params.id,
        sender_id: session.user.id,
        sender_role: 'system',
        message: msg,
      })
    }

    // Post system message on delivery fee change
    if (body.delivery_fee !== undefined && body._deliveryFeeMessage) {
      await supabase.from('chats').insert({
        order_id: params.id,
        sender_id: session.user.id,
        sender_role: 'system',
        message: body._deliveryFeeMessage,
      })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
