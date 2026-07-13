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
      shipping_name,
      shipping_email,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_notes,
    } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Validate prices server-side — never trust client-supplied prices
    const productIds = items.map((i) => i.id)
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, price, stock, is_active')
      .in('id', productIds)

    if (productError) throw productError

    const productMap = Object.fromEntries((products || []).map((p) => [p.id, p]))

    for (const item of items) {
      const product = productMap[item.id]
      if (!product || !product.is_active) {
        return NextResponse.json({ error: `Product not available` }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for one or more items` }, { status: 400 })
      }
    }

    // Compute total server-side
    const total_amount = items.reduce((sum, item) => {
      const product = productMap[item.id]
      return sum + product.price * item.quantity
    }, 0)

    // Build validated items with server-side prices
    const validatedItems = items.map((item) => ({
      ...item,
      price: productMap[item.id].price,
    }))

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        items: validatedItems,
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

    // Insert order items with validated prices
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: productMap[item.id].price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      // Rollback the order if items failed
      await supabase.from('orders').delete().eq('id', order.id)
      throw itemsError
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
