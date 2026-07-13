import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

const MAX_MAIN_CATEGORIES = 2
const MAX_SUB_CATEGORIES = 2

const ALLOWED_PRODUCT_FIELDS = [
  'name', 'description', 'price', 'original_price', 'stock',
  'category_ids', 'images', 'is_featured', 'is_active', 'slug',
]

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'employee'

    const supabase = createServiceClient()
    let query = supabase.from('products').select('*').eq('id', params.id)

    // Only admins/employees can see inactive products
    if (!isAdmin) query = query.eq('is_active', true)

    const { data, error } = await query.maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const catIds = data.category_ids || []
    let categories = []
    if (catIds.length > 0) {
      const { data: cats } = await supabase.from('categories').select('id, name, slug').in('id', catIds)
      categories = cats || []
    }
    return NextResponse.json({ ...data, categories })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Whitelist allowed fields to prevent mass assignment
    const safeBody = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_PRODUCT_FIELDS.includes(key))
    )

    if (safeBody.category_ids !== undefined) {
      safeBody.category_ids = Array.isArray(safeBody.category_ids)
        ? Array.from(new Set(safeBody.category_ids))
        : []
    }

    const supabase = createServiceClient()
    if (safeBody.category_ids?.length > 0) {
      const { data: selectedCategories, error: categoryError } = await supabase
        .from('categories')
        .select('id, parent_id')
        .in('id', safeBody.category_ids)

      if (categoryError) throw categoryError

      const mainCount = (selectedCategories || []).filter((c) => !c.parent_id).length
      const subCount = (selectedCategories || []).filter((c) => c.parent_id).length
      if (mainCount > MAX_MAIN_CATEGORIES || subCount > MAX_SUB_CATEGORIES) {
        return NextResponse.json(
          { error: `Choose up to ${MAX_MAIN_CATEGORIES} main categories and ${MAX_SUB_CATEGORIES} subcategories` },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(safeBody)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase.from('products').delete().eq('id', params.id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
