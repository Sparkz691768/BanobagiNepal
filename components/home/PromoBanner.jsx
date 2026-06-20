import Link from 'next/link'

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative bg-gradient-to-br from-primary to-accent min-h-[320px] flex items-end p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dark/20" />
          <div className="relative z-10 text-white">
            <p className="text-xs tracking-[0.3em] uppercase text-white/70 mb-2">New Arrival</p>
            <h3 className="font-display text-3xl font-light mb-4">Glass Skin Serum</h3>
            <p className="text-sm text-white/80 mb-6">Advanced hyaluronic acid formula for luminous, glass-like skin</p>
            <Link href="/shop?category=serum" className="inline-block btn-primary bg-white text-dark hover:bg-light-fill text-xs px-6 py-3">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-slate-700 to-slate-900 min-h-[320px] flex items-end p-8 overflow-hidden">
          <div className="absolute inset-0 bg-dark/20" />
          <div className="relative z-10 text-white">
            <p className="text-xs tracking-[0.3em] uppercase text-white/70 mb-2">Bestseller</p>
            <h3 className="font-display text-3xl font-light mb-4">Daily Sun Shield</h3>
            <p className="text-sm text-white/80 mb-6">SPF 50+ PA++++ medical-grade UV protection for all skin types</p>
            <Link href="/shop?category=suncare" className="inline-block btn-primary bg-white text-dark hover:bg-light-fill text-xs px-6 py-3">
              Explore
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
