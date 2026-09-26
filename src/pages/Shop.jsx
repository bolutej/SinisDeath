import { useEffect, useState } from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import { supabase } from '../supabaseClient'

export default function Shop() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const{data, error} = await supabase
        .from('products')
        .select(`
            id,
            name,
            price,
            slug,
            stock_quantity,
            image_url,
            categories ( name )    
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false})

        if(error) {
            setError(error.message)
        }else {
            setProducts(data)
        }
        setLoading(false)
    }

    return (
        <>
            <NavBar />
            <main>
                {loading && <p style={{padding: 40}}>Loading Products...</p>}

                {error && (
                    <p style={{padding: 40, color: '#e07a5f'}}>
                        Couldn't load products: {error}
                    </p>
                )}

                {!loading && !error && products.length === 0 && (
                    <p style={{padding: 40}}>No Products yet -- check back soon</p>
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
                <p className="product-price">₦{Number(product.price).toLocaleString()}</p>
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
        </>
    )
}