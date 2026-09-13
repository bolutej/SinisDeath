import sinisdeath from '../assets/sinisdeath_logo.svg'
import mockup from '../assets/mockup.png'
import "../App.css"
import {Squash as Hamburger} from 'hamburger-react'
import { FaShoppingCart } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Shop() {
    return (
        <>
            <nav>
                <Hamburger toggled={false} toggle={() => {}} />
                <a href="/">
                    <img src={sinisdeath} alt="Logo" />
                </a>
                <FaShoppingCart className="text-gray-700 hover:text-blue-600 transition-colors" size={28}/>
            </nav>
            <main>
                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                <section className="product-card">
                    <div className="product-image-wrap">
                    <img src={mockup} alt="Mockup" loading="lazy"/>
                    </div>
                    <div className="product-info">
                    <h3 className="product-title">Premuim Tee</h3>
                    <p className="product-price">$29.99</p>
                    {/* <button className="add-to-cart">Add to Cart</button> */}
                    </div>
                </section>
                </Link>
            </main>

            <footer>

            </footer>
            
        </>
    )
}