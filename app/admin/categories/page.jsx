'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { FiPlus, FiTrash2, FiChevronRight, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

function EditableRow({ item, onSave, onDelete, isAdmin, indent = false }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  async function handleSave() {
    if (!name.trim() || name === item.name) { setEditing(false); setName(item.name); return }
    setSaving(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSave(data)
      toast.success('Renamed')
    } catch (err) {
      toast.error(err.message || 'Failed')
      setName(item.name)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setEditing(false); setName(item.name) }
  }

  return (
    <div className={`flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors ${indent ? 'pl-12' : ''}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {indent && <FiChevronRight size={12} className="text-muted flex-shrink-0" />}
        {!indent && <span className="w-1.5 h-5 bg-primary rounded-full flex-shrink-0" />}

        {editing ? (
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-primary px-2 py-1 text-sm text-body focus:outline-none min-w-0"
            style={{ borderRadius: 0 }}
          />
        ) : (
          <div className="min-w-0">
            <p className={`text-sm ${indent ? 'text-body' : 'font-semibold text-dark'} truncate`}>{item.name}</p>
            <p className="text-[11px] text-muted">{item.slug}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <span className="hidden sm:block text-xs text-muted">{formatDate(item.created_at)}</span>
        {isAdmin && (
          <>
            {editing ? (
              <>
                <button type="button" onClick={handleSave} disabled={saving} className="text-primary hover:text-accent transition-colors">
                  <FiCheck size={14} />
                </button>
                <button type="button" onClick={() => { setEditing(false); setName(item.name) }} className="text-muted hover:text-dark transition-colors">
                  <FiX size={14} />
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditing(true)} className="text-muted hover:text-primary transition-colors">
                <FiEdit2 size={13} />
              </button>
            )}
            <button type="button" onClick={() => onDelete(item.id)} className="text-muted hover:text-red-500 transition-colors">
              <FiTrash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

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
  function getSubsFor(parentId) { return subCategories.filter((s) => s.parent_id === parentId) }

  function handleSaved(updated) {
    setCategories((prev) => prev.map((c) => c.id === updated.id ? updated : c))
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
    if (hasSubs) { toast.error('Delete subcategories first'); return }
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
            No categories yet.
          </div>
        )}

        {mainCategories.map((cat) => {
          const subs = getSubsFor(cat.id)
          return (
            <div key={cat.id} className="bg-white border border-gray-200">
              <EditableRow item={cat} onSave={handleSaved} onDelete={handleDelete} isAdmin={isAdmin} />
              {subs.length > 0 && (
                <div className="divide-y divide-gray-50 border-t border-gray-100">
                  {subs.map((sub) => (
                    <EditableRow key={sub.id} item={sub} onSave={handleSaved} onDelete={handleDelete} isAdmin={isAdmin} indent />
                  ))}
                </div>
              )}
              {subs.length === 0 && (
                <div className="px-12 py-2 text-xs text-muted italic border-t border-gray-50">
                  No subcategories — select &quot;{cat.name}&quot; above to add one.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
