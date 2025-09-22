import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { EmailProvider } from './contexts/EmailContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Login from './pages/Login'
import EmailMarketing from './pages/EmailMarketing'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <CartProvider>
      <WishlistProvider>
        <EmailProvider>
          <div className="min-h-screen bg-[#FDFDFD] text-[#222222]">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="pt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections/:id" element={<Collection />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/email-marketing" element={<EmailMarketing />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </EmailProvider>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
