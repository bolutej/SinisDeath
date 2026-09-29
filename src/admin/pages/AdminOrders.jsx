// src/admin/pages/AdminOrders.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import AdminNavbar from './AdminNavbar'
import Loading from '../../pages/loadingg2'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: '#D4321F',
  paid: '#2F6FED',
  shipped: '#2F6FED',
  delivered: '#1E8E5A',
  cancelled: '#C4C4C4',
}

const formatPrice = (n) =>
  `₦${Number(n).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        discount_amount,
        guest_name,
        guest_email,
        shipping_line1,
        shipping_line2,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        created_at,
        order_items (
          id,
          quantity,
          price_at_purchase,
          size,
          color,
          products ( name )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setOrders(data)
    setLoading(false)
  }

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      setError(error.message)
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
    setUpdatingId(null)
  }

  if (loading) return <div><Loading /></div>

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  return (
    <>
      <AdminNavbar />

      <div className="ao-root">
        <style>{styles}</style>

        <div className="ao-wrap">
          <div className="ao-titlerow">
            <h1 className="ao-title">Orders</h1>
            {orders.length > 0 && (
              <p className="ao-sub">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}, {pendingCount} pending
              </p>
            )}
          </div>

          {error && (
            <div className="ao-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          )}

          {orders.length === 0 ? (
            !error && (
              <div className="ao-empty">
                <p>No orders yet. They’ll show up here once customers check out.</p>
              </div>
            )
          ) : (
            <div className="ao-list">
              {orders.map((order) => {
                const isOpen = expandedId === order.id
                const itemCount = order.order_items?.length ?? 0

                return (
                  <div key={order.id} className="ao-order">
                    {/* Summary row */}
                    <div className="ao-summary">
                      <button
                        type="button"
                        className="ao-toggle"
                        aria-expanded={isOpen}
                        aria-controls={`order-${order.id}`}
                        onClick={() => setExpandedId(isOpen ? null : order.id)}
                      >
                        <span className="ao-mark" aria-hidden="true">
                          {isOpen ? '−' : '+'}
                        </span>
                        <span className="ao-info">
                          <strong>{order.guest_name}</strong>
                          <small>{order.guest_email}</small>
                          <small>
                            {formatDate(order.created_at)}, {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </small>
                        </span>
                      </button>

                      <span className="ao-total">{formatPrice(order.total_amount)}</span>

                      <span className="ao-statuswrap">
                        <i style={{ background: STATUS_COLORS[order.status] ?? '#999' }} />
                        <select
                          className="ao-select"
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          aria-label={`Status for the order from ${order.guest_name}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div id={`order-${order.id}`} className="ao-detail">
                        <div>
                          <p className="ao-label">Items</p>
                          <div className="ao-scroll">
                            <table className="ao-table">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Variant</th>
                                  <th>Qty</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.order_items?.map((item) => (
                                  <tr key={item.id}>
                                    <td className="ao-product">{item.products?.name ?? '—'}</td>
                                    <td className="ao-muted">
                                      {[item.size, item.color].filter(Boolean).join(' / ') || '—'}
                                    </td>
                                    <td className="ao-num">{item.quantity}</td>
                                    <td className="ao-num">{formatPrice(item.price_at_purchase)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <p className="ao-label">Shipping to</p>
                          <p className="ao-address">
                            {order.shipping_line1}
                            {order.shipping_line2 && <>, {order.shipping_line2}</>}
                            <br />
                            {order.shipping_city}
                            {order.shipping_state && `, ${order.shipping_state}`}{' '}
                            {order.shipping_postal_code}
                            <br />
                            {order.shipping_country}
                          </p>

                          {Number(order.discount_amount) > 0 && (
                            <div className="ao-discount">
                              <span>Discount applied</span>
                              <span className="ao-num">−{formatPrice(order.discount_amount)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ---------- Styles ---------- */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

/* Neutralise global element styles leaking in from index.css / App.css */
:where(.ao-root) :is(div, h1, p, span, strong, small, i, button, select, table, thead, tbody, tr, th, td) {
  all: revert;
}

.ao-root {
  --ink: #000;
  --muted: #767676;
  --line: #e5e5e5;
  --alert: #D4321F;
  --gutter: clamp(20px, 6vw, 93px);
  min-height: 100vh;
  background: #fff;
  color: var(--ink);
  font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 400;
  padding: 40px 0 96px;
}
.ao-root *, .ao-root *::before, .ao-root *::after { box-sizing: border-box; }
.ao-root p, .ao-root h1 { margin: 0; padding: 0; }

.ao-wrap { max-width: 1440px; margin: 0 auto; padding: 0 var(--gutter); }

/* Title */
.ao-titlerow { margin-bottom: 56px; }
.ao-title {
  font-size: 28px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
  line-height: 1.1; color: var(--ink);
}
.ao-sub { font-size: 12px; color: var(--muted); margin-top: 12px; }

.ao-label {
  font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink); margin-bottom: 18px;
}

/* Order rows (styled like cart line items) */
.ao-list { border-top: 1px solid var(--line); }
.ao-order { border-bottom: 1px solid var(--line); }

.ao-summary {
  display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center;
  gap: 40px; padding: 24px 0;
}

.ao-toggle {
  display: flex; align-items: center; gap: 24px; min-width: 0;
  background: none; border: 0; padding: 0; cursor: pointer; text-align: left;
  font: inherit; color: var(--ink);
}
.ao-mark {
  width: 32px; height: 32px; flex: none; display: grid; place-items: center;
  border: 1px solid var(--line); font-size: 16px; line-height: 1; font-weight: 300;
}
.ao-toggle:hover .ao-mark { border-color: var(--ink); }
.ao-info { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ao-info strong {
  font-size: 14px; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ao-info small { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ao-total { font-size: 14px; font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }

/* Status select */
.ao-statuswrap { position: relative; display: inline-flex; align-items: center; }
.ao-statuswrap i { position: absolute; left: 14px; width: 8px; height: 8px; display: block; pointer-events: none; }
.ao-select {
  appearance: none; -webkit-appearance: none;
  height: 42px; min-width: 150px; padding: 0 36px 0 32px;
  border: 1px solid var(--line); border-radius: 0; background-color: #fff; color: var(--ink);
  font: inherit; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
}
.ao-select:hover:not(:disabled) { border-color: var(--ink); }
.ao-select:disabled { opacity: 0.5; cursor: progress; }

/* Expanded detail */
.ao-detail {
  display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 48px;
  padding: 8px 0 40px 56px;
}
.ao-scroll { overflow-x: auto; }
.ao-table { width: 100%; border-collapse: collapse; }
.ao-table th {
  text-align: left; font-size: 11px; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); padding: 0 16px 12px 0; border-bottom: 1px solid var(--line);
}
.ao-table td { padding: 16px 16px 16px 0; border-bottom: 1px solid var(--line); font-size: 13px; vertical-align: middle; }
.ao-table th:last-child, .ao-table td:last-child { padding-right: 0; text-align: right; }
.ao-product { letter-spacing: 0.1em; text-transform: uppercase; }
.ao-muted { color: var(--muted); }
.ao-num { font-variant-numeric: tabular-nums; }

.ao-address { font-size: 13px; line-height: 1.8; }
.ao-discount {
  display: flex; justify-content: space-between; gap: 16px;
  margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 13px;
}

/* Empty state */
.ao-empty { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 48px 0; color: var(--muted); }

/* Error */
.ao-error {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  border: 1px solid var(--alert); padding: 14px 20px; margin-bottom: 32px; font-size: 13px;
}
.ao-error button {
  font: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  cursor: pointer; flex: none; background: none; color: var(--ink); border: 0;
  text-decoration: underline; text-underline-offset: 3px; padding: 0;
}

/* Keyboard focus */
.ao-toggle:focus-visible, .ao-select:focus-visible, .ao-error button:focus-visible {
  outline: 1px solid var(--ink); outline-offset: 4px;
}

@media (max-width: 900px) {
  .ao-detail { grid-template-columns: 1fr; gap: 32px; padding-left: 0; }
}

@media (max-width: 760px) {
  .ao-root { padding-top: 24px; }
  .ao-titlerow { margin-bottom: 36px; }
  .ao-title { font-size: 24px; }
  .ao-summary { grid-template-columns: 1fr auto; gap: 16px 20px; padding: 20px 0; }
  .ao-toggle { grid-column: 1 / -1; gap: 16px; }
  .ao-select { min-width: 140px; }
}
`