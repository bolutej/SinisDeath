import { useEffect, useState } from 'react'
import { FaLessThan } from 'react-icons/fa'
import { MdAdd, MdRemove } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useCart } from '../context/CartContext'
import Navbar from './NavBar'
import { useRegion } from '../context/RegionContext'
import Footer from '../pages/Footer'
import Loading from '../pages/loadingg2'

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

const CSS = `
.pd-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 36px 100px;
}

/* BACK */
.pd-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 35px;
  color: #777;
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.pd-back:hover {
  color: #000;
}

/* MAIN PRODUCT LAYOUT */
.pd-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(360px, 0.75fr);
  gap: 90px;
  align-items: start;
}

/* PRODUCT IMAGE */
.pd-image-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pd-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.45s ease, opacity 0.2s ease;
}

.pd-image-wrap:hover img {
  transform: scale(1.025);
}

/* PRODUCT INFORMATION */
.pd-info {
  padding-top: 15px;
  max-width: 480px;
}

/* TITLE */
.pd-title {
  font-size: 28px;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #222;
  margin: 0 0 12px;
}

/* PRICE */
.pd-price {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: #222;
  margin: 0 0 38px;
}

/* LABELS */
.pd-label {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #777;
  margin: 0 0 13px;
}

/* COLORS */
.pd-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  margin-bottom: 32px;
}

.pd-color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.pd-color-swatch:hover {
  transform: scale(1.08);
}

/* SIZES */
.pd-sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 32px;
}

.pd-size-btn {
  min-width: 48px;
  height: 40px;
  padding: 0 13px;
  border: 1px solid #ddd;
  border-radius: 0;
  background: #fff;
  color: #222;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pd-size-btn:hover {
  border-color: #000;
}

.pd-size-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.pd-size-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* QUANTITY */
.pd-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 0;
  margin-bottom: 30px;
}

.pd-stepper button {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: none;
  cursor: pointer;
  color: #222;
}

.pd-stepper button:hover {
  background: #f5f5f5;
}

.pd-stepper button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: #fff;
}

.pd-stock-left {
  color: #b8860b;
  text-transform: none;
  letter-spacing: 0;
}

.pd-stepper span {
  min-width: 38px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
}

/* ADD TO CART */
.pd-add-btn {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 18px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 10px;
}

.pd-add-btn:hover {
  background: #222;
}

.pd-add-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* DETAILS */
.pd-dets {
  margin-top: 30px;
  border-top: 1px solid #e8e8e8;
}

.pd-dets details {
  border-bottom: 1px solid #e8e8e8;
  padding: 18px 0;
}

.pd-dets summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  list-style: none;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #222;
  user-select: none;
}

.pd-dets summary::-webkit-details-marker {
  display: none;
}

.pd-dets summary::after {
  content: "+";
  font-size: 18px;
  font-weight: 300;
  color: #999;
}

.pd-dets details[open] summary::after {
  content: "\\2212";
  color: #222;
}

.pd-dets p {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.8;
  letter-spacing: 0.02em;
  color: #666;
  margin: 14px 0 0;
  max-width: 60ch;
}

/* TABLET */
@media (max-width: 1000px) {
  .pd-page {
    padding: 20px 24px 80px;
  }

  .pd-grid {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 0.8fr);
    gap: 50px;
  }

  .pd-title {
    font-size: 24px;
  }
}

/* MOBILE */
@media (max-width: 700px) {
  .pd-page {
    padding: 15px 14px 60px;
  }

  .pd-back {
    margin-bottom: 22px;
  }

  .pd-grid {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .pd-image-wrap {
    aspect-ratio: 1 / 1;
  }

  .pd-info {
    max-width: none;
    padding-top: 0;
  }

  .pd-title {
    font-size: 21px;
    letter-spacing: 0.1em;
  }

  .pd-price {
    font-size: 13px;
    margin-bottom: 30px;
  }
}
`

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { formatPrice } = useRegion()

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

  // How many of the currently selected size/color combo are actually
  // available. For a variant-less product, this is just the product's
  // own stock_quantity.
  const availableStock =
    variants.length > 0
      ? selectedVariant?.stock_quantity ?? 0
      : product?.stock_quantity ?? 0

  // If stock is lower than what's already in the quantity box — e.g.
  // someone had 5 selected, then switched to a color with only 2 left —
  // pull the quantity back down so "Add to Cart" can never exceed stock.
  useEffect(() => {
    if (availableStock > 0 && quantity > availableStock) {
      setQuantity(availableStock)
    }
  }, [availableStock])

  // Show that color's own photo if any variant with this color has one
  // set. Falls back to the product's main photo, then a placeholder.
  // Matched on color alone (not the exact size+color pair) since you'll
  // usually only upload one photo per color, not per size/color pairing.
  const colorImage = selectedColor
    ? variants.find((v) => v.color === selectedColor && v.image_url)?.image_url
    : null
  const displayedImage = colorImage || product?.image_url || '/placeholder.png'

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
      image: displayedImage,
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
        <Loading/>
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
      <style>{CSS}</style>

      <div className="pd-page">
        <Link to="/shop" className="pd-back">
          <FaLessThan size={12} />
          Back
        </Link>

        <div className="pd-grid">
          <div className="pd-image-wrap">
            <img src={displayedImage} alt={product.name} loading="lazy" />
          </div>

          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-price">{formatPrice(selectedVariant?.price ?? product.price)}</p>

            {availableColors.length > 0 && (
              <>
                <p className="pd-label">Color{selectedColor ? `: ${selectedColor}` : ''}</p>
                <div className="pd-colors">
                  {availableColors.map((color) => {
                    const outOfStock = isColorOutOfStock(color)
                    const isSelected = selectedColor === color
                    return (
                      <button
                        key={color}
                        className="pd-color-swatch"
                        onClick={() => setSelectedColor(color)}
                        disabled={outOfStock}
                        title={color}
                        style={{
                          background: color.toLowerCase(),
                          border: isSelected ? '2px solid #000' : '1px solid rgba(0,0,0,0.2)',
                          boxShadow: isSelected ? '0 0 0 2px #fff, 0 0 0 3px #000' : 'none',
                          cursor: outOfStock ? 'not-allowed' : 'pointer',
                          opacity: outOfStock ? 0.3 : 1,
                        }}
                      />
                    )
                  })}
                </div>
              </>
            )}

            {availableSizes.length > 0 && (
              <>
                <p className="pd-label">Size</p>
                <div className="pd-sizes">
                  {availableSizes.map((size) => {
                    const outOfStock = isSizeOutOfStock(size)
                    return (
                      <button
                        key={size}
                        className={`pd-size-btn${selectedSize === size ? ' active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                        disabled={outOfStock}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            <p className="pd-label">
              Quantity
              {!isOutOfStock && availableStock > 0 && availableStock <= 5 && (
                <span className="pd-stock-left"> — only {availableStock} left</span>
              )}
            </p>
            <div className="pd-stepper">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <MdRemove size={16} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                disabled={quantity >= availableStock}
              >
                <MdAdd size={16} />
              </button>
            </div>

            <button className="pd-add-btn" onClick={handleAddToCart} disabled={isOutOfStock}>
              {isOutOfStock ? 'Out of stock' : 'Add to Cart'}
            </button>

            <div className="pd-dets">
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
        </div>
      </div>

      <Footer />
    </>
  )
}