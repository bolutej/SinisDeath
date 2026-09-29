import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import { supabase } from '../supabaseClient'
import { useRegion } from '../context/RegionContext'
import Footer from '../pages/Footer'
import Loading from '../pages/loadingg2'

const CSS = `
.sp-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 36px 90px;
}

.sp-status {
  padding: 80px 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #777;
}

.sp-status.error {
  color: #c0392b;
}

/* PRODUCT GRID */
.sp-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 28px;
  row-gap: 58px;
}

/* PRODUCT CARD */
.sp-card {
  display: block;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

/* IMAGE */
.sp-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.sp-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.45s ease;
}

.sp-card:hover .sp-image-wrap img {
  transform: scale(1.035);
}

/* OUT OF STOCK */
.sp-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: #000;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 7px 9px;
}

/* PRODUCT INFO */
.sp-info {
  text-align: center;
}

.sp-title {
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.13em;
  line-height: 1.35;
  text-transform: uppercase;
  margin: 0 0 7px;
  color: #222;
}

.sp-price {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  margin: 0;
  color: #222;
}

/* COLORS */
.sp-colors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
}

.sp-color-text {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #999;
}

.sp-color-text:not(:last-child)::after {
  content: " / ";
  margin-left: 4px;
}

/* TABLET */
@media (max-width: 1000px) {
  .sp-page {
    padding: 26px 24px 70px;
  }

  .sp-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 22px;
    row-gap: 48px;
  }
}

/* MOBILE */
@media (max-width: 700px) {
  .sp-page {
    padding: 20px 14px 60px;
  }

  .sp-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 14px;
    row-gap: 38px;
  }

  .sp-image-wrap {
    margin-bottom: 16px;
  }

  .sp-title {
    font-size: 11px;
    letter-spacing: 0.1em;
  }

  .sp-price {
    font-size: 10px;
  }

  .sp-color-text {
    font-size: 8px;
  }
}
`

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { formatPrice } = useRegion()

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
      <style>{CSS}</style>

      <div className="sp-page">

        {loading && (
          <Loading />
        )}

        {error && (
          <p className="sp-status error">
            Couldn't load products: {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="sp-status">
            No products yet — check back soon.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="sp-grid">

            {products.map((product) => {
              const colors = [
                ...new Set(
                  (product.product_variants ?? [])
                    .map((v) => v.color)
                    .filter(Boolean)
                )
              ]

              const outOfStock = product.stock_quantity === 0

              return (
                <Link
                  to={`/product/${product.slug}`}
                  key={product.id}
                  className="sp-card"
                >
                  <div className="sp-image-wrap">

                    {outOfStock && (
                      <span className="sp-badge">
                        Out of stock
                      </span>
                    )}

                    <img
                      src={product.image_url || '/placeholder.png'}
                      alt={product.name}
                      loading="lazy"
                    />

                  </div>

                  <div className="sp-info">

                    <h3 className="sp-title">
                      {product.name}
                    </h3>

                    <p className="sp-price">
                      {formatPrice(product.price)}
                    </p>

                    {colors.length > 0 && (
                      <div className="sp-colors">
                        {colors.map((color) => (
                          <span
                            key={color}
                            className="sp-color-text"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </Link>
              )
            })}

          </div>
        )}

      </div>

      <Footer />
    </>
  )
}