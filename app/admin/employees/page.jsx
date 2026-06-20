'use client'

import { useState, useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', email: '', password: '' }

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/employees')
      .then((r) => r.json())
      .then((data) => { setEmployees(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('All fields required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEmployees((e) => [data, ...e])
      setForm(EMPTY_FORM)
      setShowForm(false)
      toast.success('Employee created! ID: ' + data.employee_id)
    } catch (err) {
      toast.error(err.message || 'Failed to create employee')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(emp) {
    try {
      const res = await fetch(`/api/employees/${emp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !emp.is_active }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEmployees((list) => list.map((e) => e.id === emp.id ? data : e))
      toast.success(data.is_active ? 'Employee activated' : 'Employee deactivated')
    } catch (err) {
      toast.error(err.message || 'Failed')
    }
  }

  if (loading) return <div className="p-8 text-muted">Loading...</div>

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Staff</p>
          <h1 className="font-display text-3xl font-light text-dark">Employees</h1>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-xs px-4 py-2">
          <FiPlus size={14} /> Create Employee
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 p-6 mb-8 max-w-lg">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-body mb-4">New Employee</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Full Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Employee name" />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Email</label>
              <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="employee@banobagi.com" />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-widest uppercase text-body mb-1 block">Password</label>
              <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Temporary password" />
            </div>
            <p className="text-xs text-muted">Employee ID will be auto-generated (BNB-EMP-XXXX). Role is set to &quot;employee&quot; automatically.</p>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary text-xs px-5 py-2">
                {saving ? 'Creating...' : 'Create Employee'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-xs px-5 py-2">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Employee ID', 'Name', 'Email', 'Status', 'Created', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold tracking-widest uppercase text-muted px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="text-xs font-mono font-semibold text-primary">{emp.employee_id}</span>
                </td>
                <td className="px-4 py-3 font-medium text-body">{emp.name}</td>
                <td className="px-4 py-3 text-muted text-xs">{emp.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 ${emp.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted text-xs">{formatDate(emp.created_at)}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(emp)}
                    className={`text-xs font-semibold tracking-widest uppercase px-3 py-1 border transition-colors ${
                      emp.is_active
                        ? 'border-red-300 text-red-600 hover:bg-red-50'
                        : 'border-green-300 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {emp.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && <div className="py-12 text-center text-muted text-sm">No employees yet.</div>}
      </div>
    </div>
  )
}
