import sinisdeath from '../assets/sinisdeath_logo.svg'
import { Link } from 'react-router-dom'
import "../App.css"
import Bolu from "../assets/letter-b-logo.svg"

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
            <div className="currency-input">
                <input type="text" placeholder="NGN" style={{ border: '1px solid #ccc', padding: '5px' }} />
            </div>
            <footer>
                <h2>Built by:</h2>
                <a href="https://x.com/BoluTejumol" target="_blank" > <img src={Bolu} alt="Bolu" /></a>
            </footer>
        </>
    )
}