import mockup from '../assets/mockup.png'
import "../App.css"
import { Link } from 'react-router-dom'
import NavBar from './NavBar'

export default function Shop() {
    return (
        <>
            <NavBar />
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