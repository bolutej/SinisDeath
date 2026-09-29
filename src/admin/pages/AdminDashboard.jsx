import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import sinisdeath from '../../assets/sinisdeath_logo_dark.svg'
import AdminNavbar from './AdminNavbar'

const STATUS_COLORS = {
  pending: '#D4321F',
  processing: '#E39B0B',
  paid: '#2F6FED',
  shipped: '#2F6FED',
  delivered: '#1E8E5A',
  completed: '#1E8E5A',
  cancelled: '#C4C4C4',
}
const FALLBACK_COLORS = ['#000000', '#555555', '#999999']

const naira = (n, decimals = 0) =>
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
  const hasPending = !loading && stats.pendingOrders > 0
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="ad-root">
      <style>{styles}</style>
      <AdminNavbar /> 

      <main className="ad-wrap">
        <div className="ad-titlerow">
          <h1 className="ad-title">Dashboard</h1>
        </div>

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

        <div className="ad-grid">
          {/* LEFT: status + shortcuts */}
          <div className="ad-left">
            <section>
              <p className="ad-label">Orders by status</p>
              {loading ? (
                <span className="ad-skel" style={{ width: '100%', height: 6 }} />
              ) : stats.totalOrders === 0 ? (
                <p className="ad-empty">No orders yet. They’ll show up here once customers check out.</p>
              ) : (
                <StatusBreakdown counts={stats.statusCounts} total={stats.totalOrders} />
              )}
            </section>

            <section className="ad-manage">
              <p className="ad-label">Manage your store</p>
              <nav aria-label="Admin sections">
                <Item
                  to="/admin/products"
                  icon={<IconBox />}
                  title="Products"
                  text="Add, edit and remove items in your store."
                  meta={loading ? null : `${stats.productCount} ${stats.productCount === 1 ? 'item' : 'items'}`}
                  action="Manage"
                />
                <Item
                  to="/admin/orders"
                  icon={<IconReceipt />}
                  title="Orders"
                  text="Update statuses and follow each order through."
                  meta={loading ? null : `${stats.totalOrders} ${stats.totalOrders === 1 ? 'order' : 'orders'}`}
                  action="View"
                />
                <Item
                  to="/admin/analytics"
                  icon={<IconChart />}
                  title="Analytics"
                  text="See how your store is performing."
                  action="View"
                />
              </nav>
            </section>
          </div>

          {/* RIGHT: summary */}
          <aside className="ad-summary">
            <p className="ad-label ad-summary-label">Store summary</p>

            <SummaryRow label="Products" loading={loading} value={stats.productCount} />
            <SummaryRow label="Total orders" loading={loading} value={stats.totalOrders} />
            <SummaryRow label="Average order" loading={loading} value={naira(averageOrder)} />
            <SummaryRow
              label="Pending orders"
              loading={loading}
              value={stats.pendingOrders}
              alert={hasPending}
            />

            <div className="ad-total">
              <div>
                <span className="ad-total-label">Revenue</span>
                <span className="ad-note">Cancelled orders are not counted</span>
              </div>
              {loading ? (
                <span className="ad-skel" style={{ width: 120, height: 26 }} />
              ) : (
                <span className="ad-total-value">{naira(stats.revenue)}</span>
              )}
            </div>

            <Link to="/admin/orders" className="ad-cta">
              {hasPending ? 'Review pending orders' : 'View orders'}
            </Link>
          </aside>
        </div>
      </main>
    </div>
  )
}

/* ---------- Pieces ---------- */

function SummaryRow({ label, value, loading, alert }) {
  return (
    <div className="ad-row">
      <span>{label}</span>
      {loading ? (
        <span className="ad-skel" style={{ width: 56, height: 14 }} />
      ) : (
        <span className={alert ? 'ad-value is-alert' : 'ad-value'}>{value}</span>
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
            <span className="ad-legend-count">{r.count}</span>
            <span className="ad-legend-pct">{Math.round((r.count / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </>
  )
}

function Item({ to, icon, title, text, meta, action }) {
  return (
    <Link to={to} className="ad-item">
      <span className="ad-thumb">{icon}</span>
      <span className="ad-item-text">
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <span className="ad-item-side">
        {meta && <span className="ad-item-meta">{meta}</span>}
        <span className="ad-item-action">{action}</span>
      </span>
    </Link>
  )
}

/* ---------- Icons (inline, no extra dependency) ---------- */

const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
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

/* ---------- Styles ---------- */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

/* Neutralise global element styles leaking in from index.css / App.css */
:where(.ad-root) :is(header, main, section, aside, nav, h1, h2, p, ul, li, div, span, a, strong, small, button) {
  all: revert;
}

.ad-root {
  --ink: #000;
  --muted: #8a8a8a;
  --line: #e5e5e5;
  --alert: #D4321F;
  --gutter: clamp(20px, 6vw, 93px);
  min-height: 100vh;
  background: #fff;
  color: var(--ink);
  font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 400;
  padding-bottom: 96px;
}
.ad-root *, .ad-root *::before, .ad-root *::after { box-sizing: border-box; }
.ad-root p, .ad-root h1, .ad-root ul { margin: 0; padding: 0; }
.ad-root ul { list-style: none; }

.ad-wrap { max-width: 1440px; margin: 0 auto; padding-left: var(--gutter); padding-right: var(--gutter); }

/* Top bar */
.ad-topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 28px; padding-bottom: 28px; }
.ad-logo { width: 170px; max-width: 55%; height: auto; }
.ad-date { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }

/* Title */
.ad-titlerow { margin: 56px 0 64px; }
.ad-title {
  font-size: 28px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
  line-height: 1.1; color: var(--ink);
}

/* Labels */
.ad-label { font-size: 11px; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); margin-bottom: 22px; }
.ad-note { display: block; font-size: 11px; color: var(--muted); margin-top: 4px; font-weight: 400; }
.ad-empty { color: var(--muted); font-size: 13px; }

/* Layout */
.ad-grid { display: grid; grid-template-columns: minmax(0, 1fr) 416px; gap: clamp(32px, 6vw, 90px); align-items: start; }
.ad-manage { margin-top: 64px; }

/* Status breakdown */
.ad-bar { display: flex; gap: 2px; height: 6px; margin-bottom: 8px; }
.ad-bar span { min-width: 4px; }
.ad-legend li {
  display: grid; grid-template-columns: 10px 1fr auto 48px; align-items: center; gap: 14px;
  padding: 16px 0; border-bottom: 1px solid var(--line); font-size: 13px;
}
.ad-legend i { width: 8px; height: 8px; display: block; }
.ad-legend-name { text-transform: capitalize; letter-spacing: 0.02em; }
.ad-legend-count { font-weight: 500; font-variant-numeric: tabular-nums; }
.ad-legend-pct { color: var(--muted); font-size: 12px; text-align: right; font-variant-numeric: tabular-nums; }

/* Shortcut rows (styled like cart line items) */
.ad-item {
  display: flex; align-items: center; gap: 40px; padding: 28px 0;
  border-bottom: 1px solid var(--line); color: var(--ink); text-decoration: none;
  transition: background 0.15s;
}
.ad-thumb {
  width: 72px; height: 72px; flex: none; display: grid; place-items: center;
  border: 1px solid var(--line); color: var(--ink);
}
.ad-item-text { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0; }
.ad-item-text strong { font-size: 14px; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; }
.ad-item-text small { font-size: 12px; color: var(--muted); }
.ad-item-side { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; flex: none; }
.ad-item-meta { font-size: 13px; font-weight: 500; }
.ad-item-action {
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  text-decoration: underline; text-underline-offset: 3px;
}
.ad-item:hover .ad-item-action { text-decoration-thickness: 2px; }

/* Summary panel (styled like the cart's order summary) */
.ad-summary { width: 100%; }
.ad-summary-label { padding-bottom: 26px; margin-bottom: 0; }
.ad-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 0; border-top: 1px solid var(--line); font-size: 13px;
}
.ad-value { font-variant-numeric: tabular-nums; }
.ad-value.is-alert { color: var(--alert); font-weight: 600; }
.ad-total {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  border-top: 1px solid var(--ink); padding: 26px 0 32px; margin-top: 0;
}
.ad-total-label { font-size: 14px; font-weight: 500; letter-spacing: 0.02em; }
.ad-total-value { font-size: 22px; font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1.2; }

.ad-cta {
  display: flex; align-items: center; justify-content: center; height: 63px;
  background: var(--ink); color: #fff; text-decoration: none;
  font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
  transition: opacity 0.15s;
}
.ad-cta:hover { opacity: 0.85; }

/* Error */
.ad-error {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  border: 1px solid var(--alert); padding: 16px 20px; margin-bottom: 40px; font-size: 13px;
}
.ad-error div { display: flex; flex-direction: column; gap: 2px; }
.ad-error strong { font-weight: 500; }
.ad-error span { color: var(--muted); }
.ad-error button {
  font: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  cursor: pointer; flex: none; background: var(--ink); color: #fff; border: 0; padding: 12px 20px;
}

/* Loading skeleton */
.ad-skel {
  display: block; max-width: 100%;
  background: linear-gradient(90deg, #efefef 25%, #f7f7f7 50%, #efefef 75%);
  background-size: 200% 100%; animation: ad-shimmer 1.4s infinite linear;
}
@keyframes ad-shimmer { to { background-position: -200% 0; } }

/* Keyboard focus */
.ad-item:focus-visible, .ad-cta:focus-visible, .ad-error button:focus-visible {
  outline: 1px solid var(--ink); outline-offset: 4px;
}

@media (max-width: 900px) {
  .ad-grid { grid-template-columns: 1fr; }
  .ad-summary { order: -1; }
  .ad-manage { margin-top: 48px; }
  .ad-titlerow { margin: 32px 0 40px; }
  .ad-title { font-size: 24px; }
  .ad-item { gap: 20px; }
  .ad-thumb { width: 56px; height: 56px; }
  .ad-date { display: none; }
  .ad-error { flex-direction: column; align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .ad-skel { animation: none; }
  .ad-item, .ad-cta { transition: none; }
}
`