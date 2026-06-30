import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {/* Banner 1 */}
        <div className="relative bg-dark min-h-[380px] flex flex-col justify-end p-10 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-dark opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMEg2MFY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik02MCAwTDAgNjAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvc3ZnPg==')]" />
          <div className="relative z-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-3">New Arrival</p>
            <h3 className="font-display text-4xl font-light text-white mb-3 leading-tight">Glass Skin<br />Serum</h3>
            <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-xs">Advanced hyaluronic acid formula for luminous, glass-like skin radiance.</p>
            <Link
              href="/shop?category=serum"
              className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-white border-b border-white/30 pb-1 hover:border-white transition-colors group/link"
            >
              Shop Serums
              <FiArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="relative bg-dark min-h-[380px] flex flex-col justify-end p-10 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-dark opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMEg2MFY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDYwTDYwIDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvc3ZnPg==')]" />
          <div className="relative z-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-3">Bestseller</p>
            <h3 className="font-display text-4xl font-light text-white mb-3 leading-tight">Daily Sun<br />Shield</h3>
            <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-xs">SPF 50+ PA++++ medical-grade UV protection for all skin types, year-round.</p>
            <Link
              href="/shop?category=suncare"
              className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-white border-b border-white/30 pb-1 hover:border-white transition-colors group/link"
            >
              Shop Suncare
              <FiArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
