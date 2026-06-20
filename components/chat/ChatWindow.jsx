'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { FiSend, FiImage, FiCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { createAnonClient } from '@/lib/supabase'
import ChatMessage from './ChatMessage'

export default function ChatWindow({ orderId, orderStatus, onStatusChange }) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef(null)
  const fileRef = useRef(null)

  const isStaff =
    session?.user?.role === 'admin' || session?.user?.role === 'employee'

  useEffect(() => {
    if (!orderId) return
    fetchMessages()

    const supabase = createAnonClient()
    const channel = supabase
      .channel('chat:' + orderId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.find((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()

    const orderChannel = supabase
      .channel('order:' + orderId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          onStatusChange?.(payload.new.status, payload.new.payment_status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(orderChannel)
    }
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchMessages() {
    const res = await fetch(`/api/chat/${orderId}`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }

  async function handleSend() {
    if (!text.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, message: text }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setText('')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: base64 }),
        })
        const uploadData = await uploadRes.json()
        if (!uploadData.url) throw new Error('Upload failed')

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            message: '',
            attachment_url: uploadData.url,
          }),
        })
        if (!res.ok) throw new Error('Failed to send image')
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleConfirmPayment() {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', payment_status: 'paid' }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Payment confirmed!')
      onStatusChange?.('confirmed', 'paid')
    } catch {
      toast.error('Failed to confirm payment')
    }
  }

  async function handleCancelOrder() {
    if (!confirm('Cancel this order?')) return
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Order cancelled')
      onStatusChange?.('cancelled', undefined)
    } catch {
      toast.error('Failed to cancel order')
    }
  }

  return (
    <div className="flex flex-col border border-gray-200 bg-white" style={{ height: 'min(520px, 70dvh)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-body">
          Order Chat
        </h3>
        {isStaff && orderStatus !== 'cancelled' && (
          <div className="flex gap-2">
            {orderStatus === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 hover:bg-green-700 transition-colors"
                >
                  <FiCheck size={12} /> Confirm Payment
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 hover:bg-red-700 transition-colors"
                >
                  <FiX size={12} /> Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <p className="text-xs text-muted text-center mt-8">
            {isStaff
              ? 'Send a QR code image to begin the payment process.'
              : 'Thank you for your order. Please wait while our team provides your payment details shortly.'}
          </p>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            currentUserId={session?.user?.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-muted hover:text-primary transition-colors p-1"
          title="Send image"
        >
          <FiImage size={18} />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-transparent border-0 outline-none text-body"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="btn-primary px-4 py-2 flex items-center gap-1 disabled:opacity-50"
        >
          <FiSend size={12} />
        </button>
      </div>
    </div>
  )
}
