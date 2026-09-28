import { useEffect, useState } from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import { supabase } from '../supabaseClient'
import { useRegion } from '../context/RegionContext'
import Footer from '../pages/Footer'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const { formatPrice } = useRegion()

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        slug,
        stock_quantity,
        image_url,
        categories ( name ),
        product_variants ( color )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }

  return (
    <>
      <NavBar />
      <main>
        {loading && <p style={{ padding: 40, textAlign: 'center' }}>Loading products...</p>}

        {error && (
          <p style={{ padding: 40, color: '#e07a5f' }}>
            Couldn't load products: {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p style={{ padding: 40 }}>No products yet — check back soon.</p>
        )}

        {products.map((product) => (
          <Link
            to={`/product/${product.slug}`}
            key={product.id}
            style={{ textDecoration: 'none' }}
          >
            <section className="product-card">
              <div className="product-image-wrap">
                <img
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  loading="lazy"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>

                {(() => {
                  const colors = [...new Set(
                    (product.product_variants ?? [])
                      .map((v) => v.color)
                      .filter(Boolean)
                  )]
                  if (colors.length === 0) return null
                  return (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 6,
                        marginTop: 8,
                      }}
                    >
                      {colors.map((color) => (
                        <span
                          key={color}
                          title={color}
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: color.toLowerCase(),
                            border: '1px solid rgba(255,255,255,0.3)',
                            display: 'inline-block',
                          }}
                        />
                      ))}
                    </div>
                  )
                })()}

                {product.stock_quantity === 0 && (
                  <p style={{ fontSize: 13, color: '#999', margin: '4px 0 0' }}>
                    Out of stock
                  </p>
                )}
              </div>
            </section>
          </Link>
        ))}
      </main>

      <Footer />
    </>
  )
}