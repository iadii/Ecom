import { useWishlist } from '../contexts/WishlistContext'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { wishlist, clearWishlist } = useWishlist()

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#222222]">Your Wishlist ({wishlist.length})</h1>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-[#E63946] hover:underline"
          >
            Clear Wishlist
          </button>
        )}
      </div>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-[#222222] mb-2">Your wishlist is empty</h2>
          <p className="text-[#555555] mb-6">Save items you love to your wishlist.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-md text-white"
            style={{ backgroundColor: '#6C1D57' }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}