import { useState } from 'react'
import Icon from './Icon'
import ImgCell from './ImgCell'
import { DISCOUNTS, money, unitPrice, productImages } from '../data/catalog'
import { useApp } from '../store'

function CardSlider({ p, b, height }) {
  const imgs = productImages(p, 3, 320)
  const [idx, setIdx] = useState(0)
  const onScroll = (e) => {
    const el = e.currentTarget
    setIdx(Math.round(el.scrollLeft / el.clientWidth))
  }
  return (
    <div className="relative" style={{ height }}>
      <div className="flex overflow-x-auto snap-x snap-mandatory no-sb h-full" onScroll={onScroll}>
        {imgs.map((u, i) => (
          <div key={i} className="shrink-0 snap-center h-full" style={{ width: '100%' }}>
            <ImgCell src={u} cat={p.cat} color={b.color} width="100%" height={height} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1" style={{ pointerEvents: 'none' }}>
        {imgs.map((_, i) => (
          <span key={i} className="rounded-full bg-white" style={{ height: '5px', width: i === idx ? '13px' : '5px', opacity: i === idx ? 1 : 0.5, boxShadow: '0 1px 2px rgba(0,0,0,.35)', transition: 'all .15s' }} />
        ))}
      </div>
    </div>
  )
}

export function EmptyState({ msg, grid }) {
  return (
    <div className={`${grid ? 'col-span-2 ' : ''}flex flex-col items-center justify-center py-16 text-center`}>
      <div className="w-16 h-16 rounded-2xl bg-page flex items-center justify-center mb-3">
        <Icon name="search-outline" className="text-gray-300" style={{ fontSize: '30px' }} />
      </div>
      <p className="text-[13px] font-semibold text-gray-400">{msg}</p>
    </div>
  )
}

export default function ProductCard({ p, b }) {
  const { openProduct, addToCart, toggleWishlist, isWished } = useApp()
  const wished = isWished(p.pid)
  const price = unitPrice(p)
  const disc = DISCOUNTS[p.name]
  const unit = p.unit && p.unit !== 'each'
  return (
    <div onClick={() => openProduct(p.pid)} className="press bg-white rounded-2xl border border-border overflow-hidden card-hover flex flex-col cursor-pointer">
      <div className="relative">
        <CardSlider p={p} b={b} height={128} />
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.pid) }}
          className="absolute z-20 top-2 right-2 w-7 h-7 rounded-full bg-white/95 shadow-sm flex items-center justify-center press"
        >
          <Icon name={wished ? 'heart' : 'heart-outline'} className="text-brand-red" style={{ fontSize: '14px' }} />
        </button>
        <span className="absolute z-20 top-2 left-2 bg-white/95 shadow-sm text-navy-dark text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
          <Icon name="star" className="text-brand-orange" style={{ fontSize: '9px' }} />{b.rating}
        </span>
        {disc && <span className="absolute z-20 top-8 left-2 bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">-{disc}%</span>}
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <p className="text-[9px] font-semibold text-brand-blue uppercase tracking-wide truncate">{p.sub || p.cat}</p>
        <p className="text-[12px] font-bold text-navy-dark leading-tight mt-0.5" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '30px' }}>{p.name}</p>
        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="min-w-0">
            <p className="text-[13.5px] font-extrabold text-navy-dark tnum leading-none">{money(price)}{unit && <span className="text-[9px] font-medium text-gray-400"> / {p.unit}</span>}</p>
            {disc && <p className="text-[10px] text-gray-400 line-through tnum mt-0.5">{money(p.price)}</p>}
          </div>
          <button onClick={(e) => { e.stopPropagation(); addToCart(p.pid, 1) }} className="w-8 h-8 rounded-xl bg-navy flex items-center justify-center press shrink-0">
            <Icon name="add-outline" className="text-white" style={{ fontSize: '17px' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
