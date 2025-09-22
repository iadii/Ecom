import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard'

export default function ProductDetails() {
  const { id } = useParams()
  const product = products.find(p => String(p.id) === id)
  const related = products.filter(p => p.category === product?.category && p.id !== product.id).slice(0, 4)
  
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null)
  const [quantity, setQuantity] = useState(1)

  if (!product) return <div className="max-w-4xl mx-auto px-6 py-10">Product not found</div>

  const discount = Math.round(((product.price - product.discountedPrice) / product.price) * 100)
  const isWishlisted = isInWishlist(product.id)
  const images = product.images || [product.image]
  const currentImage = selectedColor?.image || images[selectedImageIndex]

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    if (!selectedColor) {
      alert('Please select a color')
      return
    }
    addToCart(product, selectedSize, selectedColor, quantity)
    alert('Added to cart!')
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    // Find image index for this color or use first image
    const colorImageIndex = images.findIndex(img => img === color.image)
    if (colorImageIndex !== -1) {
      setSelectedImageIndex(colorImageIndex)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#555555] mb-6">
        <Link to="/" className="hover:text-[#6C1D57]">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/collections/${product.category}`} className="hover:text-[#6C1D57] capitalize">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#222222]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={currentImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-[3/4] rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-[#6C1D57]' : 'border-[#E5E7EB]'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#222222] mb-2">{product.name}</h1>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-3">
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
                <span className="text-sm text-[#555555]">({product.reviews || 0} reviews)</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-[#2D6A4F]">₹{product.discountedPrice}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-[#555555] line-through">₹{product.price}</span>
                  <span className="bg-[#E63946] text-white px-2 py-1 rounded text-sm font-medium">{discount}% OFF</span>
                </>
              )}
            </div>
            
            <p className="text-[#555555] mb-6">{product.description}</p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h4 className="font-medium text-[#222222] mb-3">Colors</h4>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(color)}
                    className={`relative w-16 h-20 rounded-md overflow-hidden border-2 ${
                      selectedColor?.name === color.name ? 'border-[#6C1D57]' : 'border-[#E5E7EB]'
                    }`}
                  >
                    <img 
                      src={color.image} 
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#222222]">Size</h4>
              <button className="text-sm text-[#6C1D57] hover:underline">Size Chart</button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 rounded-md border ${
                    selectedSize === size 
                      ? 'border-[#6C1D57] bg-[#6C1D57] text-white' 
                      : 'border-[#E5E7EB] hover:border-[#6C1D57]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h4 className="font-medium text-[#222222] mb-3">Quantity</h4>
            <div className="flex items-center border border-[#E5E7EB] rounded-md w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-[#F5F5F7]"
              >
                -
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-[#F5F5F7]"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3 rounded-md text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              style={{ backgroundColor: product.stock > 0 ? '#6C1D57' : undefined }}
            >
              {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
            </button>
            
            <button 
              onClick={() => toggleWishlist(product)}
              className="w-full py-3 rounded-md border border-[#6C1D57] text-[#6C1D57] font-medium hover:bg-[#6C1D57] hover:text-white transition-colors"
            >
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-[#2D6A4F]">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-[#E63946]">✗ Out of Stock</span>
            )}
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="border-t border-[#E5E7EB] pt-6">
              <h4 className="font-medium text-[#222222] mb-4">Specifications</h4>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-[#555555] capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="border-t border-[#E5E7EB] pt-6">
            <h4 className="font-medium text-[#222222] mb-3">Delivery Information</h4>
            <div className="space-y-2 text-sm text-[#555555]">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#2D6A4F]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>Express delivery available</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#2D6A4F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Easy 30-day returns</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#2D6A4F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h3 className="text-xl font-semibold text-[#222222] mb-6">You May Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}