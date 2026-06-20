'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', description: '', price: '', original_price: '',
  category_id: '', stock: '', is_featured: false, is_active: true, images: [],
}

export default function AdminProductsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ]).then(([p, c]) => {
      setProducts(Array.isArray(p) ? p : [])
      setCategories(Array.isArray(c) ? c : [])
      setLoading(false)
    })
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(product) {
    setEditing(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      original_price: product.original_price || '',
      category_id: product.category_id || '',
      stock: product.stock || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
      images: product.images || [],
    })
    setShowForm(true)
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: reader.result }),
        })
        const data = await res.json()
        if (data.url) {
          setForm((f) => ({ ...f, images: [...f.images, data.url] }))
        } else {
          toast.error('Image upload failed')
        }
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Upload failed')
      setUploading(false)
    }
    e.target.value = ''
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('Name and price required'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        stock: Number(form.stock) || 0,
      }
      const url = editing ? `/api/products/${editing}` : '/api/products'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(editing ? 'Product updated!' : 'Product created!')
      setShowForm(false)
      // Refresh
      const r = await fetch('/api/products')
      setProducts(await r.json())
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      setProducts((p) => p.filter((x) => x.id !== id))
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return <div className="p-8 text-muted">Loading...</div>

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Inventory</p>
          <h1 className="font-display text-3xl font-light text-dark">Products</h1>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2 text-xs px-4 py-2">
          <FiPlus size={14} /> Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold tracking-widest uppercase text-muted px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 bg-gray-100">
                    {product.images?.[0] && (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-body max-w-xs truncate">{product.name}</td>
                <td className="px-4 py-3 text-muted text-xs">{product.categories?.name || '—'}</td>
                <td className="px-4 py-3 font-medium text-body">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-muted">{product.stock}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {product.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => openEdit(product)} className="text-muted hover:text-primary">
                      <FiEdit2 size={14} />
                    </button>
                    {isAdmin && (
                      <button type="button" onClick={() => handleDelete(product.id)} className="text-muted hover:text-red-500">
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="py-12 text-center text-muted text-sm">No products yet.</div>}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto py-4 sm:py-8 px-2 sm:px-4">
          <div className="bg-white w-full max-w-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-body">
                {editing ? 'Edit Product' : 'New Product'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted hover:text-dark">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Name *</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Description</label>
                <textarea className="input-field resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Price (Rs.) *</label>
                <input className="input-field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Original Price (Rs.)</label>
                <input className="input-field" type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Category</label>
                <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Stock</label>
                <input className="input-field" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  Active
                </label>
              </div>

              {/* Images */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-body mb-2 block">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 group">
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                        className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100"
                      >×</button>
                    </div>
                  ))}
                  <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-16 h-16 border-2 border-dashed border-gray-300 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    <FiUpload size={16} />
                  </button>
                </div>
                {uploading && <p className="text-xs text-muted">Uploading...</p>}
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-5 py-2 text-xs">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-xs">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
