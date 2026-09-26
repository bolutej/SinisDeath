import { useEffect, useState } from 'react'
import sinisdeath from '../assets/sinisdeath_logo.svg'
import mockup from '../assets/mockup.png'
import "../App.css"
import { FaShoppingCart, FaLessThan } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Bolu from "../assets/Boluslogo.png"
import { supabase } from '../supabaseClient'
import { useCart } from '../context/CartContext'

export default function Product() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { addItem } = useCart()

    const [product, setProduct] = useState(null)
    const [variants, setvariants] = useState([])
    const [selectedSize, setSelectedSize] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProduct()
    }, [slug])

    const fetchProduct = async () => {
        setLoading(true)
        const {data, error} = await supabase
            .from('products')
            .select('*, product_variants(*)')
            .eq('slug', slug)
            .eq('is_active', true)
            .single()

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setProduct(data)
        setvariants(data.product_variants ?? [])
          const firstInStock = data.product_variants?.find((v) => v.stock_quantity > 0)
    setSelectedSize(firstInStock?.size ?? data.product_variants?.[0]?.size ?? null)
 
    setLoading(false)
    }

     const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const availableSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  )
  const selectedVariant = variants.find((v) => v.size === selectedSize)
  const isOutOfStock = variants.length > 0
    ? (selectedVariant?.stock_quantity ?? 0) <= 0
    : (product?.stock_quantity ?? 0) <= 0
 
  const handleAddToCart = () => {
    if (!product) return
    if (variants.length > 0 && !selectedVariant) return // size required but not chosen
 
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      price: selectedVariant?.price ?? product.price,
      image: mockup, // swap for the real product image once Storage is set up
      size: selectedVariant?.size ?? null,
      color: selectedVariant?.color ?? null,
      quantity,
    })
 
    navigate('/cart')
  }
 
  if (loading) {
    return (
      <>
        <nav>
          <Link to="/shop" style={{ textDecoration: 'none' }}>
            <div className="back">
              <FaLessThan size={14} color="gray" />
              <p>Back</p>
            </div>
          </Link>
          <a href="/"><img src={sinisdeath} alt="Logo" /></a>
          <FaShoppingCart size={28} />
        </nav>
        <p style={{ padding: 40 }}>Loading...</p>
      </>
    )
  }
 
  if (error || !product) {
    return (
      <>
        <nav>
          <Link to="/shop" style={{ textDecoration: 'none' }}>
            <div className="back">
              <FaLessThan size={14} color="gray" />
              <p>Back</p>
            </div>
          </Link>
          <a href="/"><img src={sinisdeath} alt="Logo" /></a>
          <FaShoppingCart size={28} />
        </nav>
        <p style={{ padding: 40 }}>Product not found.</p>
      </>
    )
  }

    return (
        <>
            <nav>
                <Link to="/shop" style={{ textDecoration: 'none' }}>
                <div className="back">
                <FaLessThan size={14} color="gray"/>
                <p>Back</p>
                </div>
                </Link>
                <a href="/">
                    <img src={sinisdeath} alt="Logo" />
                </a>
                <FaShoppingCart className="text-gray-700 hover:text-blue-600 transition-colors" size={28}/>
            </nav>
            <section>
                <section className="product-each">
                    <div className="">
                    <img src={product.image_url || mockup} alt={product.name} loading="lazy" />
                    </div>
                    <div className="product-section">
                    <h1 className="">{product.name}</h1>
                    <p className="">₦{Number(selectedVariant?.price ?? product.price).toLocaleString()}</p>
                    <div className="product-options">
  <h5>Size</h5>

  <div className="size-options">
    <button>XS</button>
    <button>S</button>
    <button className="active">M</button>
    <button>L</button>
    <button>XL</button>
    <button>XXL</button>
    <button>XXXL</button>
  </div>

  <h5>Quantity (1 in cart)</h5>

  <div className="quantity">
    <button>−</button>
    <span>2</span>
    <button>+</button>
  </div>
</div>
                    <Link to="/cart" style={{ textDecoration: 'none' }}>
                    <button className="add-to-cart">Add to Cart</button>
                    </Link>
                    <div className="dets">
                        <details>
                        <summary>Description</summary>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </details>
                        <details>
                        <summary>Delivery Info</summary>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </details>
                        <details>
                        <summary>Size Guide</summary>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </details>
                    </div>
                    </div>
                </section>
            </section>
            <footer className="footer">
                <div className="footer-content">
                    <p className="footer-title">Built by</p>
            
                    <a
                        href="https://x.com/BoluTejumol"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-logo"
                    >
                        <img src={Bolu} alt="Bolu" />
                    </a>
                    <div className="footer-line"></div>
            
                    <p className="footer-copy">
                        © 2026 Bolu. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    )
}