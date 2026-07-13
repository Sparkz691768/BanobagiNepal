import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

const MAX_MAIN_CATEGORIES = 2
const MAX_SUB_CATEGORIES = 2

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'created_at'
    const featured = searchParams.get('featured')

    const supabase = createServiceClient()
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id, parent_id')
        .eq('slug', category)
        .maybeSingle()

      if (cat) {
        if (!cat.parent_id) {
          // Main category: include products from it AND all its subcategories
          const { data: subs } = await supabase
            .from('categories')
            .select('id')
            .eq('parent_id', cat.id)
          const ids = [cat.id, ...(subs?.map((s) => s.id) || [])]
          query = query.overlaps('category_ids', ids)
        } else {
          // Subcategory: exact match only
          query = query.overlaps('category_ids', [cat.id])
        }
      }
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (sort === 'rating') query = query.order('rating', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error

    // Attach category objects for each product
    const allCatIds = Array.from(new Set((data || []).flatMap((p) => p.category_ids || [])))
    let cats = []
    if (allCatIds.length > 0) {
      const { data: cdata } = await supabase.from('categories').select('id, name, slug').in('id', allCatIds)
      cats = cdata || []
    }
    const mapped = (data || []).map((p) => ({
      ...p,
      categories: (p.category_ids || []).map((id) => cats.find((c) => c.id === id)).filter(Boolean),
    }))

    return NextResponse.json(mapped)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const categoryIds = Array.isArray(body.category_ids) ? Array.from(new Set(body.category_ids)) : []
    const baseSlug = slugify(body.name)

    const supabase = createServiceClient()

    // Ensure slug is unique
    let slug = baseSlug
    let suffix = 2
    while (true) {
      const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle()
      if (!existing) break
      slug = `${baseSlug}-${suffix++}`
    }
    if (categoryIds.length > 0) {
      const { data: selectedCategories, error: categoryError } = await supabase
        .from('categories')
        .select('id, parent_id')
        .in('id', categoryIds)

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
      .insert({ ...body, category_ids: categoryIds, slug })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
