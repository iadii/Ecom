import { useCart } from '../contexts/CartContext'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-[#222222] mb-6">Shopping Cart</h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium text-[#222222] mb-2">Your cart is empty</h2>
          <p className="text-[#555555] mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-md text-white"
            style={{ backgroundColor: '#6C1D57' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#222222]">Shopping Cart ({cart.length})</h1>
        <button
          onClick={clearCart}
          className="text-[#E63946] hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.cartId}
              item={item}
              onRemove={() => removeFromCart(item.cartId)}
              onUpdateQuantity={(quantity) => updateQuantity(item.cartId, quantity)}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary total={getCartTotal()} />
        </div>
      </div>
    </div>
  )
}

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const discount = Math.round(((item.price - item.discountedPrice) / item.price) * 100)

  return (
    <div className="bg-white rounded-md border border-[#F5F5F7] p-4">
      <div className="flex gap-4">
        <Link to={`/product/${item.id}`} className="flex-shrink-0">
          <img
            src={item.selectedColor?.image || item.images?.[0] || item.image}
            alt={item.name}
            className="w-24 h-32 object-cover rounded-md"
          />
        </Link>

        <div className="flex-1">
          <Link to={`/product/${item.id}`} className="hover:text-[#6C1D57]">
            <h3 className="font-medium text-[#222222] mb-2">{item.name}</h3>
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#555555]">Color:</span>
              <div
                className="w-4 h-4 rounded-full border border-[#E5E7EB]"
                style={{ backgroundColor: item.selectedColor?.value }}
              ></div>
              <span className="text-sm text-[#555555]">{item.selectedColor?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#555555]">Size:</span>
              <span className="text-sm font-medium">{item.selectedSize}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#2D6A4F] font-semibold">₹{item.discountedPrice}</span>
            <span className="text-[#555555] line-through text-sm">₹{item.price}</span>
            <span className="text-[#E63946] text-sm">{discount}% off</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center border border-[#E5E7EB] rounded-md">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                className="px-3 py-1 hover:bg-[#F5F5F7]"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="px-3 py-1 hover:bg-[#F5F5F7]"
              >
                +
              </button>
            </div>

            <button
              onClick={onRemove}
              className="text-[#E63946] hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartSummary({ total }) {
  const deliveryFee = total > 1999 ? 0 : 99
  const finalTotal = total + deliveryFee

  return (
    <div className="bg-white rounded-md border border-[#F5F5F7] p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-[#222222] mb-4">Order Summary</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-[#555555]">Subtotal</span>
          <span className="font-medium">₹{total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#555555]">Delivery</span>
          <span className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-[#2D6A4F]">FREE</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>
        {total <= 1999 && (
          <p className="text-xs text-[#555555]">
            Add ₹{1999 - total} more for free delivery
          </p>
        )}
      </div>

      <div className="border-t border-[#E5E7EB] pt-4 mb-6">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>
      </div>

      <button
        className="w-full py-3 rounded-md text-white font-medium mb-3"
        style={{ backgroundColor: '#6C1D57' }}
      >
        Proceed to Checkout
      </button>

      <Link
        to="/"
        className="block w-full py-3 text-center border border-[#E5E7EB] rounded-md hover:bg-[#F5F5F7]"
      >
        Continue Shopping
      </Link>
    </div>
  )
}