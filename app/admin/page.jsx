'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FiShoppingBag, FiClock, FiDollarSign, FiPackage, FiUser } from 'react-icons/fi'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session !== undefined) fetchData()
  }, [session])

  async function fetchData() {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
      ])
      const orders = ordersRes.ok ? await ordersRes.json() : []
      const products = productsRes.ok ? await productsRes.json() : []

      const myOrders = session?.user?.role === 'employee'
        ? orders.filter((o) => o.assigned_to === session.user.id)
        : []

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        totalRevenue: orders
          .filter((o) => o.payment_status === 'paid')
          .reduce((s, o) => s + Number(o.total_amount), 0),
        totalProducts: products.length,
        myOrders: myOrders.length,
      })
      setRecentOrders(orders.slice(0, 5))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-muted">Loading dashboard...</div>

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Overview</p>
        <h1 className="font-display text-3xl font-light text-dark">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats?.totalOrders} color="text-primary" />
        <StatCard icon={FiClock} label="Pending Orders" value={stats?.pendingOrders} color="text-yellow-600" />
        {isAdmin ? (
          <>
            <StatCard icon={FiDollarSign} label="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} color="text-green-600" />
            <StatCard icon={FiPackage} label="Total Products" value={stats?.totalProducts} color="text-purple-600" />
          </>
        ) : (
          <>
            <StatCard icon={FiUser} label="Assigned to Me" value={stats?.myOrders} color="text-green-600" />
            <StatCard icon={FiPackage} label="Total Products" value={stats?.totalProducts} color="text-purple-600" />
          </>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-body">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-primary hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'City', 'Status', isAdmin ? 'Amount' : null, 'Date'].filter(Boolean).map((h) => (
                  <th key={h} className="text-left text-xs font-semibold tracking-widest uppercase text-muted px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline text-xs">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-body">{order.shipping_name}</td>
                  <td className="px-5 py-3 text-muted">{order.shipping_city}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 capitalize ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  {isAdmin && <td className="px-5 py-3 font-medium text-body">{formatPrice(order.total_amount)}</td>}
                  <td className="px-5 py-3 text-muted text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon className={color} size={20} />
      </div>
      <p className="text-2xl font-semibold text-dark mb-1">{value ?? '—'}</p>
      <p className="text-xs text-muted uppercase tracking-widest">{label}</p>
    </div>
  )
}
