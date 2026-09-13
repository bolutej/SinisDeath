// import { Link } from "react-router-dom"
import "../App.css"
import sinisdeath from '../assets/sinisdeath_logo.svg'
import {Squash as Hamburger} from 'hamburger-react'
import mockup from '../assets/mockup.png'

export default function Checkout() {
     return (
        <>
             <nav>
                <Hamburger toggled={false} toggle={() => {}} />
                <a href="/">
                    <img src={sinisdeath} alt="Logo" />
                </a>
                <h1></h1>
            </nav>
            <div className="checkout">
                <div className="cart">
                    <div className="cart-head">
                    <h1>YOUR CART</h1>
                    <h2>CONTINUE SHOPPING</h2>
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
                            <input type="number" min="1" defaultValue="1" />   
                            <p>delete</p>   
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
                            <input type="number" min="1" defaultValue="1" />   
                            <p>delete</p>   
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
                            <input type="number" min="1" defaultValue="1" />   
                            <p>delete</p>   
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
        </>
     )
}