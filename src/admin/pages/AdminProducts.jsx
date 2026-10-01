// src/admin/pages/AdminProducts.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import ProductForm from './ProductForm'
import AdminNavbar from './AdminNavbar'
import Loading from '../../pages/loadingg2'

const formatPrice = (n) =>
  `₦${Number(n).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null) // null = not editing, {} = new
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        slug,
        is_active,
        stock_quantity,
        created_at,
        categories ( name ),
        product_variants ( id )
      `)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setProducts(data)
    setLoading(false)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      setError(error.message)
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActive = async (product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)

    if (error) {
      setError(error.message)
      return
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      )
    )
  }

  // Show the form instead of the list when creating/editing
  if (editingProduct !== null) {
    return (
      <ProductForm
        product={editingProduct}
        onDone={() => {
          setEditingProduct(null)
          fetchProducts()
        }}
        onCancel={() => setEditingProduct(null)}
      />
    )
  }

  if (loading) return <Loading />

  const activeCount = products.filter((p) => p.is_active).length

  return (
    <>
      <AdminNavbar />

      <div className="ap-root">
        <style>{styles}</style>

        <div className="ap-wrap">
          <div className="ap-titlerow">
            <div>
              <h1 className="ap-title">Products</h1>
              {products.length > 0 && (
                <p className="ap-sub">
                  {products.length} {products.length === 1 ? 'product' : 'products'}, {activeCount} active
                </p>
              )}
            </div>
            <button type="button" className="ap-cta" onClick={() => setEditingProduct({})}>
              New product
            </button>
          </div>

          {error && (
            <div className="ap-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          )}

          {products.length === 0 ? (
            !error && (
              <div className="ap-empty">
                <p>No products yet.</p>
                <button type="button" className="ap-link" onClick={() => setEditingProduct({})}>
                  Create your first product
                </button>
              </div>
            )
          ) : (
            <table className="ap-table" aria-label="Products">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Variants</th>
                  <th>Status</th>
                  <th>
                    <span className="ap-sr">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className={`ap-name ${p.is_active ? '' : 'is-hidden'}`}>{p.name}</td>
                    <td data-label="Category" className="ap-muted">
                      {p.categories?.name ?? '—'}
                    </td>
                    <td data-label="Price" className="ap-price">
                      {formatPrice(p.price)}
                    </td>
                    <td data-label="Variants" className="ap-num">
                      {p.product_variants?.length ?? 0}
                    </td>
                    <td data-label="Status">
                      <button
                        type="button"
                        className="ap-status"
                        onClick={() => toggleActive(p)}
                        title={p.is_active ? 'Click to hide from the store' : 'Click to show in the store'}
                        aria-label={`${p.name} is ${p.is_active ? 'active' : 'hidden'}. Click to ${
                          p.is_active ? 'hide' : 'show'
                        } it.`}
                      >
                        <i className={p.is_active ? 'is-on' : ''} />
                        {p.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="ap-actions">
                      <button
                        type="button"
                        className="ap-link"
                        onClick={() => setEditingProduct(p)}
                        aria-label={`Edit ${p.name}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ap-link is-danger"
                        onClick={() => handleDelete(p.id, p.name)}
                        aria-label={`Delete ${p.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
:where(.ap-root) :is(main, section, div, h1, p, span, strong, i, table, thead, tbody, tr, th, td, button) {
  all: revert;
}

.ap-root {
  --ink: #000;
  --muted: #767676;
  --line: #e5e5e5;
  --alert: #D4321F;
  --ok: #1E8E5A;
  --gutter: clamp(20px, 6vw, 93px);
  min-height: 100vh;
  background: #fff;
  color: var(--ink);
  font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 400;
  padding: 40px 0 96px;
}
.ap-root *, .ap-root *::before, .ap-root *::after { box-sizing: border-box; }
.ap-root p, .ap-root h1 { margin: 0; padding: 0; }

.ap-wrap { max-width: 1440px; margin: 0 auto; padding: 0 var(--gutter); }

/* Title row */
.ap-titlerow {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
  margin-bottom: 56px;
}
.ap-title {
  font-size: 28px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase;
  line-height: 1.1; color: var(--ink);
}
.ap-sub { font-size: 12px; color: var(--muted); margin-top: 12px; }

/* Primary button (same as the checkout button on the cart page) */
.ap-cta {
  height: 48px; padding: 0 32px; flex: none;
  background: var(--ink); color: #fff; border: 0; cursor: pointer;
  font: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
  transition: opacity 0.15s;
}
.ap-cta:hover { opacity: 0.85; }

/* Table */
.ap-table { width: 100%; border-collapse: collapse; }
.ap-table th {
  text-align: left; font-size: 11px; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); padding: 0 16px 16px 0; border-bottom: 1px solid var(--line);
}
.ap-table td {
  padding: 22px 16px 22px 0; border-bottom: 1px solid var(--line);
  vertical-align: middle; font-size: 13px;
}
.ap-table th:last-child, .ap-table td:last-child { padding-right: 0; text-align: right; }
.ap-table th:first-child, .ap-table td:first-child { width: 34%; }

.ap-name { font-size: 14px !important; letter-spacing: 0.12em; text-transform: uppercase; }
.ap-name.is-hidden { color: var(--muted); }
.ap-muted { color: var(--muted); }
.ap-price { font-weight: 500; font-variant-numeric: tabular-nums; }
.ap-num { font-variant-numeric: tabular-nums; }

/* Status toggle */
.ap-status {
  display: inline-flex; align-items: center; gap: 10px;
  background: none; border: 0; padding: 0; cursor: pointer;
  font: inherit; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink);
}
.ap-status i { width: 8px; height: 8px; display: block; background: #C4C4C4; }
.ap-status i.is-on { background: var(--ok); }
.ap-status:hover { text-decoration: underline; text-underline-offset: 3px; }

/* Text actions (same as CONTINUE SHOPPING on the cart page) */
.ap-actions { white-space: nowrap; }
.ap-actions .ap-link + .ap-link { margin-left: 24px; }
.ap-link {
  background: none; border: 0; padding: 0; cursor: pointer;
  font: inherit; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink); text-decoration: underline; text-underline-offset: 3px;
}
.ap-link:hover { text-decoration-thickness: 2px; }
.ap-link.is-danger { color: var(--muted); }
.ap-link.is-danger:hover { color: var(--alert); }

/* Empty state */
.ap-empty {
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
  padding: 48px 0; display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  color: var(--muted);
}

/* Error */
.ap-error {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  border: 1px solid var(--alert); padding: 14px 20px; margin-bottom: 32px; font-size: 13px;
}
.ap-error button {
  font: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  cursor: pointer; flex: none; background: none; color: var(--ink); border: 0;
  text-decoration: underline; text-underline-offset: 3px; padding: 0;
}

/* Visually hidden text for screen readers */
.ap-sr {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}

/* Keyboard focus */
.ap-cta:focus-visible, .ap-link:focus-visible, .ap-status:focus-visible, .ap-error button:focus-visible {
  outline: 1px solid var(--ink); outline-offset: 4px;
}

/* Mobile: each row becomes a stacked block */
@media (max-width: 760px) {
  .ap-root { padding-top: 24px; }
  .ap-titlerow { align-items: flex-start; flex-direction: column; margin-bottom: 36px; gap: 20px; }
  .ap-title { font-size: 24px; }
  .ap-cta { width: 100%; }

  .ap-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .ap-table, .ap-table tbody, .ap-table tr, .ap-table td { display: block; width: 100%; }
  .ap-table tr { padding: 22px 0; border-bottom: 1px solid var(--line); }
  .ap-table td, .ap-table td:last-child, .ap-table td:first-child {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 6px 0; border: 0; text-align: left;
  }
  .ap-table td[data-label]::before {
    content: attr(data-label); font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--muted);
  }
  .ap-name { padding-bottom: 12px !important; }
  .ap-actions { justify-content: flex-start !important; padding-top: 16px !important; }
}

@media (prefers-reduced-motion: reduce) {
  .ap-cta { transition: none; }
}
`

