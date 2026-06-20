import { createServiceClient } from '@/lib/supabase'
import ProductGrid from '@/components/product/ProductGrid'
import Link from 'next/link'

export default async function FeaturedProducts() {
  let products = []
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8)
    products = data || []
  } catch {
    // Graceful fallback during build without credentials
  }

  if (!products?.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Curated Picks</p>
          <h2 className="font-display text-4xl font-light text-dark">Featured Products</h2>
        </div>
        <Link href="/shop" className="btn-outline text-xs px-5 py-2 hidden sm:inline-block">
          View All
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
