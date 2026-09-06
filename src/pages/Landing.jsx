import sinisdeath from '../assets/sinisdeath_logo.svg'
import { Link } from 'react-router-dom'
import "../App.css"

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
        </>
    )
}