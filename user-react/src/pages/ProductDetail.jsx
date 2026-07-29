import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import ImgCell from '../components/ImgCell'
import StoreLogo from '../components/StoreLogo'
import ProductCard from '../components/ProductCard'
import { DISCOUNTS, PID, money, unitPrice, imgUrl, productImages } from '../data/catalog'
import { productMeta, uomLabel, stockOf, optSurcharge } from '../data/productMeta'
import { useApp } from '../store'

export default function ProductDetail() {
  const { route, back, openStore, openProduct, addToCart, toggleWishlist, isWished, showToast } = useApp()
  const rec = PID[route.productId]
  const sliderRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [variant, setVariant] = useState({})

  const p = rec?.p
  const b = rec?.b
  const meta = p ? productMeta(p) : null
  const imgs = p ? productImages(p, 4) : []

  // reset per product
  useEffect(() => {
    if (!p) return
    const v = {}
    meta.options.forEach((o) => { v[o.name] = o.values[0] })
    setVariant(v)
    setQty(1)
    setIdx(0)
    if (sliderRef.current) sliderRef.current.scrollLeft = 0
  }, [route.productId]) // eslint-disable-line

  // auto-advance gallery
  useEffect(() => {
    if (!p) return
    const t = setInterval(() => {
      const s = sliderRef.current
      if (!s) return
      const i = Math.round(s.scrollLeft / s.clientWidth)
      s.scrollTo({ left: ((i + 1) % imgs.length) * s.clientWidth, behavior: 'smooth' })
    }, 3500)
    return () => clearInterval(t)
  }, [route.productId]) // eslint-disable-line

  if (!p) return null

  const disc = DISCOUNTS[p.name]
  const wished = isWished(p.pid)
  const stock = stockOf(p)
  const low = stock <= 15
  const more = b.products.filter((x) => x.pid !== p.pid).slice(0, 4)
  const price = unitPrice(p) + meta.options.reduce((s, o) => s + optSurcharge(o, variant[o.name]), 0)

  const onScroll = (e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
  const gotoImg = (i) => sliderRef.current?.scrollTo({ left: i * sliderRef.current.clientWidth, behavior: 'smooth' })
  const nav = (d) => sliderRef.current?.scrollBy({ left: d * sliderRef.current.clientWidth, behavior: 'smooth' })

  const details = { 'Sold as': uomLabel(p), ...meta.specs }

  return (
    <div className="screen" style={{ paddingBottom: '96px' }}>
      {/* Image slider */}
      <div className="relative bg-page">
        <div ref={sliderRef} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory no-sb">
          {imgs.map((u, i) => (
            <div key={i} className="shrink-0 snap-center" style={{ width: '100%' }}>
              <ImgCell src={u} cat={p.cat} color={b.color} width="100%" height={340} />
            </div>
          ))}
        </div>

        <button onClick={back} className="absolute top-11 left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center press shadow-sm">
          <Icon name="chevron-back-outline" className="text-navy" style={{ fontSize: '18px' }} />
        </button>
        <div className="absolute top-11 right-4 flex gap-2">
          <button onClick={() => toggleWishlist(p.pid)} className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center press shadow-sm">
            <Icon name={wished ? 'heart' : 'heart-outline'} className="text-brand-red" style={{ fontSize: '17px' }} />
          </button>
          <button onClick={() => showToast('Shared ' + p.name)} className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center press shadow-sm">
            <Icon name="share-social-outline" className="text-navy" style={{ fontSize: '15px' }} />
          </button>
        </div>
        <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full tnum">{idx + 1} / {imgs.length}</div>
        {disc && <span className="absolute bottom-3 left-4 bg-brand-red text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow">-{disc}% OFF</span>}
        <button onClick={() => nav(-1)} className="hidden sm:flex absolute top-1/2 left-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 items-center justify-center press shadow"><Icon name="chevron-back-outline" className="text-navy" style={{ fontSize: '16px' }} /></button>
        <button onClick={() => nav(1)} className="hidden sm:flex absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 items-center justify-center press shadow"><Icon name="chevron-forward-outline" className="text-navy" style={{ fontSize: '16px' }} /></button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {imgs.map((_, i) => (
            <span key={i} className="rounded-full transition-all" style={{ height: '6px', width: i === idx ? '20px' : '6px', background: i === idx ? '#fff' : 'rgba(255,255,255,0.55)', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
          ))}
        </div>
      </div>

      {/* thumbnails */}
      <div className="flex gap-2 overflow-x-auto no-sb px-4 py-3 bg-white border-b border-border">
        {imgs.map((u, i) => (
          <button key={i} onClick={() => gotoImg(i)} className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-page press" style={{ border: `2px solid ${i === idx ? '#1a2d6b' : 'transparent'}` }}>
            <img src={u} alt="" loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </button>
        ))}
      </div>

      {/* info */}
      <div className="px-5 pt-4">
        <button onClick={() => openStore(b.id)} className="press inline-flex items-center gap-2 mb-2">
          <StoreLogo b={b} size={22} />
          <span className="text-[11.5px] font-semibold text-brand-blue">{b.name}</span>
          <Icon name="chevron-forward" className="text-brand-blue" style={{ fontSize: '12px' }} />
        </button>
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-[9.5px] font-semibold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">{p.cat}</span>
          <span className="text-[9.5px] font-semibold text-gray-500 bg-page px-2 py-0.5 rounded-full">{p.sub}</span>
          {meta.type === 'variant' && <span className="text-[9.5px] font-semibold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">Multiple options</span>}
          {meta.type === 'bundle' && <span className="text-[9.5px] font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">Bundle</span>}
        </div>
        <h1 className="text-[19px] font-extrabold text-navy-dark leading-tight">{p.name}</h1>

        <div className="flex items-center gap-2 mt-2">
          {low ? (
            <span className="text-[11px] text-brand-orange font-semibold flex items-center gap-0.5"><Icon name="alert-circle" style={{ fontSize: '12px' }} />Only {stock} left</span>
          ) : (
            <span className="text-[11px] text-brand-green font-semibold flex items-center gap-0.5"><Icon name="checkmark-circle" style={{ fontSize: '12px' }} />In stock</span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-[24px] font-extrabold text-navy-dark tnum">{money(price)}</span>
          {p.unit !== 'each' && <span className="text-[12px] font-medium text-gray-400">/ {p.unit}</span>}
          {disc && <><span className="text-[14px] text-gray-400 line-through tnum">{money(p.price)}</span><span className="text-[11px] font-bold text-brand-red bg-brand-red/10 px-1.5 py-0.5 rounded-md">-{disc}%</span></>}
        </div>

        {/* variants */}
        {meta.options.map((o) => (
          <div key={o.name} className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-bold text-navy-dark">{o.name}</p>
              <span className="text-[11px] text-gray-400">Selected: <span className="font-semibold text-navy-dark">{variant[o.name]}</span></span>
            </div>
            <div className="flex flex-wrap gap-2">
              {o.values.map((v) => (
                <button key={v} onClick={() => setVariant((prev) => ({ ...prev, [o.name]: v }))} className={`press px-3.5 py-1.5 rounded-xl text-[12px] font-semibold border ${variant[o.name] === v ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-border'}`}>{v}</button>
              ))}
            </div>
          </div>
        ))}

        {/* bundle */}
        {meta.type === 'bundle' && meta.bundle.length > 0 && (() => {
          const items = meta.bundle.map((bi) => { const comp = b.products.find((x) => x.name === bi.name); return comp ? { comp, qty: bi.qty } : null }).filter(Boolean)
          const indiv = items.reduce((s, it) => s + unitPrice(it.comp) * it.qty, 0)
          const save = indiv - price
          return (
            <div className="mt-4 bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-page/60">
                <p className="text-[12px] font-bold text-navy-dark">What's inside ({items.length})</p>
                {save > 0 && <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">You save {money(save)}</span>}
              </div>
              {items.map(({ comp, qty: q }) => (
                <div key={comp.pid} onClick={() => openProduct(comp.pid)} className="press cursor-pointer flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0">
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0"><ImgCell src={imgUrl(comp)} cat={comp.cat} color={b.color} width="100%" height={44} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-navy-dark truncate">{comp.name}</p>
                    <p className="text-[10.5px] text-gray-400 tnum">{money(unitPrice(comp))} each</p>
                  </div>
                  <span className="text-[11px] font-bold text-navy-dark bg-page px-2 py-0.5 rounded-md tnum">× {q}</span>
                </div>
              ))}
            </div>
          )
        })()}

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-5 mb-1.5">Description</p>
        <p className="text-[12.5px] text-gray-500 leading-relaxed">{meta.desc || `Authentic ${p.name} available at ${b.name}. Quality-checked and ready for quick delivery within your area. Prices are inclusive of applicable taxes.`}</p>
      </div>

      {/* product details */}
      <div className="px-5 mt-5">
        <p className="text-[13px] font-bold text-navy-dark mb-2">Product Details</p>
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {Object.entries(details).map(([k, v], i) => (
            <div key={k} className={`flex items-start gap-3 px-4 py-2.5 ${i ? 'border-t border-border' : ''}`}>
              <span className="text-[11.5px] text-gray-400 font-medium" style={{ width: '42%', flexShrink: 0 }}>{k}</span>
              <span className="text-[11.5px] font-semibold text-navy-dark flex-1">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* more from store */}
      {more.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between px-5 mb-3">
            <h3 className="text-[14px] font-bold text-navy-dark">More from {b.name}</h3>
            <button onClick={() => openStore(b.id)} className="text-[12px] text-brand-blue font-semibold press">Visit store</button>
          </div>
          <div className="px-5 grid grid-cols-2 gap-3">{more.map((x) => <ProductCard key={x.pid} p={x} b={b} />)}</div>
        </div>
      )}
      <div className="h-4"></div>

      {/* sticky add-to-cart bar */}
      <div className="absolute left-0 right-0 bottom-0 z-50 bg-white border-t border-border px-4 pt-3" style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-page border border-border rounded-xl">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-10 flex items-center justify-center text-navy press"><Icon name="remove-outline" style={{ fontSize: '18px' }} /></button>
            <span className="w-7 text-center text-[14px] font-extrabold text-navy-dark tnum">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="w-9 h-10 flex items-center justify-center text-navy press"><Icon name="add-outline" style={{ fontSize: '18px' }} /></button>
          </div>
          <button onClick={() => addToCart(p.pid, qty)} className="flex-1 h-11 bg-navy text-white rounded-xl text-[13.5px] font-bold flex items-center justify-center gap-2 press">
            <Icon name="cart-outline" style={{ fontSize: '18px' }} />Add to cart · <span className="tnum">{money(price * qty)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
