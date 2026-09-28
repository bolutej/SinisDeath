import sinisdeath from '../assets/sinisdeath_logo_dark.svg'
import { Link } from 'react-router-dom'
import "../App.css"
import RegionPicker from '../pages/RegionPicker'
import Footer from '../pages/Footer'

export default function Landingpage() {
  return (
    <div style={{}}>
      <RegionPicker />

      <header>
        <img src={sinisdeath} alt="Logo" />
      </header>
      <main className="landing-page">
        <h1><Link to="/shop">Shop</Link></h1>
        <h1><Link to="/socials">Socials</Link></h1>
      </main>

        <Footer />
      
    </div>
  )
}