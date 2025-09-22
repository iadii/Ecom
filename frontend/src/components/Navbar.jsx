import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

export default function Navbar({ onMenuClick }) {
  const { getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()
  
  const cartCount = getCartCount()
  const wishlistCount = getWishlistCount()

  return (
    <nav className="sticky top-0 z-30 bg-[#FDFDFD] border-b border-[#F5F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button aria-label="Open menu" onClick={onMenuClick} className="p-2 rounded-md hover:bg-[#F5F5F7]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#222222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <Link to="/" className="text-xl font-semibold" style={{ color: '#6C1D57' }}>Poshak</Link>
        </div>

        {/* <div className="hidden md:flex flex-1 max-w-md mx-6">
          <input type="text" placeholder="Search products..." className="w-full border border-[#F5F5F7] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6336C]" />
        </div> */}

        <div className="flex items-center gap-4">
          <Link to="/wishlist" aria-label="Wishlist" className="p-2 rounded-md hover:bg-[#F5F5F7] relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 24 24" 
              fill="#D6336C"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E63946] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="p-2 rounded-md hover:bg-[#F5F5F7] relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#222222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="7" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6C1D57] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          <Link to="/login" aria-label="User" className="p-2 rounded-md hover:bg-[#F5F5F7]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#222222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.5 8.5 0 0 1 13 0"/></svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}