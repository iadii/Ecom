import HeroBanner from '../components/HeroBanner'
import ProductCard from '../components/ProductCard'
import categories from '../data/categories.json'
import products from '../data/products.json'

export default function Home() {
  const featured = products.slice(0, 6)
  return (
    <div>
      <HeroBanner title="" subtitle="" image="https://images.pexels.com/photos/27103969/pexels-photo-27103969.jpeg" ctaText="" ctaLink="/" />

      <section className="max-w-7xl mx-auto px-6 mt-10">
        <h3 className="text-xl font-semibold text-[#222222] mb-4">Collections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(c => (
            <a href={`/collections/${c.id}`} key={c.id} className="group relative rounded-lg overflow-hidden border border-[#F5F5F7] shadow-md hover:shadow-xl transition-all duration-300">
              <img src={c.image} alt={c.name} className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-4 text-white font-semibold text-lg">{c.name}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-10">
        <h3 className="text-xl font-semibold text-[#222222] mb-4">Featured Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  )
}