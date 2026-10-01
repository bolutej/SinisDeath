import { Link } from 'react-router-dom'
import { MdDelete, MdAdd, MdRemove } from "react-icons/md"
import NavBar from './NavBar'
import Footer from '../pages/Footer'
import { useCart } from '../context/CartContext'
import { useRegion } from '../context/RegionContext'

const CSS = `
.ct-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 36px 100px;
}

/* HEADER */
.ct-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 45px;
}

.ct-title {
  font-size: 25px;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #222;
}

.ct-continue {
  font-size: 10px;
  font-weight: 500;
  text-decoration: underline;
  color: #222;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

/* EMPTY CART */
.ct-empty {
  text-align: center;
  padding: 120px 20px;
}

.ct-empty p {
  margin: 0 0 25px;
  color: #777;
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.ct-empty a {
  display: inline-block;
  padding: 15px 28px;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* MAIN LAYOUT */
.ct-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.7fr);
  gap: 90px;
  align-items: start;
}

/* CART ITEMS */
.ct-list {
  display: flex;
  flex-direction: column;
}

.ct-row {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #e8e8e8;
}

.ct-row:first-child {
  padding-top: 0;
}

/* IMAGE */
.ct-thumb {
  width: 130px;
  height: 130px;
  flex-shrink: 0;
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ct-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* PRODUCT DETAILS */
.ct-details {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ct-name {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0;
  color: #222;
}

.ct-opts {
  font-size: 9px;
  font-weight: 400;
  color: #999;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.ct-unit {
  font-size: 11px;
  font-weight: 400;
  color: #555;
  margin: 4px 0 0;
  letter-spacing: 0.05em;
}

/* RIGHT SIDE */
.ct-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 14px;
  min-width: 120px;
}

.ct-line-total {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #222;
}

/* QUANTITY */
.ct-stepper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 0;
}

.ct-stepper button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: none;
  cursor: pointer;
  color: #222;
}

.ct-stepper button:hover {
  background: #f5f5f5;
}

.ct-stepper span {
  min-width: 28px;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
}

/* REMOVE */
.ct-remove {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 9px;
  font-weight: 500;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.ct-remove:hover {
  color: #e90e0e;
}

/* SUMMARY */
.ct-summary {
  padding: 0;
  position: sticky;
  top: 30px;
}

.ct-summary h2 {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #222;
  margin: 0 0 20px;
  font-weight: 500;
}

.ct-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  font-size: 11px;
  font-weight: 400;
  border-top: 1px solid #e8e8e8;
  letter-spacing: 0.04em;
}

.ct-summary-row:first-of-type {
  border-top: 1px solid #e8e8e8;
}

.ct-summary-row.total {
  font-weight: 500;
  font-size: 13px;
  border-top: 1px solid #222;
  margin-top: 8px;
  padding-top: 18px;
}

.ct-summary-note {
  color: #999;
  font-size: 9px;
}

/* CHECKOUT */
.ct-checkout-btn {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 25px;
  padding: 18px;
  background: #000;
  color: #fff;
  text-align: center;
  border-radius: 0;
  text-decoration: none;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.ct-checkout-btn:hover {
  background: #222;
}

/* TABLET */
@media (max-width: 1000px) {
  .ct-page {
    padding: 26px 24px 80px;
  }

  .ct-grid {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.7fr);
    gap: 50px;
  }

  .ct-row {
    grid-template-columns: 110px minmax(0, 1fr) auto;
    gap: 18px;
  }

  .ct-thumb {
    width: 110px;
    height: 110px;
  }
}

/* MOBILE */
@media (max-width: 700px) {
  .ct-page {
    padding: 20px 14px 60px;
  }

  .ct-head {
    margin-bottom: 30px;
  }

  .ct-title {
    font-size: 19px;
  }

  .ct-continue {
    font-size: 8px;
  }

  .ct-grid {
    grid-template-columns: 1fr;
    gap: 45px;
  }

  .ct-summary {
    position: static;
  }

  .ct-row {
    grid-template-columns: 90px minmax(0, 1fr);
    gap: 14px;
    align-items: start;
  }

  .ct-thumb {
    width: 90px;
    height: 90px;
  }

  .ct-side {
    grid-column: 2;
    width: 100%;
    min-width: 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: -4px;
  }

  .ct-line-total {
    order: 3;
  }

  .ct-name {
    font-size: 11px;
  }

  .ct-unit {
    font-size: 9px;
  }

  .ct-opts {
    font-size: 8px;
  }
}
`

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()
  const { formatPrice } = useRegion()

  return (
    <>
      <NavBar />
      <style>{CSS}</style>

      <div className="ct-page">
        <div className="ct-head">
          <h1 className="ct-title">Your Cart</h1>
          <Link to="/shop" className="ct-continue">Continue shopping</Link>
        </div>

        {items.length === 0 ? (
          <div className="ct-empty">
            <p>Your cart is empty.</p>
            <Link to="/shop">Go to shop</Link>
          </div>
        ) : (
          <div className="ct-grid">
            <div className="ct-list">
              {items.map((item) => (
                <div className="ct-row" key={`${item.productId}-${item.variantId}`}>
                  <div className="ct-thumb">
                    {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
                  </div>

                  <div className="ct-details">
                    <p className="ct-name">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="ct-opts">
                        {[item.size, item.color].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    <p className="ct-unit">{formatPrice(item.price)} each</p>
                  </div>

                  <div className="ct-side">
                    <span className="ct-line-total">{formatPrice(item.price * item.quantity)}</span>

                    <div className="ct-stepper">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      >
                        <MdRemove size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      >
                        <MdAdd size={14} />
                      </button>
                    </div>

                    <button
                      className="ct-remove"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      <MdDelete size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="ct-summary">
              <h2>Order Summary</h2>
              <div className="ct-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="ct-summary-row">
                <span>Shipping</span>
                <span className="ct-summary-note">Calculated at checkout</span>
              </div>
              <div className="ct-summary-row total">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <Link to="/checkout" className="ct-checkout-btn">Checkout</Link>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}