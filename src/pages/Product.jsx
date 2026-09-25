import sinisdeath from '../assets/sinisdeath_logo.svg'
import mockup from '../assets/mockup.png'
import "../App.css"
// import {Squash as Hamburger} from 'hamburger-react'
import { FaShoppingCart, FaLessThan } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Bolu from "../assets/Boluslogo.png"

export default function Product() {
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
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-section">
                    <h1 className="">SINISDEATH Ungraved Tracksuit</h1>
                    <p className="">#30,000</p>
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
                    <Link to="/checkout" style={{ textDecoration: 'none' }}>
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