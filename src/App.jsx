import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { usePageTracking } from './hooks/usePageTracking'
import { useAnnouncePresence } from './hooks/useAnnounePresence'
import './App.css'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Info from './pages/Info'
import Checkout from './pages/Checkout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard  from './admin/pages/AdminDashboard'
import AdminOrders from './admin/pages/AdminOrders'
import AdminProducts from './admin/pages/AdminProducts'
import AdminAnalytics from './admin/pages/AdminAnalytics'
import CartProvider from './context/CartContext'
import RequireAdmin from './admin/RequireAdmin'

function AppRouutes() {
  usePageTracking()
  useAnnouncePresence()
  return (
    <Routes>
        <Route path="/" element={<Loading minDuration={2000}><Landing /></Loading>} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path='/info' element={<Info />} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/admin' element={<RequireAdmin><AdminDashboard/></RequireAdmin>} />
        <Route path='/admin/orders' element={<RequireAdmin><AdminOrders/></RequireAdmin>} />
        <Route path='/admin/products' element={<RequireAdmin><AdminProducts/></RequireAdmin>} />
        <Route path='/admin/analytics' element={<RequireAdmin><AdminAnalytics/></RequireAdmin>} />
      </Routes>
  )
}


function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      <AppRouutes />
    </BrowserRouter>
    </CartProvider>
  )
}

export default App
