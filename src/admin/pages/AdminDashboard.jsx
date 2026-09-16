// src/admin/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    pendingOrders: 0,
    totalOrders: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: productCount }, { data: orders }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('status, total_amount'),
      ])

      const pendingOrders = orders?.filter((o) => o.status === 'pending').length ?? 0
      const revenue = orders
        ?.filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0

      setStats({
        productCount: productCount ?? 0,
        pendingOrders,
        totalOrders: orders?.length ?? 0,
        revenue,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <StatCard label="Products" value={loading ? '—' : stats.productCount} />
        <StatCard label="Pending orders" value={loading ? '—' : stats.pendingOrders} />
        <StatCard label="Total orders" value={loading ? '—' : stats.totalOrders} />
        <StatCard
          label="Revenue"
          value={loading ? '—' : `$${stats.revenue.toFixed(2)}`}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/admin/products" style={linkCardStyle}>
          Manage products →
        </Link>
        <Link to="/admin/orders" style={linkCardStyle}>
          View orders →
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: '#fafafa',
        border: '1px solid #e5e5e5',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 500, margin: '4px 0 0' }}>{value}</p>
    </div>
  )
}

const linkCardStyle = {
  flex: 1,
  padding: '14px 16px',
  border: '1px solid #e5e5e5',
  borderRadius: 8,
  textDecoration: 'none',
  color: '#111',
  fontSize: 14,
}