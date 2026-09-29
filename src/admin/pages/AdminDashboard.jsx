// src/admin/pages/AdminDashboard.jsx
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import AdminNavbar from './AdminNavbar'

const STATUS_COLORS = {
  pending: '#D4321F',
  processing: '#E39B0B',
  paid: '#2F6FED',
  shipped: '#2F6FED',
  delivered: '#1E8E5A',
  completed: '#1E8E5A',
  cancelled: '#B4B8BF',
}
const FALLBACK_COLORS = ['#111111', '#5B5F66', '#8C9098']

const naira = (n, decimals = 2) =>
  `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    pendingOrders: 0,
    totalOrders: 0,
    activeOrders: 0,
    revenue: 0,
    statusCounts: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [productsRes, ordersRes] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('status, total_amount'),
    ])

    if (productsRes.error || ordersRes.error) {
      setError(
        (productsRes.error || ordersRes.error).message ||
          'Something went wrong while loading your store data.'
      )
      setLoading(false)
      return
    }

    const orders = ordersRes.data ?? []
    const active = orders.filter((o) => o.status !== 'cancelled')
    const statusCounts = orders.reduce((acc, o) => {
      const key = o.status || 'unknown'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    setStats({
      productCount: productsRes.count ?? 0,
      pendingOrders: statusCounts.pending ?? 0,
      totalOrders: orders.length,
      activeOrders: active.length,
      revenue: active.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
      statusCounts,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const averageOrder = stats.activeOrders ? stats.revenue / stats.activeOrders : 0
  const [revenueWhole, revenueDecimals] = naira(stats.revenue).split('.')
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="ad-root">
      <style>{styles}</style>
        <AdminNavbar />

      <main className="ad-main">
        <h1 className="ad-title">Dashboard</h1>

        {error && (
          <div className="ad-error" role="alert">
            <div>
              <strong>Couldn’t load your store data.</strong>
              <span>{error}</span>
            </div>
            <button type="button" onClick={fetchStats}>
              Try again
            </button>
          </div>
        )}

        {/* Hero row */}
        <section className="ad-hero-row">
          <div className="ad-revenue">
            <p className="ad-revenue-label">Revenue</p>
            {loading ? (
              <span className="ad-skel ad-skel-dark" style={{ width: 280, height: 64 }} />
            ) : (
              <p className="ad-revenue-value">
                {revenueWhole}
                <span>.{revenueDecimals}</span>
              </p>
            )}
            <p className="ad-revenue-note">Cancelled orders are not counted.</p>
          </div>

          <div className={`ad-pending ${!loading && stats.pendingOrders > 0 ? 'has-pending' : ''}`}>
            <p className="ad-pending-label">Pending orders</p>
            {loading ? (
              <span className="ad-skel" style={{ width: 70, height: 56 }} />
            ) : (
              <p className="ad-pending-value">{stats.pendingOrders}</p>
            )}
            <p className="ad-pending-note">
              {loading
                ? ' '
                : stats.pendingOrders > 0
                ? `${stats.pendingOrders === 1 ? 'Order is' : 'Orders are'} waiting to be processed.`
                : 'You’re all caught up.'}
            </p>
            {!loading && stats.pendingOrders > 0 && (
              <Link to="/admin/orders" className="ad-inline-link">
                Review orders
                <IconChevron />
              </Link>
            )}
          </div>
        </section>

        {/* Secondary stats */}
        <section className="ad-stats">
          <Stat label="Products" loading={loading} value={stats.productCount} />
          <Stat label="Total orders" loading={loading} value={stats.totalOrders} />
          <Stat label="Average order" loading={loading} value={naira(averageOrder, 0)} />
        </section>

        {/* Status breakdown */}
        <section className="ad-panel">
          <h2 className="ad-h2">Orders by status</h2>
          {loading ? (
            <span className="ad-skel" style={{ width: '100%', height: 12, marginTop: 8 }} />
          ) : stats.totalOrders === 0 ? (
            <p className="ad-empty">No orders yet. They’ll show up here once customers check out.</p>
          ) : (
            <StatusBreakdown counts={stats.statusCounts} total={stats.totalOrders} />
          )}
        </section>

        {/* Navigation */}
        <nav className="ad-nav" aria-label="Admin sections">
          <NavRow
            to="/admin/products"
            icon={<IconBox />}
            title="Manage products"
            text="Add, edit and remove items in your store."
          />
          <NavRow
            to="/admin/orders"
            icon={<IconReceipt />}
            title="View orders"
            text="Update statuses and follow each order through."
          />
          <NavRow
            to="/admin/analytics"
            icon={<IconChart />}
            title="View analytics"
            text="See how your store is performing."
          />
        </nav>
      </main>
    </div>
  )
}

/* ---------- Pieces ---------- */

function Stat({ label, value, loading }) {
  return (
    <div className="ad-stat">
      <p className="ad-stat-label">{label}</p>
      {loading ? (
        <span className="ad-skel" style={{ width: 90, height: 30 }} />
      ) : (
        <p className="ad-stat-value">{value}</p>
      )}
    </div>
  )
}

function StatusBreakdown({ counts, total }) {
  let fallbackIndex = 0
  const rows = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({
      status,
      count,
      color: STATUS_COLORS[status] ?? FALLBACK_COLORS[fallbackIndex++ % FALLBACK_COLORS.length],
    }))

  return (
    <>
      <div className="ad-bar" role="img" aria-label="Share of orders by status">
        {rows.map((r) => (
          <span
            key={r.status}
            title={`${r.status}: ${r.count}`}
            style={{ flex: r.count, background: r.color }}
          />
        ))}
      </div>
      <ul className="ad-legend">
        {rows.map((r) => (
          <li key={r.status}>
            <i style={{ background: r.color }} />
            <span className="ad-legend-name">{r.status}</span>
            <span className="ad-legend-count">
              {r.count}
              <small>{Math.round((r.count / total) * 100)}%</small>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

function NavRow({ to, icon, title, text }) {
  return (
    <Link to={to} className="ad-navrow">
      <span className="ad-navicon">{icon}</span>
      <span className="ad-navtext">
        <strong>{title}</strong>
        <span>{text}</span>
      </span>
      <IconChevron />
    </Link>
  )
}

/* ---------- Icons (inline, no extra dependency) ---------- */

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const IconBox = () => (
  <svg {...iconProps}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </svg>
)
const IconReceipt = () => (
  <svg {...iconProps}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
)
const IconChart = () => (
  <svg {...iconProps}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)
const IconChevron = () => (
  <svg {...iconProps} width={16} height={16} className="ad-chevron">
    <path d="m9 6 6 6-6 6" />
  </svg>
)

/* ---------- Styles ---------- */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800&display=swap');

/* Neutralise global element styles leaking in from index.css / App.css */
:where(.ad-root) :is(header, main, section, nav, h1, h2, p, ul, li, div, span, a, strong, small, button) {
  all: revert;
}
  
.ad-root {
  --ink: #000;
  --muted: #6A6F78;
  --line: #E3E5E8;
  --paper: #F3F4F6;
  --card: #fff;
  --alert: #D4321F;
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif;
  padding-bottom: 64px;
}
.ad-root *, .ad-root *::before, .ad-root *::after { box-sizing: border-box; }
.ad-root p, .ad-root h1, .ad-root h2, .ad-root ul { margin: 0; padding: 0; }

.ad-main { max-width: 1080px; margin: 0 auto; padding: 40px 32px 0; }
.ad-title { font-size: clamp(36px, 5vw, 52px); font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 28px; }

/* Hero row */
.ad-hero-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px; }

.ad-revenue {
  background: #000; color: #fff; border-radius: 18px; padding: 28px 32px;
  display: flex; flex-direction: column; justify-content: space-between; min-height: 220px;
}
.ad-revenue-label { font-size: 15px; color: #B9BDC4; margin-bottom: 20px; }
.ad-revenue-value {
  font-size: clamp(40px, 7vw, 72px); font-weight: 800; letter-spacing: -0.035em; line-height: 1;
  font-variant-numeric: tabular-nums; word-break: break-word;
}
.ad-revenue-value span { font-size: 0.4em; font-weight: 500; color: #8C9098; letter-spacing: 0; }
.ad-revenue-note { font-size: 13px; color: #8C9098; margin-top: 20px; }

.ad-pending {
  background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 24px;
  display: flex; flex-direction: column; min-height: 220px;
}
.ad-pending.has-pending { border-left: 4px solid var(--alert); }
.ad-pending-label { font-size: 15px; color: var(--muted); margin-bottom: 16px; }
.ad-pending-value { font-size: 64px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.ad-pending.has-pending .ad-pending-value { color: var(--alert); }
.ad-pending-note { font-size: 14px; color: var(--muted); margin-top: 10px; }

.ad-inline-link {
  margin-top: auto; padding-top: 16px; display: inline-flex; align-items: center; gap: 4px;
  color: var(--ink); font-size: 14px; font-weight: 600; text-decoration: none; width: fit-content;
}
.ad-inline-link:hover { text-decoration: underline; text-underline-offset: 3px; }

/* Secondary stats */
.ad-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  background: var(--card); border: 1px solid var(--line); border-radius: 12px;
  margin-bottom: 16px; overflow: hidden;
}
.ad-stat { padding: 20px 24px; }
.ad-stat + .ad-stat { border-left: 1px solid var(--line); }
.ad-stat-label { font-size: 14px; color: var(--muted); margin-bottom: 8px; }
.ad-stat-value { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }

/* Status breakdown */
.ad-panel { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 24px; margin-bottom: 16px; }
.ad-h2 { font-size: 17px; font-weight: 600; margin-bottom: 16px; }
.ad-empty { color: var(--muted); font-size: 14px; }
.ad-bar { display: flex; gap: 3px; height: 12px; }
.ad-bar span { border-radius: 999px; min-width: 6px; }
.ad-legend {
  list-style: none; margin-top: 20px !important;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px 32px;
}
.ad-legend li { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.ad-legend i { width: 10px; height: 10px; border-radius: 50%; flex: none; }
.ad-legend-name { text-transform: capitalize; }
.ad-legend-count { margin-left: auto; font-weight: 600; font-variant-numeric: tabular-nums; }
.ad-legend-count small { color: var(--muted); font-weight: 400; margin-left: 8px; font-size: 13px; }

/* Nav rows */
.ad-nav { background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.ad-navrow {
  display: flex; align-items: center; gap: 16px; padding: 18px 24px;
  color: var(--ink); text-decoration: none; transition: background 0.15s;
}
.ad-navrow + .ad-navrow { border-top: 1px solid var(--line); }
.ad-navrow:hover { background: #F8F9FA; }
.ad-navicon {
  width: 42px; height: 42px; flex: none; display: grid; place-items: center;
  background: #000; color: #fff; border-radius: 8px;
}
.ad-navtext { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.ad-navtext strong { font-size: 16px; font-weight: 600; }
.ad-navtext span { font-size: 14px; color: var(--muted); }
.ad-chevron { flex: none; transition: transform 0.15s; }
.ad-navrow:hover .ad-chevron, .ad-inline-link:hover .ad-chevron { transform: translateX(3px); }

/* Error */
.ad-error {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  background: #FDECEA; border: 1px solid #F3B9B2; border-radius: 10px;
  padding: 14px 18px; margin-bottom: 16px; font-size: 14px;
}
.ad-error div { display: flex; flex-direction: column; gap: 2px; }
.ad-error span { color: #7A2B22; }
.ad-error button {
  font: inherit; font-weight: 600; cursor: pointer; flex: none;
  background: #000; color: #fff; border: 0; border-radius: 6px; padding: 8px 14px;
}

/* Loading skeleton */
.ad-skel {
  display: block; max-width: 100%; border-radius: 6px;
  background: linear-gradient(90deg, #E9EBEE 25%, #F4F5F7 50%, #E9EBEE 75%);
  background-size: 200% 100%; animation: ad-shimmer 1.4s infinite linear;
}
.ad-skel-dark { background: linear-gradient(90deg, #1E1E1E 25%, #2C2C2C 50%, #1E1E1E 75%); background-size: 200% 100%; }
@keyframes ad-shimmer { to { background-position: -200% 0; } }

/* Keyboard focus */
.ad-navrow:focus-visible, .ad-inline-link:focus-visible, .ad-error button:focus-visible {
  outline: 2px solid #000; outline-offset: -2px; border-radius: 6px;
}

@media (max-width: 760px) {
  .ad-topbar { padding: 16px 20px; }
  .ad-main { padding: 28px 20px 0; }
  .ad-hero-row { grid-template-columns: 1fr; }
  .ad-revenue, .ad-pending { min-height: 0; }
  .ad-revenue { padding: 24px; }
  .ad-stats { grid-template-columns: 1fr; }
  .ad-stat + .ad-stat { border-left: 0; border-top: 1px solid var(--line); }
  .ad-date { display: none; }
  .ad-error { flex-direction: column; align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .ad-skel { animation: none; }
  .ad-navrow, .ad-chevron { transition: none; }
}
`