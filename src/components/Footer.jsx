import { useState } from 'react'
import { useEmail } from '../contexts/EmailContext'

export default function Footer() {
  const { addSubscriber } = useEmail()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    try {
      addSubscriber({
        name: email.split('@')[0],
        email: email,
        segment: 'newsletter',
        tags: ['footer-signup']
      })
      alert('Successfully subscribed to our newsletter!')
      setEmail('')
    } catch (error) {
      alert('Subscription failed. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }
  return (
    <footer className="mt-12 bg-[#FADADD] text-[#222222]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <section>
          <h4 className="font-semibold mb-3">Contact Us</h4>
          <p className="text-[#555555]">support@poshak.com</p>
          <p className="text-[#555555]">+91-9876543210</p>
        </section>
        <section>
          <h4 className="font-semibold mb-3">Explore More</h4>
          <ul className="text-[#555555] space-y-2">
            <li>About</li>
            <li>Stores</li>
            <li>Careers</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-3">Customer Experience</h4>
          <ul className="text-[#555555] space-y-2">
            <li>Shipping</li>
            <li>Returns</li>
            <li>Track Order</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-3">Subscribe to Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="flex-1 px-3 py-2 rounded-md border border-[#E5E7EB]" 
              required
            />
            <button 
              type="submit"
              disabled={isSubscribing}
              className="px-4 py-2 rounded-md text-white disabled:opacity-50" 
              style={{ backgroundColor: '#6C1D57' }}
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </section>
      </div>
      <div className="text-center text-[#555555] py-4 border-t border-[#E5E7EB]">© {new Date().getFullYear()} Poshak</div>
    </footer>
  )
}