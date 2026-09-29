import { useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import "../../App.css"
import sinisdeath from '../../assets/sinisdeath_logo_dark.svg'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

   const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })


  return (
    <header className="ad-topbar">
      <style>{styles}</style>
      <nav className="navbar">
        <Hamburger
          toggled={menuOpen}
          toggle={setMenuOpen}
          style={{paddingBottom: 20, color: '#0000'}}
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
          href="/admin"
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </a>

        <a
          href="/admin/products"
          onClick={() => setMenuOpen(false)}
        >
          Products
        </a>

        <a
          href="/admin/orders"
          onClick={() => setMenuOpen(false)}
        >
          Orders
        </a>
        <a
          href="/admin/analytics"
          onClick={() => setMenuOpen(false)}
        >
          Analytics
        </a>
      </div>
        
      </nav>   
      <img src={sinisdeath} alt="Sinisdeath" className="ad-logo" />
      <span className="ad-date">{today}</span>
    </header>
  );
}

  const styles = `
  .ad-topbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 20px 32px;
  background: var(--card); border-bottom: 1px solid var(--line);
}
.ad-logo { width: 180px; max-width: 55%; height: auto; }
.ad-date { color: var(--muted); font-size: 14px; }
`