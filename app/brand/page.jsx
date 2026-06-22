export const metadata = { title: 'Brand — BanobagiNepal' }

export default function BrandPage() {
  return (
    <div className="pt-[96px]">
      {/* Story */}
      <section id="story" className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-4">Our Origin</p>
        <h1 className="font-display text-5xl font-light text-dark mb-8">Brand Story</h1>
        <div className="prose prose-sm max-w-none text-body leading-relaxed space-y-4">
          <p>
            Banobagi was born in the heart of Seoul&apos;s medical beauty district — a brand forged in the precision of clinical dermatology and the artistry of Korean skin culture. Founded by leading dermatologists and cosmetic scientists, Banobagi has been at the forefront of medical-grade beauty innovation since its inception.
          </p>
          <p>
            BanobagiNepal brings this legacy of scientific excellence to the Nepali market. We believe every person deserves access to the most advanced, clinically proven skincare formulations — products that have been trusted by millions across Korea and Southeast Asia.
          </p>
          <p>
            Our curated collection features the finest from Banobagi&apos;s medical-grade lineup: from targeted serums that penetrate deep into the skin&apos;s layers to barrier-restoring moisturizers and high-protection sunscreens. Each product undergoes rigorous dermatological testing before earning its place in our collection.
          </p>
        </div>
      </section>

      <div className="bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-3 gap-8 text-center">
          {[
            { number: '15+', label: 'Years of Research' },
            { number: '2M+', label: 'Happy Customers' },
            { number: '100%', label: 'Dermatologist Tested' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-light text-primary mb-2">{stat.number}</p>
              <p className="text-xs tracking-widest uppercase text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <section id="philosophy" className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-4">Our Beliefs</p>
        <h2 className="font-display text-5xl font-light text-dark mb-8">Our Philosophy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: 'Science First',
              body: 'Every formula begins in the lab. We invest in rigorous clinical trials and peer-reviewed research to ensure our products deliver measurable, lasting results.'
            },
            {
              title: 'Skin Integrity',
              body: "We believe in enhancing your skin's natural intelligence — not masking it. Our formulations work with your biology, not against it."
            },
            {
              title: 'Accessible Excellence',
              body: 'Medical-grade beauty should not be a luxury. We are committed to making clinically proven Korean skincare accessible to everyone in Nepal.'
            },
          ].map((p) => (
            <div key={p.title} className="border-t-2 border-primary pt-4">
              <h3 className="font-display text-xl font-medium text-dark mb-3">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founders */}
      <section id="founder" className="bg-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-4">A Message</p>
          <h2 className="font-display text-5xl font-light mb-8">Founders&apos; Note</h2>
          <blockquote className="font-display text-2xl font-light italic leading-relaxed text-white/90 mb-8 border-l-2 border-primary pl-6">
            &ldquo;We started BanobagiNepal because we witnessed firsthand the transformative power of Korean medical beauty — not just on skin, but on confidence. Every person deserves to feel at home in their skin.&rdquo;
          </blockquote>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            After years of experiencing Korean skincare personally and seeing its impact on dermatology patients, we decided to build a bridge — bringing the best of Seoul&apos;s medical beauty district directly to Nepal. BanobagiNepal is more than a shop; it is our commitment to your skin&apos;s long-term health.
          </p>
          <p className="text-sm text-white/40 mt-6 tracking-widest uppercase">— Founders, BanobagiNepal</p>
        </div>
      </section>

      {/* Press & Media */}
      <section id="media" className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-4">In The News</p>
        <h2 className="font-display text-5xl font-light text-dark mb-8">Press &amp; Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { outlet: 'Kantipur Daily', title: 'Korean Beauty Comes to Nepal', date: 'March 2026' },
            { outlet: 'Beauty Nepal Magazine', title: 'The Science of K-Beauty Explained', date: 'February 2026' },
            { outlet: 'Health Today Nepal', title: 'Dermatologist-Approved Skincare', date: 'January 2026' },
            { outlet: 'Nepal Business Times', title: 'BanobagiNepal: A New Era in Beauty Retail', date: 'December 2025' },
          ].map((item) => (
            <div key={item.title} className="border border-gray-200 p-6">
              <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-2">{item.outlet}</p>
              <h3 className="font-display text-xl font-medium text-dark mb-2">{item.title}</h3>
              <p className="text-xs text-muted">{item.date}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
