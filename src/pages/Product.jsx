import { useEffect, useState } from 'react'
import sinisdeath from '../assets/sinisdeath_logo.svg'
import mockup from '../assets/mockup.png'
import "../App.css"
import { FaShoppingCart, FaLessThan } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Bolu from "../assets/Boluslogo.png"
import { supabase } from '../supabaseClient'
import { useCart } from '../context/CartContext'
import Navbar from './NavBar'

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    const { data, error } = await supabase
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
    const productVariants = data.product_variants ?? []
    setVariants(productVariants)

    const firstInStock =
      productVariants.find((v) => v.stock_quantity > 0) ?? productVariants[0]
    setSelectedSize(firstInStock?.size ?? null)
    setSelectedColor(firstInStock?.color ?? null)

    setLoading(false)
  }

  const availableSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  )
  const availableColors = [...new Set(variants.map((v) => v.color).filter(Boolean))]

  const selectedVariant = variants.find(
    (v) =>
      (availableSizes.length === 0 || v.size === selectedSize) &&
      (availableColors.length === 0 || v.color === selectedColor)
  )

  const isOutOfStock =
    variants.length > 0
      ? (selectedVariant?.stock_quantity ?? 0) <= 0
      : (product?.stock_quantity ?? 0) <= 0

  const isSizeOutOfStock = (size) => {
    const matches = variants.filter(
      (v) => v.size === size && (availableColors.length === 0 || v.color === selectedColor)
    )
    if (matches.length === 0) return false
    return matches.every((v) => v.stock_quantity <= 0)
  }

  const isColorOutOfStock = (color) => {
    const matches = variants.filter(
      (v) => v.color === color && (availableSizes.length === 0 || v.size === selectedSize)
    )
    if (matches.length === 0) return false
    return matches.every((v) => v.stock_quantity <= 0)
  }

  const handleAddToCart = () => {
    if (!product) return
    if (variants.length > 0 && !selectedVariant) return

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      price: selectedVariant?.price ?? product.price,
      image: product.image_url || mockup,
      size: selectedVariant?.size ?? null,
      color: selectedVariant?.color ?? null,
      quantity,
    })

    navigate('/cart')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 40 }}>Loading...</p>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 40 }}>Product not found.</p>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Link to="/shop" style={{ textDecoration: 'none' }}>
        <div className="back">
          <FaLessThan size={14} color="gray" />
          <p>Back</p>
        </div>
      </Link>
      <section>
        <section className="product-each">
          <div className="">
            <img src={product.image_url || mockup} alt={product.name} loading="lazy" />
          </div>
          <div className="product-section">
            <h1 className="">{product.name}</h1>
            <p className="">₦{Number(selectedVariant?.price ?? product.price).toLocaleString()}</p>

            <div className="product-options">
              {availableColors.length > 0 && (
                <>
                  <h5>Color{selectedColor ? `: ${selectedColor}` : ''}</h5>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    {availableColors.map((color) => {
                      const outOfStock = isColorOutOfStock(color)
                      const isSelected = selectedColor === color
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          disabled={outOfStock}
                          title={color}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: color.toLowerCase(),
                            border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                            boxShadow: isSelected ? '0 0 0 2px #000' : 'none',
                            cursor: outOfStock ? 'not-allowed' : 'pointer',
                            opacity: outOfStock ? 0.3 : 1,
                            padding: 0,
                          }}
                        />
                      )
                    })}
                  </div>
                </>
              )}

              {availableSizes.length > 0 && (
                <>
                  <h5>Size</h5>
                  <div className="size-options">
                    {availableSizes.map((size) => {
                      const outOfStock = isSizeOutOfStock(size)
                      return (
                        <button
                          key={size}
                          className={selectedSize === size ? 'active' : ''}
                          onClick={() => setSelectedSize(size)}
                          disabled={outOfStock}
                          style={outOfStock ? { opacity: 0.35, cursor: 'not-allowed' } : undefined}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              <h5>Quantity</h5>
              <div className="quantity">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={isOutOfStock ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              {isOutOfStock ? 'Out of stock' : 'Add to Cart'}
            </button>

            <div className="dets">
              <details>
                <summary>Description</summary>
                <p>{product.description || 'No description available for this product yet.'}</p>
              </details>
              <details>
                <summary>Delivery Info</summary>
                <p>
                  We ship to Nigeria, the United States, the United Kingdom, Ghana,
                  and Canada. Delivery typically takes 7–14 business days depending
                  on your location and local customs processing. You'll receive a
                  confirmation with tracking details once your order ships.
                </p>
              </details>
              <details>
                <summary>Returns & Exchanges</summary>
                <p>
                  All sales are final. We currently do not offer returns or
                  exchanges, so please double-check your size and color selection
                  before completing your order. If your item arrives damaged or
                  incorrect, reach out to us and we'll make it right.
                </p>
              </details>
              <details>
                <summary>Size Guide</summary>
                <p>
                  Our fit runs true to size. If you're between sizes, we recommend
                  sizing up for a more relaxed fit. XS fits roughly 34" chest, S fits
                  36–38", M fits 39–41", L fits 42–44", XL fits 45–47", XXL fits
                  48–50", and XXXL fits 51"+. Still unsure? Reach out to us before
                  ordering and we'll help you pick the right size.
                </p>
              </details>
            </div>
          </div>
        </section>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-title">Built by</p>
          <a href="https://x.com/BoluTejumol" target="_blank" rel="noopener noreferrer" className="footer-logo">
            <img src={Bolu} alt="Bolu" />
          </a>
          <div className="footer-line"></div>
          <p className="footer-copy">© 2026 Bolu. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}