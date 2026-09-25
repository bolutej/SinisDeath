import sinisdeath from '../assets/sinisdeath_logo.svg'
import { Link } from 'react-router-dom'
import "../App.css"
import Bolu from "../assets/Boluslogo.png"

export default function Landingpage() {
    return (
        <>
            <header>
                    <img src={sinisdeath} alt="Logo" />
            </header>
            <main className="landing-page">
                <h1><Link to="/shop">Shop</Link></h1>
                <h1><Link to="/socials">Socials</Link></h1>
            </main>
            
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