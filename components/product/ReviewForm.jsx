'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import StarRating from './StarRating'
import Button from '@/components/ui/Button'

export default function ReviewForm({ productId, onReviewAdded }) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  if (!session) {
    return (
      <p className="text-sm text-muted">
        Please{' '}
        <a href="/login" className="text-primary underline">
          sign in
        </a>{' '}
        to leave a review.
      </p>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating < 1) return toast.error('Please select a rating')
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, rating, comment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Review submitted!')
      setRating(0)
      setComment('')
      onReviewAdded?.()
    } catch (err) {
      toast.error(err.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-body mb-2 block">
          Your Rating
        </label>
        <StarRating rating={rating} onRate={setRating} size={24} />
      </div>
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-body mb-2 block">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="input-field resize-none"
          placeholder="Share your experience..."
        />
      </div>
      <Button type="submit" disabled={loading} className="self-start">
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
