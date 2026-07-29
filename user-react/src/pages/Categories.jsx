import { useState } from 'react'
import Icon from '../components/Icon'
import SubHeader from '../components/SubHeader'
import { EmptyState } from '../components/ProductCard'
import { platformCategories, iconFor } from '../data/catalog'
import { useApp } from '../store'

const COLORS = ['#3366cc', '#2dd36f', '#ff9800', '#eb445a', '#7c4dff', '#1a2d6b']

export default function Categories() {
  const { go } = useApp()
  const [q, setQ] = useState('')
  const cats = platformCategories().filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="screen">
      <SubHeader title="Categories" sub="Shop by category">
        <div className="flex items-center gap-2 bg-page rounded-xl px-3 py-2.5 border border-border mt-3">
          <Icon name="search-outline" className="text-gray-400 shrink-0" style={{ fontSize: '16px' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search categories…" className="bg-transparent text-[13px] text-navy-dark placeholder-gray-400 flex-1 border-none" />
        </div>
      </SubHeader>
      <div className="p-4 grid grid-cols-2 gap-3">
        {cats.length ? cats.map((c, i) => {
          const col = COLORS[i % COLORS.length]
          return (
            <button key={c.name} onClick={() => go('products', { category: c.name })} className="press bg-white rounded-2xl border border-border p-4 flex flex-col gap-3 card-hover text-left">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${col}18` }}>
                <Icon name={iconFor(c.name)} style={{ fontSize: '24px', color: col }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-navy-dark leading-tight">{c.name}</p>
                <p className="text-[10.5px] text-gray-400 mt-1 tnum">{c.products} products · {c.stores} stores</p>
              </div>
            </button>
          )
        }) : <EmptyState msg="No categories found" grid />}
      </div>
    </div>
  )
}
