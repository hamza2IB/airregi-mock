import { useState } from 'react'
import Icon from '../components/Icon'
import ImgCell from '../components/ImgCell'
import StoreLogo from '../components/StoreLogo'
import { useToast } from '../components/Toast'
import { useApp } from '../store'
import {
  BUSINESSES, allProducts, platformCategories, getDeals,
  money, fFollowers, iconFor, imgUrl,
} from '../data/catalog'
import { STATUS_STYLE, TRACK_STEPS, TRACK_LABEL } from '../data/ordersData'

const CAT_COLORS = ['#3366cc', '#2dd36f', '#ff9800', '#eb445a', '#7c4dff', '#1a2d6b']

// Derive a short area label from an address line, e.g.
// "House 176-Y, Block L, Gulberg III" → "Gulberg III".
export function areaOf(addr) {
  if (!addr) return 'your area'
  const parts = addr.line.split(',').map((s) => s.trim()).filter(Boolean)
  return parts[parts.length - 1] || addr.city
}

/* ── Active order tracker strip ── */
function Tracker({ orders, onNavigate }) {
  const order = orders.find((o) => !['Delivered', 'Cancelled'].includes(o.status))
  if (!order) return null
  const cur = TRACK_STEPS.findIndex((s) => s.key === order.status)
  return (
    <div className="px-5 mt-5">
      <button onClick={() => onNavigate('orders')} className="press w-full text-left bg-white rounded-2xl border border-border p-4 card-hover">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${order.color}18` }}>
            <Icon name="bag-handle-outline" style={{ fontSize: '18px', color: order.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-navy-dark leading-tight truncate">{order.biz} · <span className="tnum text-gray-400 font-semibold">{order.id}</span></p>
            <p className="text-[10.5px] font-semibold text-brand-blue leading-tight mt-0.5 flex items-center gap-1">
              <Icon name="cube-outline" style={{ fontSize: '12px' }} />{TRACK_LABEL[order.status] || 'In progress'}
            </p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[order.status]}`}>{order.status}</span>
        </div>
        <div className="flex items-center">
          {TRACK_STEPS.map((s, i) => {
            const done = i <= cur
            const notLast = i < TRACK_STEPS.length - 1
            return (
              <div key={s.key} className={`flex items-center ${notLast ? 'flex-1' : ''}`}>
                <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: '34px' }}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${done ? 'bg-brand-green text-white' : 'bg-page text-gray-300 border border-border'}`}>
                    <Icon name={s.icon} style={{ fontSize: '14px' }} />
                  </div>
                  <span className={`text-[8px] font-semibold ${done ? 'text-navy-dark' : 'text-gray-300'}`}>{s.key}</span>
                </div>
                {notLast && <div className={`flex-1 h-0.5 ${i < cur ? 'bg-brand-green' : 'bg-border'}`}></div>}
              </div>
            )
          })}
        </div>
      </button>
    </div>
  )
}

export default function Home({ onNavigate, onOpenStore, onOpenProduct, onOpenCategory, wishlistCount = 0, orders = [] }) {
  const showToast = useToast()
  const { addresses, setDefaultAddress, openSettings } = useApp()
  const [locOpen, setLocOpen] = useState(false)
  const defAddr = addresses.find((a) => a.def) || addresses[0]
  const area = areaOf(defAddr)
  const pickAddress = (a) => { setDefaultAddress(a.id); setLocOpen(false); showToast(`Delivering to ${a.label} · ${areaOf(a)}`) }
  const products = allProducts()
  const cats = platformCategories()
  const deals = getDeals()
  const near = BUSINESSES.filter((b) => b.distanceKm <= 5).sort((a, b) => a.distanceKm - b.distanceKm)
  const popular = [...BUSINESSES].sort((a, b) => b.followers - a.followers).slice(0, 5)

  const stat = (icon, iconBg, iconColor, value, label, onClick, borderLeft) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 press ${borderLeft ? 'border-l border-border' : ''}`}>
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-0.5`}>
        <Icon name={icon} className={iconColor} style={{ fontSize: '17px' }} />
      </div>
      <p className="text-[16px] font-extrabold text-navy-dark leading-none tnum">{value}</p>
      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
    </button>
  )

  return (
    <div className="screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-dark to-navy px-5 pt-12 pb-6 rounded-b-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-extrabold text-[14px] shrink-0">AK</div>
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-[11px] font-medium leading-tight">Good afternoon</p>
              <p className="text-white font-extrabold text-[15px] leading-tight truncate">Ayesha Khan</p>
            </div>
            <button className="relative w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center press" onClick={() => showToast('No new notifications')}>
              <Icon name="notifications-outline" className="text-white" style={{ fontSize: '19px' }} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-brand-orange"></span>
            </button>
          </div>

          <button onClick={() => setLocOpen(true)} className="flex items-center gap-1.5 press mb-4">
            <Icon name="location" className="text-brand-green shrink-0" style={{ fontSize: '15px' }} />
            <span className="text-[12px] text-white/70"><span className="text-white/40">Deliver to</span> <span className="font-semibold text-white">{defAddr ? `${area}, ${defAddr.city}` : 'Add an address'}</span></span>
            <Icon name="chevron-down" className="text-white/40 shrink-0" style={{ fontSize: '13px' }} />
          </button>

          <button onClick={() => onNavigate('products')} className="w-full flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 press">
            <Icon name="search-outline" className="text-gray-400 shrink-0" style={{ fontSize: '18px' }} />
            <span className="text-[13px] text-gray-400 font-medium">Search stores, products…</span>
          </button>
        </div>
      </div>

      {/* Stats panel */}
      <div className="px-5 -mt-4 relative z-20">
        <div className="bg-white rounded-2xl border border-border shadow-sm px-2 py-3.5 grid grid-cols-4">
          {stat('bag-handle-outline', 'bg-brand-blue/10', 'text-brand-blue', '12', 'Orders', () => onNavigate('orders'))}
          {stat('wallet-outline', 'bg-brand-green/10', 'text-brand-green', '84k', 'Spent', () => onNavigate('orders'), true)}
          {stat('heart-outline', 'bg-brand-red/10', 'text-brand-red', wishlistCount, 'Wishlist', () => onOpenCategory ? onOpenCategory('__wishlist__') : onNavigate('settings'), true)}
          {stat('star-outline', 'bg-brand-orange/10', 'text-brand-orange', '1,240', 'Points', () => showToast('Rewards — coming soon'), true)}
        </div>
      </div>

      {/* Active order tracker */}
      <Tracker orders={orders} onNavigate={onNavigate} />

      {/* Browse options */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate('stores')} className="press bg-white rounded-2xl border border-border p-3.5 flex flex-col items-center gap-2 card-hover">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center"><Icon name="storefront-outline" className="text-brand-blue" style={{ fontSize: '24px' }} /></div>
            <div className="text-center">
              <p className="text-[12px] font-bold text-navy-dark leading-tight">All Stores</p>
              <p className="text-[9.5px] text-gray-400 mt-0.5 tnum">{BUSINESSES.length} shops</p>
            </div>
          </button>
          <button onClick={() => onNavigate('products')} className="press bg-white rounded-2xl border border-border p-3.5 flex flex-col items-center gap-2 card-hover">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center"><Icon name="cube-outline" className="text-brand-purple" style={{ fontSize: '24px' }} /></div>
            <div className="text-center">
              <p className="text-[12px] font-bold text-navy-dark leading-tight">All Products</p>
              <p className="text-[9.5px] text-gray-400 mt-0.5 tnum">{products.length} items</p>
            </div>
          </button>
          <button onClick={() => onNavigate('categories')} className="press bg-white rounded-2xl border border-border p-3.5 flex flex-col items-center gap-2 card-hover">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center"><Icon name="grid-outline" className="text-brand-green" style={{ fontSize: '24px' }} /></div>
            <div className="text-center">
              <p className="text-[12px] font-bold text-navy-dark leading-tight">Categories</p>
              <p className="text-[9.5px] text-gray-400 mt-0.5 tnum">{cats.length} types</p>
            </div>
          </button>
        </div>
      </div>

      {/* Shop by category */}
      <div className="mt-7">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Shop by category</h2>
          <button onClick={() => onNavigate('categories')} className="text-[12px] text-brand-blue font-semibold press">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-sb px-5 pb-1">
          {cats.slice(0, 8).map((c, i) => {
            const col = CAT_COLORS[i % CAT_COLORS.length]
            return (
              <button key={c.name} onClick={() => (onOpenCategory ? onOpenCategory(c.name) : onNavigate('products'))} className="press shrink-0 flex flex-col items-center gap-1.5" style={{ width: '60px' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${col}18` }}>
                  <Icon name={iconFor(c.name)} style={{ fontSize: '24px', color: col }} />
                </div>
                <span className="text-[9.5px] font-semibold text-gray-600 text-center leading-tight" style={{ minHeight: '24px' }}>{c.name.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Deals for you */}
      <div className="mt-7">
        <div className="flex items-center justify-between px-5 mb-3">
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight flex items-center gap-2">
              Deals for you
              <span className="text-[9px] font-bold bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-full uppercase tracking-wide">Sale</span>
            </h2>
            <p className="text-[10.5px] text-gray-400 mt-0.5">Limited-time discounts across stores</p>
          </div>
          <button onClick={() => onNavigate('products')} className="text-[12px] text-brand-blue font-semibold press">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-sb px-5 pb-1">
          {deals.map((p) => (
            <div key={p.pid} onClick={() => (onOpenProduct ? onOpenProduct(p.pid) : onNavigate('products'))} className="press shrink-0 w-[150px] bg-white rounded-2xl border border-border overflow-hidden card-hover cursor-pointer">
              <div className="relative">
                <ImgCell src={imgUrl(p)} cat={p.cat} color={p.biz.color} height={96} />
                <span className="absolute z-20 top-2 left-2 bg-brand-red text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">-{p.disc}%</span>
              </div>
              <div className="p-2.5">
                <p className="text-[9.5px] font-semibold text-gray-400 truncate">{p.biz.name}</p>
                <p className="text-[12px] font-bold text-navy-dark leading-tight mt-0.5" style={{ minHeight: '30px' }}>{p.name}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[13px] font-extrabold text-brand-red tnum">{money(p.price)}</span>
                  <span className="text-[10px] text-gray-400 line-through tnum">{money(p.oldPrice)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stores near you */}
      <div className="mt-7">
        <div className="flex items-center justify-between px-5 mb-3">
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Stores near you</h2>
            <p className="text-[10.5px] text-gray-400 flex items-center gap-1 mt-0.5">
              <Icon name="navigate-circle-outline" className="text-brand-green" style={{ fontSize: '13px' }} />Within 5 km of {area}
            </p>
          </div>
          <button onClick={() => onNavigate('stores')} className="text-[12px] text-brand-blue font-semibold press">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-sb px-5 pb-1">
          {near.map((b) => (
            <button key={b.id} onClick={() => (onOpenStore ? onOpenStore(b.id) : onNavigate('stores'))} className="press text-left shrink-0 w-[164px] bg-white rounded-2xl border border-border overflow-hidden card-hover">
              <div className="h-20 relative" style={{ background: `linear-gradient(135deg,${b.color},${b.color}bb)` }}>
                <span className="absolute top-2 left-2 bg-white/90 text-navy-dark text-[9.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Icon name="navigate-outline" style={{ fontSize: '10px' }} />{b.distanceKm} km
                </span>
                <div className="absolute -bottom-4 left-3"><StoreLogo b={b} size={40} /></div>
              </div>
              <div className="pt-5 px-3 pb-3">
                <p className="text-[12.5px] font-bold text-navy-dark truncate">{b.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{b.industry}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Icon name="star" className="text-brand-orange" style={{ fontSize: '11px' }} />
                  <span className="text-[10.5px] font-semibold text-navy-dark tnum">{b.rating}</span>
                  <span className="text-[10px] text-gray-400">· {fFollowers(b.followers)} followers</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular shops */}
      <div className="mt-7">
        <div className="flex items-center justify-between px-5 mb-3">
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Popular shops</h2>
            <p className="text-[10.5px] text-gray-400 mt-0.5">Most followed on RetailOS</p>
          </div>
          <button onClick={() => onNavigate('stores')} className="text-[12px] text-brand-blue font-semibold press">See all</button>
        </div>
        <div className="px-5 space-y-2.5">
          {popular.map((b, i) => (
            <button key={b.id} onClick={() => (onOpenStore ? onOpenStore(b.id) : onNavigate('stores'))} className="press w-full flex items-center gap-3 bg-white rounded-2xl border border-border p-3 card-hover text-left">
              <StoreLogo b={b} size={46} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-bold text-navy-dark truncate">{b.name}</p>
                  {i === 0 && <span className="text-[8.5px] font-bold bg-brand-orange/15 text-brand-orange px-1.5 py-0.5 rounded-full">#1</span>}
                </div>
                <p className="text-[10.5px] text-gray-400 truncate">{b.tagline}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-navy-dark flex items-center gap-0.5"><Icon name="star" className="text-brand-orange" style={{ fontSize: '11px' }} />{b.rating}</span>
                  <span className="text-[10px] text-gray-400">{fFollowers(b.followers)} followers</span>
                  <span className="text-[10px] text-gray-400">· {b.products.length} products</span>
                </div>
              </div>
              <Icon name="chevron-forward" className="text-gray-300 shrink-0" style={{ fontSize: '16px' }} />
            </button>
          ))}
        </div>
      </div>

      <div className="h-4"></div>

      {/* ── Delivery location picker ── */}
      <div id="sheet-backdrop" className={locOpen ? 'show' : ''} onClick={() => setLocOpen(false)}></div>
      <div id="sheet" className={locOpen ? 'open' : ''}>
        <div className="sheet-handle"></div>
        <div className="px-5 pt-1 pb-3">
          <p className="text-[16px] font-extrabold text-navy-dark">Deliver to</p>
          <p className="text-[11.5px] text-gray-400">Choose where to shop from</p>
        </div>
        <div className="mx-4 mb-3 bg-white border border-border rounded-2xl overflow-hidden">
          {addresses.map((a, i) => (
            <button key={a.id} onClick={() => pickAddress(a)} className={`press w-full flex items-center gap-3 px-4 py-3.5 text-left ${i ? 'border-t border-border' : ''}`}>
              <div className="w-9 h-9 rounded-lg bg-page flex items-center justify-center shrink-0"><Icon name={a.label === 'Office' ? 'business-outline' : 'home-outline'} className="text-navy" style={{ fontSize: '18px' }} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="text-[13px] font-bold text-navy-dark">{a.label}</p>{a.def && <span className="text-[9px] font-bold bg-navy text-white px-2 py-0.5 rounded-full">Current</span>}</div>
                <p className="text-[11.5px] text-gray-500 truncate">{a.line}, {a.city}</p>
              </div>
              {a.def ? <Icon name="checkmark-circle" className="text-navy shrink-0" style={{ fontSize: '20px' }} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"></div>}
            </button>
          ))}
        </div>
        <div className="px-4 pb-5 flex gap-2.5">
          <button onClick={() => setLocOpen(false)} className="press flex-1 h-11 rounded-xl border border-border text-gray-500 text-[13px] font-bold">Close</button>
          <button onClick={() => { setLocOpen(false); openSettings('addresses') }} className="press flex-1 h-11 rounded-xl bg-navy text-white text-[13px] font-bold flex items-center justify-center gap-1.5"><Icon name="add-outline" style={{ fontSize: '16px' }} />Manage addresses</button>
        </div>
      </div>
    </div>
  )
}
