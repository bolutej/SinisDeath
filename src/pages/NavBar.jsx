import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom'
import sinisdeath from '../assets/sinisdeath_logo.svg'
import { Squash as Hamburger } from "hamburger-react";
import "../App.css"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          href="/checkout"
          onClick={() => setMenuOpen(false)}
        >
          Cart
        </a>
        <a
          href="/checkout"
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
        <Link to="/checkout" style={{ textDecoration: 'none' }}>
        <FaShoppingCart
          className="cart-icon"
          size={28}
        />
        </Link>
      </nav>

      {/* Overlay */}
      
    </>
  );
}

