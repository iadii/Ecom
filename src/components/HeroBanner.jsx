import { Link } from 'react-router-dom'

export default function HeroBanner({ title, subtitle, image, ctaText = 'Shop Now', ctaLink = '/' }) {
  return (
    <div className="relative w-full h-screen">
      {image && (
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  )
}