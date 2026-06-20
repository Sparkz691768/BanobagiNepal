export const metadata = { title: 'Our Story â€” BanobagiNepal' }

export default function AboutPage() {
  return (
    <div className="pt-[96px]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-4">Who We Are</p>
        <h1 className="font-display text-6xl font-light text-dark mb-10">About BanobagiNepal</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4 text-body leading-relaxed">
            <p>
              BanobagiNepal is Nepal&apos;s premier destination for authentic Korean medical beauty products. We are a team of skincare enthusiasts, beauty professionals, and wellness advocates dedicated to bringing the best of Korea&apos;s dermatological innovation to Nepal.
            </p>
            <p>
              We source directly from Banobagi&apos;s authorised distributors to guarantee 100% authenticity. Every product in our collection has been personally vetted for quality, efficacy, and suitability for South Asian skin types.
            </p>
          </div>
          <div className="space-y-4 text-body leading-relaxed">
            <p>
              Our team understands the unique climate, skin concerns, and beauty culture of Nepal. We bridge the gap between Korean medical science and Nepali beauty needs â€” providing not just products, but education, guidance, and genuine care.
            </p>
            <p>
              From Kathmandu to Pokhara, we deliver joy in a bottle â€” one authentic Korean formula at a time.
            </p>
          </div>
        </div>

        <div className="bg-primary text-white p-10 mb-16">
          <h2 className="font-display text-3xl font-light mb-4">Our Mission</h2>
          <p className="text-white/80 leading-relaxed text-lg">
            To make clinically proven, dermatologist-tested Korean beauty accessible to every person in Nepal â€” with transparency, authenticity, and exceptional service at our core.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: 'Authenticity', body: 'Every product is sourced directly from authorised Korean distributors. Zero compromises on quality.' },
            { title: 'Education', body: 'We empower our customers with the knowledge to make informed skincare choices for their unique needs.' },
            { title: 'Community', body: 'We are building a community of informed beauty enthusiasts across Nepal who believe in science-backed skincare.' },
          ].map((v) => (
            <div key={v.title} className="border-t-2 border-primary pt-4">
              <h3 className="font-display text-xl font-medium text-dark mb-3">{v.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

