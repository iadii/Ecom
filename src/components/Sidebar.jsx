import { useState } from 'react'
import { Link } from 'react-router-dom'
import categories from '../data/categories.json'

export default function Sidebar({ isOpen, onClose }) {
  const [openSections, setOpenSections] = useState({ sale: true, collections: true, categories: true, offers: false })
  const toggle = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }))

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" aria-hidden="true">
          <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
        </div>
      )}
      <aside className={`fixed top-0 left-0 z-50 h-full w-80 bg-[#F5F5F7] shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
          <span className="font-semibold text-[#222222]">Menu</span>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-4 space-y-3">
          <Section title="Sale" isOpen={openSections.sale} onToggle={() => toggle('sale')}>
            <ul className="space-y-2">
              <li><Link to="/collections/gul" className="hover:text-[#6C1D57]">Flat 50% Off</Link></li>
              <li><Link to="/collections/bahaar" className="hover:text-[#6C1D57]">New Arrivals</Link></li>
            </ul>
          </Section>
          <Section title="Collections" isOpen={openSections.collections} onToggle={() => toggle('collections')}>
            <ul className="space-y-2">
              {categories.map(c => (
                <li key={c.id}><Link to={`/collections/${c.id}`} className="hover:text-[#6C1D57]">{c.name}</Link></li>
              ))}
            </ul>
          </Section>
          <Section title="Categories" isOpen={openSections.categories} onToggle={() => toggle('categories')}>
            <ul className="space-y-2">
              <li><Link to="/collections/gul" className="hover:text-[#6C1D57]">Kurtas</Link></li>
              <li><Link to="/collections/bahaar" className="hover:text-[#6C1D57]">Suits</Link></li>
              <li><Link to="/collections/monochrome" className="hover:text-[#6C1D57]">Dresses</Link></li>
            </ul>
          </Section>
          <Section title="Offers" isOpen={openSections.offers} onToggle={() => toggle('offers')}>
            <div className="rounded-md p-3 bg-[#FFF1E6] text-[#222222]">Extra 10% off on orders above ₹1999</div>
          </Section>
        </div>
      </aside>
    </>
  )
}

function Section({ title, isOpen, onToggle, children }) {
  return (
    <div className="bg-white rounded-md">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3">
        <span className="font-medium text-[#222222]">{title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {isOpen && <div className="px-4 pb-3 text-[#555555]">{children}</div>}
    </div>
  )
}