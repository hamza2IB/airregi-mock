import { useState } from 'react'
import Icon from '../components/Icon'
import StoreLogo from '../components/StoreLogo'
import SubHeader from '../components/SubHeader'
import { EmptyState } from '../components/ProductCard'
import { BUSINESSES, fFollowers } from '../data/catalog'
import { useApp } from '../store'

export default function Stores() {
  const { openStore } = useApp()
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')

  const industries = ['All', ...new Set(BUSINESSES.map((b) => b.industry))]
  const query = q.toLowerCase()
  const list = BUSINESSES.filter(
    (b) => (filter === 'All' || b.industry === filter) && (b.name.toLowerCase().includes(query) || b.industry.toLowerCase().includes(query)),
  )

  return (
    <div className="screen">
      <SubHeader title="All Stores" sub={`${list.length} of ${BUSINESSES.length} businesses`}>
        <div className="flex items-center gap-2 bg-page rounded-xl px-3 py-2.5 border border-border mt-3">
          <Icon name="search-outline" className="text-gray-400 shrink-0" style={{ fontSize: '16px' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stores…" className="bg-transparent text-[13px] text-navy-dark placeholder-gray-400 flex-1 border-none" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-sb mt-3 pb-0.5">
          {industries.map((ind) => (
            <button key={ind} onClick={() => setFilter(ind)} className={`press shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${filter === ind ? 'bg-navy text-white' : 'bg-page border border-border text-gray-500'}`}>{ind}</button>
          ))}
        </div>
      </SubHeader>

      <div className="p-4 grid grid-cols-2 gap-3">
        {list.length ? list.map((b) => (
          <button key={b.id} onClick={() => openStore(b.id)} className="press text-left bg-white rounded-2xl border border-border overflow-hidden card-hover">
            <div className="h-16 relative" style={{ background: `linear-gradient(135deg,${b.color},${b.color}aa)` }}>
              <span className="absolute top-2 right-2 bg-white/90 text-navy-dark text-[9.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Icon name="navigate-outline" style={{ fontSize: '10px' }} />{b.distanceKm} km
              </span>
              <div className="absolute -bottom-5 left-3"><StoreLogo b={b} size={44} /></div>
            </div>
            <div className="pt-6 px-3 pb-3">
              <p className="text-[13px] font-bold text-navy-dark truncate">{b.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{b.tagline}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[10.5px] font-semibold text-navy-dark flex items-center gap-0.5"><Icon name="star" className="text-brand-orange" style={{ fontSize: '11px' }} />{b.rating}</span>
                <span className="text-[10px] text-gray-400 truncate">{fFollowers(b.followers)} followers</span>
              </div>
              <span className="inline-block mt-2 text-[9px] font-semibold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full truncate max-w-full">{b.industry}</span>
            </div>
          </button>
        )) : <EmptyState msg="No stores match your search" grid />}
      </div>
    </div>
  )
}
