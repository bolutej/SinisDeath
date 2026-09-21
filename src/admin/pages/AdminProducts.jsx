// src/admin/pages/AdminProducts.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import ProductForm from './ProductForm'
import sinisdeath from '../../assets/sinisdeath_logo.svg'

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

  if (loading) return <div>Loading products...</div>

  return (
    <div style={{paddingBottom:'620px', paddingTop: '20px', paddingRight: '80px', paddingLeft: '80px'}}>
      <nav style={{display: 'flex', justifyContent: 'center'}}>
                  <img src={sinisdeath} alt="Logo" style={{ width: '340px', height: 'auto', textAlign: 'center'}}/>
              </nav>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '60px' }}>Products</h2>
        <button
          onClick={() => setEditingProduct({})}
          style={{
            padding: '8px 14px',
            fontSize: 14,
            cursor: 'pointer',
            border: '1px solid #111',
            background: '#2c2c2c',
            color: '#fff',
            borderRadius: 6,
          }}
        >
          + New product
        </button>
      </div>

      {error && (
        <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16 }}>{error}</p>
      )}

      {products.length === 0 ? (
        <p style={{ color: '#666' }}>No products yet. Create your first one.</p>
      ) : (
        <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#888', fontSize: 13 }}>
              <th style={th}>Name</th>
              <th style={th}>Category</th>
              <th style={th}>Price</th>
              <th style={th}>Variants</th>
              <th style={th}>Active</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={td}>{p.name}</td>
                <td style={td}>{p.categories?.name ?? '—'}</td>
                <td style={td}>${Number(p.price).toFixed(2)}</td>
                <td style={td}>{p.product_variants?.length ?? 0}</td>
                <td style={td}>
                  <button
                    onClick={() => toggleActive(p)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: 13,
                      color: p.is_active ? '#2d8a4e' : '#999',
                    }}
                  >
                    {p.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  <button onClick={() => setEditingProduct(p)} style={linkBtn}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    style={{ ...linkBtn, color: '#c0392b' }}
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
  )
}

const th = { padding: '8px 12px', fontWeight: 500 }
const td = { padding: '12px' }
const linkBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  padding: '0 6px',
  color: '#111',
  textDecoration: 'underline',
}