import sinisdeath from '../assets/sinisdeath_logo.svg'
import mockup from '../assets/mockup.png'
import "../App.css"
// import {Squash as Hamburger} from 'hamburger-react'
import { FaShoppingCart, FaLessThan } from 'react-icons/fa'
import { Link } from 'react-router-dom'

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
                    <div>
                        <h5>Size</h5>
                        <select>
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                        </select>
                    </div>
                    <div>
                        <h5>Quantity</h5>
                        <input type="number" min="1" defaultValue="1" />
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
        </>
    )
}