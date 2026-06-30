export default function EditorialStrip() {
  return (
    <section className="bg-dark text-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-white/10">
        {[
          {
            number: '01',
            title: 'Medical-Grade Science',
            body: 'Every formula is developed in collaboration with leading Korean dermatologists and clinical researchers.',
          },
          {
            number: '02',
            title: 'Authentic & Verified',
            body: 'Sourced directly from authorised distributors. Zero grey-market imports — only genuine Banobagi products.',
          },
          {
            number: '03',
            title: 'Made for Nepal',
            body: 'Curated specifically for South Asian skin tones, climate, and beauty needs by skincare professionals.',
          },
        ].map((item) => (
          <div key={item.number} className="md:px-10 flex flex-col gap-4">
            <span className="font-display text-5xl font-light text-white/10">{item.number}</span>
            <h3 className="font-display text-xl font-light text-white">{item.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
