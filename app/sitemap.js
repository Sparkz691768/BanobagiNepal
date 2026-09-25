import { createServiceClient } from '@/lib/supabase'

const BASE_URL = 'https://banobaginepal.com'

// Regenerate hourly so new products appear without a redeploy
export const revalidate = 3600

export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/shop`, priority: 0.9 },
    { url: `${BASE_URL}/contact`, priority: 0.7 },
    { url: `${BASE_URL}/about`, priority: 0.6 },
    { url: `${BASE_URL}/brand`, priority: 0.6 },
    { url: `${BASE_URL}/terms`, priority: 0.4 },
  ].map((page) => ({ ...page, lastModified: new Date(), changeFrequency: 'weekly' }))

  try {
    const supabase = createServiceClient()
    const { data: products } = await supabase
      .from('products')
      .select('slug, created_at')
      .eq('is_active', true)

    const productPages = (products || []).map((p) => ({
      url: `${BASE_URL}/shop/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch {
    return staticPages
  }
}
