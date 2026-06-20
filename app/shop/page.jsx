import { Suspense } from 'react'
import ShopContent from './ShopContent'

export const metadata = { title: 'Shop â€” BanobagiNepal' }

export default function ShopPage() {
  return (
    <div className="pt-[96px]">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
        <ShopContent />
      </Suspense>
    </div>
  )
}

