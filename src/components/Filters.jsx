import { useState, useEffect } from 'react'

export default function Filters({ value, onChange }) {
  const [local, setLocal] = useState(value || { sizes: [], colors: [], fabric: [], occasion: [], price: { min: 0, max: 10000 } })

  useEffect(() => { setLocal(value || local) }, [value])

  const update = (next) => {
    setLocal(next)
    onChange && onChange(next)
  }

  const toggleIn = (key, item) => {
    const arr = local[key]
    const nextArr = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
    update({ ...local, [key]: nextArr })
  }

  const setPrice = (min, max) => update({ ...local, price: { min, max } })

  const sizes = ['XS','S','M','L','XL','XXL']
  const colors = ['red','pink','blue','green','black','white']
  const fabric = ['cotton','silk','rayon']
  const occasion = ['daily','ethnic','party']

  return (
    <div className="bg-[#F5F5F7] p-4 rounded-md">
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map(s => (
            <button key={s} onClick={() => toggleIn('sizes', s)} className={`px-3 py-1 rounded-md border ${local.sizes.includes(s) ? 'bg-[#6C1D57] text-white border-[#6C1D57]' : 'bg-white text-[#222222] border-[#E5E7EB]'}`}>{s}</button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <button key={c} onClick={() => toggleIn('colors', c)} className={`px-3 py-1 rounded-md border ${local.colors.includes(c) ? 'bg-[#6C1D57] text-white border-[#6C1D57]' : 'bg-white text-[#222222] border-[#E5E7EB]'}`}>{c}</button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Fabric">
        <div className="flex flex-wrap gap-2">
          {fabric.map(f => (
            <button key={f} onClick={() => toggleIn('fabric', f)} className={`px-3 py-1 rounded-md border ${local.fabric.includes(f) ? 'bg-[#6C1D57] text-white border-[#6C1D57]' : 'bg-white text-[#222222] border-[#E5E7EB]'}`}>{f}</button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Price">
        <div className="flex items-center gap-2">
          <input type="number" value={local.price.min} onChange={e => setPrice(Number(e.target.value), local.price.max)} className="w-24 px-2 py-1 border rounded" />
          <span>-</span>
          <input type="number" value={local.price.max} onChange={e => setPrice(local.price.min, Number(e.target.value))} className="w-24 px-2 py-1 border rounded" />
        </div>
      </FilterSection>
      <FilterSection title="Occasion">
        <div className="flex flex-wrap gap-2">
          {occasion.map(o => (
            <button key={o} onClick={() => toggleIn('occasion', o)} className={`px-3 py-1 rounded-md border ${local.occasion.includes(o) ? 'bg-[#6C1D57] text-white border-[#6C1D57]' : 'bg-white text-[#222222] border-[#E5E7EB]'}`}>{o}</button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, children }) {
  return (
    <div className="mb-4">
      <h4 className="font-medium text-[#222222] mb-2">{title}</h4>
      {children}
    </div>
  )
}