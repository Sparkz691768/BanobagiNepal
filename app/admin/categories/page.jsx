'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FiPlus, FiTrash2, FiChevronRight } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminCategoriesPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [newParentId, setNewParentId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(Array.isArray(d) ? d : []))
  }, [])

  const mainCategories = categories.filter((c) => !c.parent_id)
  const subCategories = categories.filter((c) => c.parent_id)

  function getSubsFor(parentId) {
    return subCategories.filter((s) => s.parent_id === parentId)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, parent_id: newParentId || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCategories((c) => [data, ...c])
      setNewName('')
      setNewParentId('')
      toast.success(`${newParentId ? 'Subcategory' : 'Category'} created!`)
    } catch (err) {
      toast.error(err.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const hasSubs = subCategories.some((s) => s.parent_id === id)
    if (hasSubs) {
      toast.error('Delete subcategories first before deleting this category')
      return
    }
    if (!confirm('Delete this category?')) return
    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setCategories((c) => c.filter((x) => x.id !== id))
      toast.success('Deleted')
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
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-10 max-w-xl">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category / Subcategory name"
            className="input-field flex-1"
          />
          <select
            value={newParentId}
            onChange={(e) => setNewParentId(e.target.value)}
            className="input-field sm:w-52"
          >
            <option value="">Main Category</option>
            {mainCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1 px-5 text-xs whitespace-nowrap">
            <FiPlus size={14} /> Add
          </button>
        </form>
      )}

      <div className="space-y-5">
        {mainCategories.length === 0 && (
          <div className="py-12 text-center text-muted text-sm border border-gray-200 bg-white">
            No categories yet. Add your first category above.
          </div>
        )}

        {mainCategories.map((cat) => {
          const subs = getSubsFor(cat.id)
          return (
            <div key={cat.id} className="bg-white border border-gray-200">
              {/* Main category row */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-5 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-dark text-sm">{cat.name}</p>
                    <p className="text-[11px] text-muted">{cat.slug} · {subs.length} subcategor{subs.length === 1 ? 'y' : 'ies'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:block text-xs text-muted">{formatDate(cat.created_at)}</span>
                  {isAdmin && (
                    <button type="button" onClick={() => handleDelete(cat.id)} className="text-muted hover:text-red-500 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories */}
              {subs.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {subs.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between px-5 py-3 pl-12 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <FiChevronRight size={12} className="text-muted flex-shrink-0" />
                        <div>
                          <p className="text-sm text-body">{sub.name}</p>
                          <p className="text-[11px] text-muted">{sub.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-xs text-muted">{formatDate(sub.created_at)}</span>
                        {isAdmin && (
                          <button type="button" onClick={() => handleDelete(sub.id)} className="text-muted hover:text-red-500 transition-colors">
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-12 py-2.5 text-xs text-muted italic">
                  No subcategories — select &quot;{cat.name}&quot; from the dropdown above to add one.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
