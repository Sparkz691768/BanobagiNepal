'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen pt-[96px] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-4">Error</p>
        <h1 className="font-display text-5xl font-light text-dark mb-4">Something Went Wrong</h1>
        <p className="text-muted text-sm leading-relaxed mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary px-8 py-3 text-xs">
            Try Again
          </button>
          <a href="/" className="btn-outline px-8 py-3 text-xs">
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
