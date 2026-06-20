'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ShippingForm from '@/components/checkout/ShippingForm'
import { formatPrice } from '@/lib/utils'
import useCart from '@/hooks/useCart'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const items = useCart((s) => s.items)
  const clearCart = useCart((s) => s.clearCart)
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const [form, setForm] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_notes: '',
  })

  // Pre-fill once session resolves (session is null on first render)
  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        shipping_name: f.shipping_name || session.user.name || '',
        shipping_email: f.shipping_email || session.user.email || '',
      }))
    }
  }, [session])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.shipping_name) e.shipping_name = 'Name is required'
    if (!form.shipping_email) e.shipping_email = 'Email is required'
    if (!form.shipping_phone) e.shipping_phone = 'Phone is required'
    if (!form.shipping_address) e.shipping_address = 'Address is required'
    if (!form.shipping_city) e.shipping_city = 'City is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!items.length) { toast.error('Your cart is empty'); return }
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total_amount: total,
          ...form,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      clearCart()
      toast.success('Order placed! Chat with us for payment details.')
      router.push(`/account/orders/${data.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <div className="pt-[96px] max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted mb-4">Your cart is empty.</p>
        <a href="/shop" className="btn-primary inline-block px-8 py-3">Shop Now</a>
      </div>
    )
  }

  return (
    <div className="pt-[96px] max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Almost there</p>
        <h1 className="font-display text-4xl font-light text-dark">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-6">
              Shipping Details
            </h2>
            <ShippingForm
              values={form}
              onChange={(field, val) => setForm({ ...form, [field]: val })}
              errors={errors}
            />
          </div>

          {/* Order Summary */}
          <div>
            <div className="border border-gray-200 p-6 bg-white">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-16 bg-gray-50 flex-shrink-0">
                      {item.images?.[0] && (
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-body truncate">{item.name}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-body whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                <span className="font-semibold text-body">Total</span>
                <span className="font-display text-xl font-medium text-dark">{formatPrice(total)}</span>
              </div>
              <div className="bg-light-fill border border-blue-100 px-4 py-3 mb-4">
                <p className="text-xs text-primary font-medium leading-relaxed">
                  Payment via QR code â€” Our team will send you payment details in the chat after placing your order.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                {loading ? 'Placing Order...' : 'Place Order & Chat with Us'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

