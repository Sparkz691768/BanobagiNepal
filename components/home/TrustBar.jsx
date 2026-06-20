import { FiPackage, FiRefreshCw, FiShield, FiAward } from 'react-icons/fi'

const items = [
  { icon: FiPackage, label: 'Free Shipping', sub: 'Orders over Rs. 2,000' },
  { icon: FiRefreshCw, label: 'Easy Returns', sub: '7-day return policy' },
  { icon: FiShield, label: '100% Authentic', sub: 'Direct from Korea' },
  { icon: FiAward, label: 'Dermatologist Tested', sub: 'Clinically approved' },
]

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <item.icon size={28} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-dark">{item.label}</p>
              <p className="text-xs text-muted">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
