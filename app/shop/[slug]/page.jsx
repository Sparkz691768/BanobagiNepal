import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export async function generateMetadata({ params }) {
  const supabase = createServiceClient()
  const { data } = await supabase.from('products').select('name').eq('slug', params.slug).maybeSingle()
  return { title: data ? `${data.name} — BanobagiNepal` : 'Product' }
}

export default async function ProductDetailPage({ params }) {
  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!product) notFound()

  // attach categories
  const catIds = product.category_ids || []
  if (catIds.length > 0) {
    const { data: cats } = await supabase.from('categories').select('id, name, slug').in('id', catIds)
    product.categories = cats || []
  } else {
    product.categories = []
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, users(name)')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })

  return <ProductDetailClient product={product} initialReviews={reviews || []} />
}
