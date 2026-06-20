import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-[96px] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-4">404</p>
        <h1 className="font-display text-5xl font-light text-dark mb-4">Page Not Found</h1>
        <p className="text-muted text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn-primary px-8 py-3 text-xs">
            Go Home
          </Link>
          <Link href="/shop" className="btn-outline px-8 py-3 text-xs">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}
