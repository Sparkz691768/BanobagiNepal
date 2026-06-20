import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      items,
      total_amount,
      shipping_name,
      shipping_email,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_notes,
    } = body

    if (!items?.length || !total_amount) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        items,
        total_amount,
        status: 'pending',
        payment_status: 'unpaid',
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_notes,
      })
      .select()
      .single()

    if (error) throw error

    // Insert order items
    if (items?.length) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
      await supabase.from('order_items').insert(orderItems)
    }

    // Auto welcome message from staff
    await supabase.from('chats').insert({
      order_id: order.id,
      sender_id: session.user.id,
      sender_role: 'system',
      message: `Thank you for your order! 🙏 Your order #${order.id.slice(0, 8).toUpperCase()} has been placed successfully. Our team will reach you shortly to confirm your payment and order details.`,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
