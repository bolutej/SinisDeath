import "../App.css"
import { MdDelete } from "react-icons/md"
import mockup from '../assets/mockup.png'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import Bolu from "../assets/Boluslogo.png"
import { useCart } from '../context/CartContext'

export default function Cart() {
    const { items, updateQuantity, removeItem, totalPrice } = useCart()

     return (
       <>
      <NavBar />
      <div className="cartt">
        <div className="cart">
          <div className="cart-head">
            <h1>YOUR CART</h1>
            <Link to="/shop">
              <h2>CONTINUE SHOPPING</h2>
            </Link>
          </div>
 
          {items.length === 0 ? (
            <p style={{ padding: '40px 0', textAlign: 'center' }}>
              Your cart is empty.
            </p>
          ) : (
            <>
              <div className="cart-label">
                <h5>PRODUCT TITLE</h5>
                <div>
                  <h5>QUANTITY</h5>
                  <h5>TOTAL</h5>
                </div>
              </div>
 
              {items.map((item) => (
                <div className="cart-main" key={`${item.productId}-${item.variantId}`}>
                  <div className="cart-item">
                    <img src={item.image || mockup} alt={item.name} loading="lazy" />
                    <div>
                      <h3>{item.name}</h3>
                      {(item.size || item.color) && (
                        <p style={{ fontSize: 13, color: '#aaa' }}>
                          {[item.size, item.color].filter(Boolean).join(' / ')}
                        </p>
                      )}
                      <p>₦{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="cart-quantity">
                    <div className="quantity">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <MdDelete
                      className="delete"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      style={{ cursor: 'pointer' }}
                    />
                    <p>₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
 
      {items.length > 0 && (
        <div className="checkout-total">
          <div>
            <h2>Order Summary</h2>
            <div className="checkout-total-item">
              <p>SUB-TOTAL</p>
              <p>₦{totalPrice.toLocaleString()}</p>
            </div>
            <div className="checkout-total-item">
              <p>SHIPPING</p>
              <p>Calculated at checkout</p>
            </div>
            <Link to="/checkout" style={{ textDecoration: 'none' }}>
              <button>CHECKOUT</button>
            </Link>
          </div>
        </div>
      )}
 
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
          <p className="footer-copy">© 2026 Bolu. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}