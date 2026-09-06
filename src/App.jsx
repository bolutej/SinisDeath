import './App.css'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import Shop from './pages/Shop'
import Product from './pages/Product'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loading minDuration={2000}><Landing /></Loading>} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product" element={<Product />} />
        {/* <Route path="/socials" element={<Socials />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
