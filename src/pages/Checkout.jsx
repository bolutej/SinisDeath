// import { Link } from "react-router-dom"
import "../App.css"
import sinisdeath from '../assets/sinisdeath_logo.svg'
import {Squash as Hamburger} from 'hamburger-react'
import { MdDelete } from "react-icons/md"
import mockup from '../assets/mockup.png'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import Bolu from "../assets/Boluslogo.png"

export default function Checkout() {
     return (
        <>
             <NavBar />
            <div className="checkout">
                <div className="cart">
                    <div className="cart-head">
                    <h1>YOUR CART</h1>
                    <Link to="/product">
                        <h2>CONTINUE SHOPPING</h2>
                    </Link>
                    
                    </div>
                    <div className="cart-label">
                        <h5>PRODUCT TITLE</h5>
                        <div>
                            <h5>QUANTITY</h5>
                        <h5>TOTAL</h5>
                        </div>
                        
                    </div>
                    <div className="cart-main">
                        <div className="cart-item">
                        <img src={mockup} alt="Mockup" loading="lazy"/>
                        <div>
                        <h3>SINISDEATH <br></br> TRACKSUIT</h3>
                        <p>#250,000</p>
                        </div>
                        </div>
                        <div className="cart-quantity">
                            <div className="quantity">
                                <button>−</button>
                                <span>2</span>
                                <button>+</button>
                            </div>  
                            <MdDelete className="delete"/>  
                             <p>#250,000</p>   
                        </div>
                        
                              
                    </div>
                    <div className="cart-main">
                        <div className="cart-item">
                        <img src={mockup} alt="Mockup" loading="lazy"/>
                        <div>
                        <h3>SINISDEATH <br></br> TRACKSUIT</h3>
                        <p>#250,000</p>
                        </div>
                        </div>
                        <div className="cart-quantity">
                            <div className="quantity">
                                <button>−</button>
                                <span>2</span>
                                <button>+</button>
                            </div>  
                            <MdDelete className="delete"/>    
                             <p>#250,000</p>   
                        </div>
                        
                              
                    </div>
                    <div className="cart-main">
                        <div className="cart-item">
                        <img src={mockup} alt="Mockup" loading="lazy"/>
                        <div>
                        <h3>SINISDEATH <br></br> TRACKSUIT</h3>
                        <p>#250,000</p>
                        </div>
                        </div>
                        <div className="cart-quantity">
                            <div className="quantity">
                                <button>−</button>
                                <span>2</span>
                                <button>+</button>
                            </div>  
                            <MdDelete className="delete"/>     
                             <p>#250,000</p>   
                        </div>
                        
                              
                    </div>
                </div>
            </div>
            <div className="checkout-total">
                <div>
                <h2>Order Summary</h2>
                <div className="checkout-total-item"> 
                    <p>SUB-TOTAL</p>
                    <p>#250,000</p>
                 </div>
                 <div className="checkout-total-item">
                    <p>SHIPPING</p>
                    <p>Calculated at checkout</p>
                 </div>
                 <button>CHECKOUT  </button>
                </div>

            </div>
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