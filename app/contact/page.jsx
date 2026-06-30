import Link from 'next/link'
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { FiClock, FiMail, FiMapPin, FiPhone, FiShoppingBag, FiTruck, FiUser } from 'react-icons/fi'
import { createServiceClient } from '@/lib/supabase'

const SOCIAL_LINKS = [
  {
    icon: FaInstagram,
    label: 'Instagram',
    handle: '@banobagiofficialnepal',
    href: 'https://www.instagram.com/banobagiofficialnepal',
    color: 'hover:text-pink-500',
    description: 'Follow us for skincare tips, new arrivals, and giveaways',
  },
  {
    icon: FaFacebook,
    label: 'Facebook',
    handle: 'BanobagiNepal',
    href: 'https://www.facebook.com/profile.php?id=61586055162580',
    color: 'hover:text-blue-500',
    description: 'Like our page for updates, reviews, and community posts',
  },
  {
    icon: FaTiktok,
    label: 'TikTok',
    handle: '@banobagiofficialinnepal',
    href: 'https://www.tiktok.com/@banobagiofficialinnepal',
    color: 'hover:text-white',
    description: 'Watch product demos, tutorials, and behind-the-scenes content',
  },
]

export const metadata = {
  title: 'Contact Us — BanobagiNepal',
  description: 'Get in touch with BanobagiNepal. Find us on Instagram, Facebook, TikTok, or send us a message.',
}

export const dynamic = 'force-dynamic'

async function getContactSettings() {
  const defaults = {
    distributor_name: '', distributor_contact_person: '', distributor_phone: '',
    distributor_email: '', distributor_address: '', distributor_hours: '',
    store_name: '', store_contact_person: '', store_phone: '', store_email: '',
    store_address: '', store_hours: '',
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error) throw error
    return (data || []).reduce((result, row) => ({ ...result, [row.key]: row.value }), defaults)
  } catch {
    return defaults
  }
}

function LocationCard({ type, settings }) {
  const isDistributor = type === 'distributor'
  const title = isDistributor ? 'Authorized Distributor' : 'Physical Store'
  const Icon = isDistributor ? FiTruck : FiShoppingBag
  const name = settings[`${type}_name`]
  const phone = settings[`${type}_phone`]
  const email = settings[`${type}_email`]
  const details = [
    { key: 'contact', icon: FiUser, value: settings[`${type}_contact_person`] },
    { key: 'address', icon: FiMapPin, value: settings[`${type}_address`] },
    { key: 'phone', icon: FiPhone, value: phone, href: phone ? `tel:${phone.replace(/\s/g, '')}` : '' },
    { key: 'email', icon: FiMail, value: email, href: email ? `mailto:${email}` : '' },
    { key: 'hours', icon: FiClock, value: settings[`${type}_hours`] },
  ].filter((detail) => detail.value)

  return (
    <article className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-light-fill text-primary flex items-center justify-center">
          <Icon size={21} />
        </div>
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted">{title}</p>
          <h3 className="font-display text-2xl text-dark">{name || title}</h3>
        </div>
      </div>

      {details.length ? (
        <div className="space-y-3">
          {details.map(({ key, icon: DetailIcon, value, href }) => (
            <div key={key} className="flex items-start gap-3 text-sm text-muted">
              <DetailIcon className="mt-0.5 text-primary shrink-0" size={17} />
              {href ? <a href={href} className="hover:text-primary transition-colors">{value}</a> : <span>{value}</span>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Details will be updated soon.</p>
      )}
    </article>
  )
}

export default async function ContactPage() {
  const settings = await getContactSettings()

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-14">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Get in Touch</p>
        <h1 className="font-display text-4xl sm:text-5xl font-light text-dark mb-4">Contact Us</h1>
        <p className="text-base text-muted max-w-xl leading-relaxed">
          Have a question about a product, an order, or just want to say hello? Reach us through any of the channels below — we&apos;d love to hear from you.
        </p>
      </div>

      <section className="mb-16">
        <div className="mb-6">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Visit or Connect</p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-dark">Where to Find Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LocationCard type="distributor" settings={settings} />
          <LocationCard type="store" settings={settings} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Social Media */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-muted mb-6">
            Find Us Online
          </h2>
          <div className="space-y-4">
            {SOCIAL_LINKS.map(({ icon: Icon, label, handle, href, color, description }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-4 p-5 border border-gray-200 bg-white group transition-all duration-200 hover:border-gray-400 hover:shadow-sm`}
              >
                <div className={`mt-0.5 text-gray-400 transition-colors duration-200 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{label}</p>
                  <p className="text-xs text-primary mb-1">{handle}</p>
                  <p className="text-xs text-muted leading-relaxed">{description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted mb-6">
              Other Ways to Reach Us
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <FiMail className="mt-0.5 text-primary flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-dark mb-0.5">Email</p>
                  <a
                    href="mailto:asainternational260328@gmail.com"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    asainternational260328@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiMapPin className="mt-0.5 text-primary flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-dark mb-0.5">Location</p>
                  <p className="text-sm text-muted">Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiClock className="mt-0.5 text-primary flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-dark mb-0.5">Response Time</p>
                  <p className="text-sm text-muted">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* PR & Collaboration */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">
              PR &amp; Collaboration
            </p>
            <p className="text-sm text-body leading-relaxed mb-3">
              Interested in collaborating with us? Whether you&apos;re a content creator, influencer, or brand partner — we&apos;d love to connect.
            </p>
            <a
              href="mailto:asainternational260328@gmail.com"
              className="text-sm font-medium text-primary hover:underline"
            >
              asainternational260328@gmail.com →
            </a>
          </div>

          {/* Order support note */}
          <div className="bg-gray-50 border border-gray-100 p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">
              Order Support
            </p>
            <p className="text-sm text-body leading-relaxed mb-3">
              Already placed an order? You can track it and chat directly with our team from your account page.
            </p>
            <Link href="/account/orders" className="text-sm font-medium text-primary hover:underline">
              View My Orders →
            </Link>
          </div>

          {/* Terms & Policy */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">
              Legal &amp; Policies
            </p>
            <p className="text-sm text-body leading-relaxed mb-3">
              Read our terms of service, return policy, and privacy information before placing an order.
            </p>
            <Link href="/terms" className="text-sm font-medium text-primary hover:underline">
              Terms &amp; Conditions →
            </Link>
          </div>

          {/* Follow us CTA */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
              Follow Us
            </p>
            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`text-gray-400 transition-colors duration-200 ${color}`}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
