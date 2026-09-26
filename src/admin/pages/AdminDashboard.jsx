// src/admin/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import sinisdeath from '../../assets/sinisdeath_logo.svg'

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
    <div style={{paddingBottom:'200px'}}>
        <nav style={{display: 'flex', justifyContent: 'center'}}>
            <img src={sinisdeath} alt="Logo" style={{ width: '340px', height: 'auto', textAlign: 'center'}}/>
        </nav>
    <div style={{paddingLeft: '50px', paddingRight: '50px', paddingTop: '50px'}}>
        
        
      <h2 style={{ marginBottom: 24, fontSize: 50 }}>Dashboard</h2>

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
          value={loading ? '—' : `₦${stats.revenue.toFixed(2)}`}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/admin/products" style={linkCardStyle}>
          Manage products →
        </Link>
        <Link to="/admin/orders" style={linkCardStyle}>
          View orders →
        </Link>
        <Link to="/admin/analytics" style={linkCardStyle}>
          View Analytics →
        </Link>
      </div>
    </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        // background: '#fafafa',
        border: '1px solid #e5e5e5',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <p style={{ fontSize: 20, color: '#ffff', margin: 0, borderBottom: '1px solid #e5e5e5', paddingBottom: 10 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 500, margin: '4px 0 0', paddingTop: 10  }}>{value}</p>
    </div>
  )
}

const linkCardStyle = {
  flex: 1,
  padding: '14px 16px',
  border: '1px solid #e5e5e5',
  borderRadius: 8,
  textDecoration: 'none',
  color: '#ffff',
  fontSize: 14,
}