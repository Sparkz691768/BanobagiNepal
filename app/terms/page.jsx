import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

export const metadata = {
  title: 'Terms & Conditions — BanobagiNepal',
  description: 'BanobagiNepal terms, conditions, and return and exchange policy.',
}

const eligibleItems = [
  'Unused and unopened products in their original condition',
  'Return requested within 3 days of delivery',
  'Original packaging, invoice, and tags are intact',
  'Damaged, defective, or incorrect products received',
  'Expired products received (past the printed expiry date)',
]

const ineligibleItems = [
  'Opened or used makeup or skincare products',
  'Products without original packaging or with damaged labels',
  'Items purchased on sale or clearance, unless defective',
  'Gift cards, vouchers, and free samples',
  'Products returned more than 3 days after delivery',
]

function PolicyCard({ eligible, title, items }) {
  const Icon = eligible ? FiCheckCircle : FiXCircle
  const color = eligible ? 'text-emerald-600' : 'text-red-500'
  const border = eligible ? 'border-emerald-100' : 'border-red-100'

  return (
    <article className={`rounded-3xl border ${border} bg-white p-6 sm:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.08)]`}>
      <div className={`flex items-start gap-3 ${color} mb-8`}>
        <Icon className="mt-1 shrink-0" size={34} strokeWidth={2.5} />
        <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">{title}</h2>
      </div>

      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-body leading-relaxed">
            <Icon className={`${color} mt-1 shrink-0`} size={19} strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function TermsPage() {
  return (
    <div className="pt-[96px]">
      <section className="bg-light-fill border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-primary mb-4">Customer Care</p>
          <h1 className="font-display text-4xl sm:text-6xl font-light text-dark mb-5">Terms &amp; Conditions</h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted leading-relaxed">
            Please review our return and exchange conditions before submitting a request.
          </p>
        </div>
      </section>

      <section id="returns" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <PolicyCard eligible title="Eligible for Return/Exchange" items={eligibleItems} />
          <PolicyCard title="Not Eligible for Return/Exchange" items={ineligibleItems} />
        </div>

        <div className="mt-12 border-t border-gray-200 pt-10 text-sm text-muted leading-relaxed">
          <h2 className="font-display text-2xl text-dark mb-4">How to request a return</h2>
          <p>
            Contact BanobagiNepal within 3 days of delivery with your order number, reason for the request,
            and clear photos or video of the product and packaging. Approved exchanges and refunds are
            subject to inspection. Delivery charges may be non-refundable unless the item was damaged,
            defective, expired, or incorrectly supplied by us.
          </p>
        </div>
      </section>
    </div>
  )
}
