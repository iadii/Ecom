import { useParams } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import Filters from '../components/Filters'
import ProductCard from '../components/ProductCard'
import categories from '../data/categories.json'
import products from '../data/products.json'

export default function Collection() {
  const { id } = useParams()
  const category = categories.find(c => c.id === id) || { name: 'Collection', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop&crop=center' }
  const list = products.filter(p => p.category === id)

  return (
    <div>
      <HeroBanner title={category.name} subtitle={`Explore ${category.name} styles`} image={category.image} />
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <Filters onChange={() => {}} />
        <div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {list.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-medium text-[#222222] mb-2">No products found</h2>
              <p className="text-[#555555]">Try adjusting your filters or browse other categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}