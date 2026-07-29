import { useState } from 'react'
import { useStore } from './store.jsx'

const rs = (n) => `Rs.${(n || 0).toLocaleString()}`

export default function OrdersScreen() {
  const { salesHistory, setScreen, setModal } = useStore()
  const [open, setOpen] = useState(null)
  const now = new Date()
  const totalAmount = salesHistory.reduce((s, tx) => s + tx.total, 0)
  const totalRefunds = salesHistory.reduce((s, tx) => s + (tx.refundAmount || 0), 0)

  const methodIcon = { cash: 'cash-outline', card: 'card-outline', qr: 'qr-code-outline' }
  const methodColor = { cash: 'text-brand-green bg-green-50', card: 'text-brand-blue bg-blue-50', qr: 'text-brand-purple bg-purple-50' }
  const methodLabel = { cash: 'Cash', card: 'Card', qr: 'QR Pay' }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-navy text-white px-5 py-3.5 flex items-center justify-between shrink-0">
        <button onClick={() => setScreen('main')} className="tap-btn px-4 py-2.5 bg-white/10 rounded-lg text-[15px] hover:bg-white/20 flex items-center gap-2 min-h-[48px]">
          <ion-icon name="arrow-back-outline" style={{ fontSize: '22px' }}></ion-icon> Back
        </button>
        <span className="text-[14px] text-white/60">{now.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      <div className="flex-1 overflow-y-auto bg-page">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[22px] font-bold text-black">Orders</h2>
              <p className="text-[14px] text-gray-500 mt-0.5">Today's transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">{salesHistory.length} order{salesHistory.length !== 1 ? 's' : ''}</span>
              <span className="text-[14px] text-navy bg-navy/10 px-4 py-2 rounded-full font-semibold">{rs(totalAmount - totalRefunds)}</span>
            </div>
          </div>

          {salesHistory.length === 0 ? (
            <div className="text-center py-20">
              <ion-icon name="receipt-outline" class="text-7xl text-gray-300"></ion-icon>
              <p className="text-[16px] text-gray-500 mt-3 font-medium">No orders yet</p>
              <p className="text-[14px] text-gray-400 mt-1">Completed sales appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {salesHistory.map((tx, idx) => {
                const time = tx.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const expanded = open === idx
                return (
                  <div key={tx.id} className={`bg-white rounded-xl border overflow-hidden ${tx.refunded ? 'border-red-200' : tx.partialRefund ? 'border-orange-200' : 'border-gray-200'}`}>
                    <div className="p-4 flex items-center gap-4 cursor-pointer min-h-[64px]" onClick={() => setOpen(expanded ? null : idx)}>
                      <div className={`w-11 h-11 rounded-xl ${methodColor[tx.method] || 'text-gray-500 bg-gray-50'} flex items-center justify-center shrink-0`}>
                        <ion-icon name={methodIcon[tx.method] || 'receipt-outline'} class="text-xl"></ion-icon>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[14px] font-semibold text-black font-mono">{tx.id}</p>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{methodLabel[tx.method] || tx.method}</span>
                          {tx.coupon && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-brand-purple font-semibold">{tx.coupon.code}</span>}
                          {tx.loyalty && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">{tx.loyalty.pointsUsed} pts</span>}
                          {tx.refunded ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-brand-red font-bold">REFUNDED</span>
                            : tx.partialRefund ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-brand-orange font-bold">PARTIAL</span> : null}
                        </div>
                        <p className="text-[12px] text-gray-500 mt-0.5">{tx.items} item{tx.items !== 1 ? 's' : ''} · {tx.customer || 'Guest'} · {time}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-[15px] font-bold ${tx.refunded ? 'text-gray-400 line-through' : 'text-navy'}`}>{rs(tx.total)}</p>
                        {tx.refundAmount ? <p className="text-[11px] text-brand-red font-medium">-{rs(tx.refundAmount)}</p> : null}
                      </div>
                      <ion-icon name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} class="text-gray-400 text-lg shrink-0"></ion-icon>
                    </div>
                    {expanded && (
                      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                        <div className="divide-y divide-gray-100">
                          {(tx.products || []).map((p, i) => {
                            const ep = p.effectivePrice || p.price
                            return (
                              <div key={i} className="flex items-center gap-3 py-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0 overflow-hidden"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                                <span className="flex-1 text-[13px] text-gray-700 truncate">{p.name}</span>
                                <span className="text-[12px] text-gray-500">×{p.qty}</span>
                                <span className="text-[13px] font-medium text-black w-16 text-right">{rs(ep * p.qty)}</span>
                              </div>
                            )
                          })}
                        </div>
                        {tx.returnedItems && tx.returnedItems.length > 0 && (
                          <div className="border-t border-red-200 mt-2 pt-2">
                            <p className="text-[11px] text-brand-red font-semibold mb-1">Returned</p>
                            {tx.returnedItems.map((r, i) => (
                              <div key={i} className="flex justify-between text-[12px] py-1">
                                <span className="text-brand-red">{r.name} ×{r.qty}</span>
                                <span className="text-brand-red font-medium">-{rs(r.refundedAmount || r.price * r.qty)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-end gap-3">
                          {tx.refunded ? <span className="text-[12px] text-brand-red font-medium">Fully Refunded</span>
                            : tx.partialRefund ? <span className="text-[12px] text-brand-orange font-medium">Partial: -{rs(tx.refundAmount || 0)}</span>
                              : <button onClick={() => setModal({ type: 'refund', data: { idx } })} className="tap-btn px-5 py-2.5 text-[13px] font-medium text-brand-red border border-red-200 rounded-lg hover:bg-red-50 min-h-[40px]">Return</button>}
                          <button onClick={() => setModal({ type: 'receipt', data: { tx, method: tx.method, mode: 'reprint' } })} className="tap-btn px-5 py-2.5 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 min-h-[40px]">Print</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
