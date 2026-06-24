import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

const MAX_MAIN_CATEGORIES = 2
const MAX_SUB_CATEGORIES = 2

export async function GET(req, { params }) {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // attach categories
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
    if (body.category_ids !== undefined) {
      const categoryIds = Array.isArray(body.category_ids) ? Array.from(new Set(body.category_ids)) : []
      body.category_ids = categoryIds
    }

    const supabase = createServiceClient()
    if (body.category_ids?.length > 0) {
      const { data: selectedCategories, error: categoryError } = await supabase
        .from('categories')
        .select('id, parent_id')
        .in('id', body.category_ids)

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
      .update(body)
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
