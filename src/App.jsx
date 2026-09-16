import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard  from './admin/pages/AdminDashboard'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loading minDuration={2000}><Landing /></Loading>} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product" element={<Product />} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/admin' element={<AdminDashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
