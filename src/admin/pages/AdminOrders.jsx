// src/admin/pages/AdminOrders.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import sinisdeath from '../../assets/sinisdeath_logo.svg'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

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

    if (!error) setOrders(data)
    setLoading(false)
  }

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
    setUpdatingId(null)
  }

  if (loading) return <div>Loading orders...</div>

  if (orders.length === 0) {
    return (
      <div style={{ width: '100%', padding: 24, boxSizing: 'border-box',  paddingBottom:'685px', fontSize: '30px',paddingRight: '80px', paddingLeft: '80px' }}>
        <nav style={{display: 'flex', justifyContent: 'center'}}>
                        <img src={sinisdeath} alt="Logo" style={{ width: '340px', height: 'auto', textAlign: 'center'}}/>
                    </nav>
        <h2 style={{fontSize: '60px', paddingTop: '40px'}}>Orders</h2>
        <p style={{textAlign: 'center', paddingTop: '150px'}}>No orders yet.</p>
      </div>
    )
  }

  return (
    <div style={{width: '100%', padding: 24, boxSizing: 'border-box',}}>
      <nav style={{display: 'flex', justifyContent: 'center'}}>
                        <img src={sinisdeath} alt="Logo" style={{ width: '340px', height: 'auto', textAlign: 'center'}}/>
                    </nav>
      <h2 style={{ marginBottom: 24 }}>Orders</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {/* Summary row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                background: '#fafafa',
              }}
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: 0,
                  textAlign: 'left',
                  flex: 1,
                }}
              >
                <strong>{order.guest_name}</strong>
                <span style={{ color: '#666' }}> · {order.guest_email}</span>
                <br />
                <span style={{ fontSize: 12, color: '#888' }}>
                  {new Date(order.created_at).toLocaleDateString()} ·{' '}
                  {order.order_items?.length ?? 0} item
                  {order.order_items?.length === 1 ? '' : 's'}
                </span>
              </button>

              <div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                ₦{Number(order.total_amount).toFixed(2)}
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                disabled={updatingId === order.id}
                style={{
                  padding: '6px 8px',
                  fontSize: 13,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Expanded detail */}
            {expandedId === order.id && (
              <div style={{ padding: '16px', borderTop: '1px solid #e5e5e5' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#666' }}>
                  Items
                </h4>
                <table style={{ width: '100%', fontSize: 13, marginBottom: 20 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#888' }}>
                      <th>Product</th>
                      <th>Variant</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.products?.name ?? '—'}</td>
                        <td>
                          {[item.size, item.color].filter(Boolean).join(' / ') || '—'}
                        </td>
                        <td>{item.quantity}</td>
                        <td>₦{Number(item.price_at_purchase).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {Number(order.discount_amount) > 0 && (
                  <p style={{ fontSize: 13, margin: '0 0 16px', color: '#666' }}>
                    Discount applied: −₦{Number(order.discount_amount).toFixed(2)}
                  </p>
                )}

                <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#666' }}>
                  Shipping to
                </h4>
                <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  {order.shipping_line1}
                  {order.shipping_line2 && <>, {order.shipping_line2}</>}
                  <br />
                  {order.shipping_city}
                  {order.shipping_state && `, ${order.shipping_state}`}{' '}
                  {order.shipping_postal_code}
                  <br />
                  {order.shipping_country}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}