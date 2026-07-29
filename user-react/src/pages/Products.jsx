import { useState } from 'react'
import Icon from '../components/Icon'
import SubHeader from '../components/SubHeader'
import ProductCard, { EmptyState } from '../components/ProductCard'
import { allProducts, platformCategories } from '../data/catalog'

export default function Products({ initialCategory = 'All' }) {
  const [filter, setFilter] = useState(initialCategory)
  const [q, setQ] = useState('')
  const cats = ['All', ...platformCategories().map((c) => c.name)]
  const query = q.toLowerCase()
  const list = allProducts().filter(
    (p) => (filter === 'All' || p.cat === filter) && (p.name.toLowerCase().includes(query) || p.biz.name.toLowerCase().includes(query)),
  )

  return (
    <div className="screen">
      <SubHeader title="All Products" sub={`${list.length} items across all stores`}>
        <div className="flex items-center gap-2 bg-page rounded-xl px-3 py-2.5 border border-border mt-3">
          <Icon name="search-outline" className="text-gray-400 shrink-0" style={{ fontSize: '16px' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="bg-transparent text-[13px] text-navy-dark placeholder-gray-400 flex-1 border-none" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-sb mt-3 pb-0.5">
          {cats.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`press shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${filter === c ? 'bg-navy text-white' : 'bg-page border border-border text-gray-500'}`}>{c}</button>
          ))}
        </div>
      </SubHeader>
      <div className="p-4 grid grid-cols-2 gap-3">
        {list.length ? list.map((p) => <ProductCard key={p.pid} p={p} b={p.biz} />) : <EmptyState msg="No products found" grid />}
      </div>
    </div>
  )
}
