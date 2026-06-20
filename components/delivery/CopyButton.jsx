'use client'

import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

export default function CopyButton({ text, label = 'Copy Details' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 border transition-colors ${
        copied
          ? 'border-green-500 text-green-600 bg-green-50'
          : 'border-gray-300 text-body hover:border-primary hover:text-primary'
      }`}
    >
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}
