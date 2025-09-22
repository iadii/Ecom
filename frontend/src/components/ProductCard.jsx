import { Link } from 'react-router-dom'
import { useWishlist } from '../contexts/WishlistContext'

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const discount = Math.round(((product.price - product.discountedPrice) / product.price) * 100)
  const isWishlisted = isInWishlist(product.id)
  
  // Use images array or fallback to single image
  const mainImage = product.images?.[0] || product.image

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <div className="bg-white rounded-md shadow hover:shadow-md transition overflow-hidden border border-[#F5F5F7] group">
      <Link to={`/product/${product.id}`} className="block relative">
        <img src={mainImage} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
        
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#E63946] text-white text-xs px-2 py-1 rounded-md">
            {discount}% OFF
          </div>
        )}
        
        {/* Out of stock badge */}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-[#555555] text-white text-xs px-2 py-1 rounded-md">
            Out of Stock
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${product.id}`} className="flex-1">
            <h3 className="text-[#222222] font-medium line-clamp-2 hover:text-[#6C1D57] transition-colors">{product.name}</h3>
          </Link>
          <button
            onClick={handleWishlistClick}
            className="p-2 rounded-full hover:bg-[#F5F5F7] transition-colors"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill={isWishlisted ? '#D6336C' : 'none'} 
              stroke="#D6336C" 
              strokeWidth="1.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-[#555555]">({product.reviews || 0})</span>
          </div>
        )}
        
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[#2D6A4F] font-semibold">₹{product.discountedPrice}</span>
          {discount > 0 && (
            <>
              <span className="text-[#555555] line-through text-sm">₹{product.price}</span>
              <span className="text-[#E63946] text-sm">{discount}% off</span>
            </>
          )}
        </div>
        
        {/* Colors preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-[#555555]">Colors:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-[#E5E7EB]"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                ></div>
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-[#555555]">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.slice(0, 4).map(s => (
            <span key={s} className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-md text-[#555555]">{s}</span>
          ))}
          {product.sizes.length > 4 && (
            <span className="px-2 py-1 text-xs text-[#555555]">+{product.sizes.length - 4} more</span>
          )}
        </div>
      </div>
    </div>
  )
}