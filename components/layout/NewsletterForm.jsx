'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    toast.success('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0 w-full max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 py-3 text-sm text-body bg-white border border-gray-200 focus:outline-none focus:border-primary"
      />
      <button type="submit" className="btn-primary px-5 py-3 whitespace-nowrap">
        Subscribe
      </button>
    </form>
  )
}
