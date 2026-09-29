import sinisdeath from '../assets/sinisdeath_logo_dark.svg'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import "../App.css"
import RegionPicker from '../pages/RegionPicker'
import { useRegion } from '../context/RegionContext'
import Footer from '../pages/Footer'

export default function Landingpage() {
  const { setPickerOpen } = useRegion()
 
  // Always show the region picker when someone lands on this page,
  // even if they already chose a region on a previous visit.
  useEffect(() => {
    setPickerOpen(true)
  }, [])
 
  return (
    <>
      <RegionPicker />
 
      <header>
        <img src={sinisdeath} alt="Logo" />
      </header>
      <main className="landing-page">
        <h1><Link to="/shop">Shop</Link></h1>
        <h1><Link to="/socials">Socials</Link></h1>
      </main>
 
      <Footer/>
    </>
  )
}