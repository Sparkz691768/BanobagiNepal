import Link from 'next/link'

const categories = [
  { name: 'Cleansing', slug: 'cleansing', color: 'from-blue-50 to-blue-100' },
  { name: 'Toner', slug: 'toner', color: 'from-sky-50 to-sky-100' },
  { name: 'Serum', slug: 'serum', color: 'from-indigo-50 to-indigo-100' },
  { name: 'Moisturiser', slug: 'lotion', color: 'from-purple-50 to-purple-100' },
  { name: 'Suncare', slug: 'suncare', color: 'from-yellow-50 to-yellow-100' },
  { name: 'Face Mask', slug: 'mask', color: 'from-pink-50 to-pink-100' },
  { name: 'Gift Sets', slug: 'sets', color: 'from-rose-50 to-rose-100' },
  { name: 'Tools', slug: 'tools', color: 'from-teal-50 to-teal-100' },
]

export default function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Explore</p>
        <h2 className="font-display text-4xl font-light text-dark">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`group relative bg-gradient-to-br ${cat.color} aspect-square flex items-end p-5 overflow-hidden card-shadow`}
          >
            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />
            <span className="relative font-display text-xl font-medium text-dark group-hover:text-primary transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
