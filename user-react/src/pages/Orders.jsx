import { useState } from 'react'
import Icon from '../components/Icon'
import ImgCell from '../components/ImgCell'
import { PID, money, unitPrice, imgUrl } from '../data/catalog'
import { STATUS_STYLE } from '../data/ordersData'
import { useApp } from '../store'

export default function Orders() {
  const { orders, openProduct, openOrderTrack, showToast } = useApp()
  const [open, setOpen] = useState(() => (orders[0] ? { [orders[0].id]: true } : {}))
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  return (
    <div className="screen">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-[20px] font-extrabold text-navy-dark">Orders</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Your online &amp; in-store purchases</p>
      </div>
      <div className="px-5 space-y-2.5">
        {orders.map((o) => {
          const isOpen = !!open[o.id]
          const active = !['Delivered', 'Cancelled'].includes(o.status)
          const lines = o.lines.map((l) => (PID[l.pid] ? { ...l, p: PID[l.pid].p, b: PID[l.pid].b } : null)).filter(Boolean)
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <button onClick={() => toggle(o.id)} className="press w-full flex items-center gap-3 p-3.5 text-left">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${o.color}18` }}><Icon name="bag-handle-outline" style={{ fontSize: '20px', color: o.color }} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-navy-dark truncate">{o.biz}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                  </div>
                  <p className="text-[10.5px] text-gray-400 mt-0.5 tnum">{o.id} · {o.items} item{o.items === 1 ? '' : 's'} · {o.date}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[13px] font-extrabold text-navy-dark tnum">{money(o.total)}</p>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-blue">{isOpen ? 'Hide items' : 'View items'}<Icon name={isOpen ? 'chevron-up' : 'chevron-down'} style={{ fontSize: '14px' }} /></span>
                  </div>
                </div>
              </button>
              {isOpen && (
                <div>
                  <div className="bg-page border-t border-border px-3 py-3">
                    <p className="px-1 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em]">Items ({lines.length})</p>
                    <div className="space-y-2">
                      {lines.map((l) => (
                        <div key={l.pid} onClick={() => openProduct(l.pid)} className="press cursor-pointer flex items-center gap-3 bg-white border border-border rounded-xl p-2">
                          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0"><ImgCell src={imgUrl(l.p)} cat={l.p.cat} color={l.b.color} width="100%" height={44} /></div>
                          <div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-navy-dark truncate">{l.p.name}</p><p className="text-[10.5px] text-gray-400">{money(unitPrice(l.p))} × {l.qty}</p></div>
                          <span className="text-[12px] font-bold text-navy-dark tnum shrink-0">{money(unitPrice(l.p) * l.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                    <span className="text-[12px] font-bold text-navy-dark">Order total</span>
                    <span className="text-[14px] font-extrabold text-navy-dark tnum">{money(o.total)}</span>
                  </div>
                  <div className="px-4 pb-3">
                    <button onClick={() => (active ? openOrderTrack(o.id) : showToast('Receipt for ' + o.id))} className="press w-full h-10 bg-navy text-white rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-1.5">
                      <Icon name={active ? 'navigate-outline' : 'receipt-outline'} style={{ fontSize: '15px' }} />{active ? 'Track order' : 'View receipt'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
