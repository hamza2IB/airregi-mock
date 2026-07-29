import { useState } from 'react'
import Icon from '../components/Icon'
import StoreLogo from '../components/StoreLogo'
import ProductCard, { EmptyState } from '../components/ProductCard'
import { BUSINESSES, iconFor } from '../data/catalog'
import { useApp } from '../store'

export default function StoreDetail() {
  const { route, back, showToast } = useApp()
  const b = BUSINESSES.find((x) => x.id === route.storeId)
  const [cat, setCat] = useState('All')
  const [sub, setSub] = useState('All')
  if (!b) return null

  const topCats = ['All', ...b.cats.map((c) => c.name)]
  const activeCat = b.cats.find((c) => c.name === cat)
  const subs = activeCat ? ['All', ...activeCat.subs] : []
  const prods = b.products.filter((p) => cat === 'All' || p.cat === cat).filter((p) => sub === 'All' || p.sub === sub)
  const countIn = (c, s) => b.products.filter((p) => (!c || c === 'All' || p.cat === c) && (!s || s === 'All' || p.sub === s)).length
  const label = cat === 'All' ? 'All products' : sub === 'All' ? cat : `${cat} › ${sub}`
  const pickCat = (c) => { setCat(c); setSub('All') }

  return (
    <div className="screen" id="store-detail-screen">
      {/* Cover */}
      <div className="relative">
        <div className="h-36" style={{ background: `linear-gradient(135deg,${b.color},${b.color}99)` }}></div>
        <button onClick={back} className="absolute top-11 left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center press">
          <Icon name="chevron-back-outline" className="text-navy" style={{ fontSize: '18px' }} />
        </button>
        <button onClick={() => showToast('Shared ' + b.name)} className="absolute top-11 right-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center press">
          <Icon name="share-social-outline" className="text-navy" style={{ fontSize: '16px' }} />
        </button>
      </div>

      {/* Store header card */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <StoreLogo b={b} size={58} />
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-extrabold text-navy-dark leading-tight truncate">{b.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{b.tagline}</p>
              <span className="inline-block mt-1 text-[9px] font-semibold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">{b.industry}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 mt-4 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-[13px] font-extrabold text-navy-dark flex items-center justify-center gap-0.5"><Icon name="star" className="text-brand-orange" style={{ fontSize: '12px' }} />{b.rating}</p>
              <p className="text-[9px] text-gray-400 uppercase font-semibold mt-0.5">Rating</p>
            </div>
            <div className="text-center border-l border-border">
              <p className="text-[13px] font-extrabold text-navy-dark tnum">{b.products.length}</p>
              <p className="text-[9px] text-gray-400 uppercase font-semibold mt-0.5">Products</p>
            </div>
            <div className="text-center border-l border-border">
              <p className="text-[13px] font-extrabold text-navy-dark tnum">{b.cats.length}</p>
              <p className="text-[9px] text-gray-400 uppercase font-semibold mt-0.5">Categories</p>
            </div>
            <div className="text-center border-l border-border">
              <p className="text-[13px] font-extrabold text-navy-dark flex items-center justify-center gap-0.5"><Icon name="location-outline" className="text-brand-blue" style={{ fontSize: '12px' }} />{b.distanceKm}</p>
              <p className="text-[9px] text-gray-400 uppercase font-semibold mt-0.5">km away</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category browser */}
      <div className="mt-5 sticky top-0 z-20 bg-page/95 backdrop-blur pt-1 pb-2">
        <p className="px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Shop by category</p>
        <div className="flex gap-2 overflow-x-auto no-sb px-5 pb-0.5">
          {topCats.map((c) => (
            <button key={c} onClick={() => pickCat(c)} className={`press shrink-0 px-3.5 py-2 rounded-xl text-[11.5px] font-semibold whitespace-nowrap flex items-center gap-1.5 ${cat === c ? 'bg-navy text-white' : 'bg-white border border-border text-gray-600'}`}>
              <Icon name={c === 'All' ? 'apps-outline' : iconFor(c)} style={{ fontSize: '14px' }} />{c}
            </button>
          ))}
        </div>
        {activeCat && (
          <div className="flex gap-2 overflow-x-auto no-sb px-5 mt-2.5 pb-0.5">
            {subs.map((s) => (
              <button key={s} onClick={() => setSub(s)} className={`press shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${sub === s ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/30' : 'bg-page border border-border text-gray-500'}`}>
                {s === 'All' ? 'All ' + cat : s} <span className="opacity-60 tnum">{countIn(cat, s)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products */}
      <div className="mt-3 px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-bold text-navy-dark truncate">{label}</h3>
          <span className="text-[11px] text-gray-400 tnum shrink-0 ml-2">{prods.length} item{prods.length === 1 ? '' : 's'}</span>
        </div>
        {prods.length ? (
          <div className="grid grid-cols-2 gap-3">{prods.map((p) => <ProductCard key={p.pid} p={p} b={b} />)}</div>
        ) : <EmptyState msg="No products in this category yet" grid />}
      </div>
      <div className="h-6"></div>
    </div>
  )
}
