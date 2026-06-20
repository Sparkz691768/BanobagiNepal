'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminCategoriesPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(Array.isArray(d) ? d : []))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCategories((c) => [data, ...c])
      setNewName('')
      toast.success('Category created!')
    } catch (err) {
      toast.error(err.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setCategories((c) => c.filter((x) => x.id !== id))
      toast.success('Category deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Manage</p>
        <h1 className="font-display text-3xl font-light text-dark">Categories</h1>
      </div>

      {isAdmin && (
        <form onSubmit={handleCreate} className="flex gap-3 mb-8 max-w-sm">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="input-field flex-1"
          />
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1 px-4 text-xs">
            <FiPlus size={14} /> Add
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name', 'Slug', 'Created', isAdmin ? '' : null].filter(Boolean).map((h) => (
                <th key={h} className="text-left text-xs font-semibold tracking-widest uppercase text-muted px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-body">{cat.name}</td>
                <td className="px-4 py-3 text-muted text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-muted text-xs">{formatDate(cat.created_at)}</td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => handleDelete(cat.id)} className="text-muted hover:text-red-500">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <div className="py-12 text-center text-muted text-sm">No categories yet.</div>}
      </div>
    </div>
  )
}
