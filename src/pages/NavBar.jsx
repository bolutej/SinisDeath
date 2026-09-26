import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom'
import sinisdeath from '../assets/sinisdeath_logo.svg'
import { Squash as Hamburger } from "hamburger-react";
import "../App.css"
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <nav className="navbar">
        <Hamburger
          toggled={menuOpen}
          toggle={setMenuOpen}
          style={{paddingBottom: 20}}
        />
        {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-out menu */}
      <div
        className={`side-menu ${
          menuOpen ? "open" : ""
        }`}
      >
        <a
          href="/"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </a>

        <a
          href="/shop"
          onClick={() => setMenuOpen(false)}
        >
          Shop
        </a>

        <a
          href="/cart"
          onClick={() => setMenuOpen(false)}
        >
          Cart
        </a>
        <a
          href="/info"
          onClick={() => setMenuOpen(false)}
        >
          Info
        </a>
      </div>
        <a href="/">
          <img
            src={sinisdeath}
            alt="Logo"
            className="logo"
          />
        </a>
        <Link to="/cart" style={{ textDecoration: 'none', position: 'relative', display: 'inline-block' }}>
        <FaShoppingCart
          className="cart-icon"
          size={28}
        />
        {totalItems > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: '#e07a5f',
                color: '#fff',
                borderRadius: '50%',
                width: 18,
                height: 18,
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </nav>
      
    </>
  );
}

