import Link from 'next/link'
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { FiMail, FiMapPin, FiClock } from 'react-icons/fi'

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

export default function ContactPage() {
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
            <Link
              href="/account/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              View My Orders →
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
