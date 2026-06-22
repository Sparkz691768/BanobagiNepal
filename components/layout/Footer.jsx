import Link from 'next/link'
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import NewsletterForm from './NewsletterForm'

const SOCIAL_LINKS = [
  { icon: FaInstagram, href: 'https://www.instagram.com/banobagiofficialnepal', label: 'Instagram' },
  { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61586055162580', label: 'Facebook' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@banobagiofficialinnepal', label: 'TikTok' },
]

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex flex-col leading-none mb-4">
              <span className="font-display text-2xl font-semibold tracking-wide">
                BanobagiNepal
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-muted font-sans">
                Korean Beauty
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Authentic Korean medical-grade beauty products, carefully curated for the Nepali market.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              {['Cleansing', 'Toners', 'Serums', 'Moisturiser', 'Suncare', 'Face Masks'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/shop?category=${item.toLowerCase()}`}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Brand
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/brand#story" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Brand Story
                </Link>
              </li>
              <li>
                <Link href="/brand#philosophy" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/brand#founder" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Founder&apos;s Note
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest arrivals and exclusive offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} BanobagiNepal. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Authentic Korean Beauty · Nepal
          </p>
        </div>
      </div>
    </footer>
  )
}
