require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const categories = [
  { name: 'Cleansing', slug: 'cleansing' },
  { name: 'Toner', slug: 'toner' },
  { name: 'Serum', slug: 'serum' },
  { name: 'Moisturiser', slug: 'lotion' },
  { name: 'Suncare', slug: 'suncare' },
  { name: 'Face Mask', slug: 'mask' },
  { name: 'Gift Sets', slug: 'sets' },
  { name: 'Tools', slug: 'tools' },
  { name: 'Eye Care', slug: 'eye-care' },
  { name: 'Lip Care', slug: 'lip-care' },
  { name: 'Body Care', slug: 'body-care' },
  { name: 'Hair Care', slug: 'hair-care' },
]

const products = [
  {
    name: 'Banobagi Vita Genic Jelly Toner',
    slug: 'vita-genic-jelly-toner',
    description: 'A refreshing jelly toner packed with 7 essential vitamins to brighten and hydrate skin. Lightweight formula that absorbs instantly, leaving skin luminous and deeply nourished.',
    price: 2800,
    original_price: 3500,
    category_slug: 'toner',
    stock: 45,
    is_featured: true,
  },
  {
    name: 'Banobagi Stem Cell Intensive Ampoule',
    slug: 'stem-cell-intensive-ampoule',
    description: 'Advanced anti-ageing ampoule with plant stem cells and hyaluronic acid. Clinically proven to reduce fine lines and improve skin elasticity within 4 weeks of use.',
    price: 6500,
    original_price: 8000,
    category_slug: 'serum',
    stock: 22,
    is_featured: true,
  },
  {
    name: 'Banobagi Daily Shield Sun Fluid SPF50+ PA++++',
    slug: 'daily-shield-sun-fluid',
    description: 'Medical-grade broad spectrum sun protection with a weightless fluid texture. Formulated by dermatologists for daily use. Non-greasy, suitable for all skin types including sensitive skin.',
    price: 3200,
    original_price: null,
    category_slug: 'suncare',
    stock: 60,
    is_featured: true,
  },
  {
    name: 'Banobagi Milk Thistle Skin Repair Cream',
    slug: 'milk-thistle-skin-repair-cream',
    description: 'Intensive repair moisturiser with milk thistle extract and ceramides. Restores the skin barrier, soothes redness, and provides 72-hour moisture retention.',
    price: 4200,
    original_price: 5000,
    category_slug: 'lotion',
    stock: 30,
    is_featured: true,
  },
  {
    name: 'Banobagi Collagen Cleansing Foam',
    slug: 'collagen-cleansing-foam',
    description: 'Marine collagen-enriched foam cleanser that removes impurities while maintaining optimal skin moisture balance. Gentle enough for daily use, even on sensitive skin.',
    price: 1800,
    original_price: 2200,
    category_slug: 'cleansing',
    stock: 55,
    is_featured: false,
  },
  {
    name: 'Banobagi Vita Genic Melting Serum',
    slug: 'vita-genic-melting-serum',
    description: 'Concentrated vitamin C brightening serum that visibly reduces dark spots, hyperpigmentation, and dullness. Fast-absorbing formula with triple vitamin complex.',
    price: 5800,
    original_price: 7200,
    category_slug: 'serum',
    stock: 18,
    is_featured: true,
  },
  {
    name: 'Banobagi Water Max Hydrating Sheet Mask',
    slug: 'water-max-hydrating-sheet-mask',
    description: 'Intensive hydration sheet mask with hyaluronic acid, glycerin, and aloe vera. 20-minute treatment delivers 48-hour moisture and an instant glass-skin glow.',
    price: 850,
    original_price: null,
    category_slug: 'mask',
    stock: 100,
    is_featured: false,
  },
  {
    name: 'Banobagi Eye Contour Revitalizer',
    slug: 'eye-contour-revitalizer',
    description: 'Targeted eye cream formulated to reduce dark circles, puffiness and crow\'s feet. Combines peptides, caffeine, and vitamin K for visible results in 2 weeks.',
    price: 4800,
    original_price: 5800,
    category_slug: 'eye-care',
    stock: 25,
    is_featured: true,
  },
  {
    name: 'Banobagi Micro Peel Exfoliating Toner',
    slug: 'micro-peel-exfoliating-toner',
    description: 'Gentle chemical exfoliating toner with AHA/BHA complex. Resurfaces skin texture, unclogs pores, and reveals brighter, smoother skin without irritation.',
    price: 3600,
    original_price: 4500,
    category_slug: 'toner',
    stock: 35,
    is_featured: false,
  },
  {
    name: 'Banobagi Glow Starter Gift Set',
    slug: 'glow-starter-gift-set',
    description: 'The perfect introduction to Banobagi Korean beauty. Includes Vita Genic Toner, Melting Serum, and Daily Shield SPF50+ in a premium gift box. Ideal for gifting or starting your K-beauty journey.',
    price: 9800,
    original_price: 13500,
    category_slug: 'sets',
    stock: 15,
    is_featured: true,
  },
  {
    name: 'Banobagi Lip Plumping Treatment',
    slug: 'lip-plumping-treatment',
    description: 'Nourishing lip treatment with peptides and hyaluronic acid that plumps, hydrates, and smoothes lips. Overnight mask formula restores softness to dry, chapped lips.',
    price: 2200,
    original_price: null,
    category_slug: 'lip-care',
    stock: 40,
    is_featured: false,
  },
  {
    name: 'Banobagi Bio Cell Rebuilding Night Cream',
    slug: 'bio-cell-rebuilding-night-cream',
    description: 'Luxurious overnight repair cream with bio-fermented ingredients and retinol alternative. Works during sleep to rebuild collagen, firm skin, and reverse signs of ageing.',
    price: 7200,
    original_price: 8800,
    category_slug: 'lotion',
    stock: 20,
    is_featured: true,
  },
]

async function seed() {
  console.log('Seeding categories...')
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()

  if (catErr) {
    console.error('Category error:', catErr.message)
    return
  }
  console.log(`✓ ${cats.length} categories seeded`)

  const catMap = {}
  cats.forEach((c) => { catMap[c.slug] = c.id })

  const productData = products.map(({ category_slug, ...p }) => ({
    ...p,
    category_id: catMap[category_slug] || null,
  }))

  console.log('Seeding products...')
  const { data: prods, error: prodErr } = await supabase
    .from('products')
    .upsert(productData, { onConflict: 'slug' })
    .select()

  if (prodErr) {
    console.error('Product error:', prodErr.message)
    return
  }
  console.log(`✓ ${prods.length} products seeded`)
  console.log('\nSeeding complete!')
}

seed().catch(console.error)
