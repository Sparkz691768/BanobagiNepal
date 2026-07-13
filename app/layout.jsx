import './globals.css'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Providers from './providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: 'BanobagiNepal — Korean Beauty',
  description: 'Authentic Korean medical-grade beauty products, carefully curated for the Nepali market.',
  other: { 'format-detection': 'telephone=no' },
  openGraph: {
    title: 'BanobagiNepal — Korean Beauty',
    description: 'Authentic Korean medical-grade beauty products for Nepal.',
    url: 'https://banobaginepal.com',
    siteName: 'BanobagiNepal',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BanobagiNepal — Korean Beauty',
    description: 'Authentic Korean medical-grade beauty products for Nepal.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A5C8A',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-background text-body font-sans">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
