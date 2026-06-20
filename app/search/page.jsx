import { Suspense } from 'react'
import { redirect } from 'next/navigation'

export default function SearchPage({ searchParams }) {
  const q = searchParams.q
  if (q) redirect(`/shop?search=${encodeURIComponent(q)}`)
  redirect('/shop')
}
