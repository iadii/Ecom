import { useState } from 'react'

export default function WishlistButton({ initialActive = false, onToggle }) {
  const [active, setActive] = useState(initialActive)
  const toggle = () => {
    const next = !active
    setActive(next)
    onToggle && onToggle(next)
  }
  return (
    <button onClick={toggle} aria-label="Toggle Wishlist" className="p-2 rounded-md hover:bg-[#F5F5F7]">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        viewBox="0 0 24 24" 
        fill={active ? '#D6336C' : 'none'} 
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
  )
}