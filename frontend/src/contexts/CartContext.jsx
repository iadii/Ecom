import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
                 item.selectedSize === action.payload.selectedSize &&
                 item.selectedColor === action.payload.selectedColor
      )
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            item.selectedSize === action.payload.selectedSize &&
            item.selectedColor === action.payload.selectedColor
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload)
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      }
    
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('libas-cart')
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
    }
  }, [])
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('libas-cart', JSON.stringify(state.items))
  }, [state.items])
  
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    const cartItem = {
      ...product,
      cartId: `${product.id}-${selectedSize}-${selectedColor.name}`,
      selectedSize,
      selectedColor,
      quantity,
      addedAt: new Date().toISOString()
    }
    dispatch({ type: 'ADD_TO_CART', payload: cartItem })
  }
  
  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId })
  }
  
  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } })
    }
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0)
  }
  
  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }
  
  const isInCart = (productId, selectedSize, selectedColor) => {
    return state.items.some(
      item => item.id === productId && 
               item.selectedSize === selectedSize &&
               item.selectedColor?.name === selectedColor?.name
    )
  }
  
  return (
    <CartContext.Provider value={{
      cart: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext