import Icon from '../components/Icon'
import { money } from '../data/catalog'
import { useApp } from '../store'

export default function OrderSuccess() {
  const { route, orders, go } = useApp()
  const ids = route.orderIds || []
  const list = ids.map((id) => orders.find((o) => o.id === id)).filter(Boolean)
  const many = ids.length > 1
  const primary = ids[0]

  return (
    <div className="screen">
      <div className="px-4 pb-6">
        <div className="flex flex-col items-center text-center px-6" style={{ paddingTop: '15vh' }}>
          <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center mb-5"><Icon name="checkmark-circle" style={{ fontSize: '56px', color: '#2dd36f' }} /></div>
          <h1 className="text-[22px] font-extrabold text-navy-dark">Order placed!</h1>
          <p className="text-[13px] text-gray-500 mt-2 leading-relaxed max-w-[290px]">
            Thanks for your order. {many ? <>We've created <b className="text-navy-dark">{ids.length} orders</b>, one per store.</> : <>Your order <b className="text-navy-dark">{primary}</b> is confirmed.</>} You'll get live updates in the Orders tab.
          </p>
          <div className="bg-white rounded-2xl border border-border w-full mt-6 divide-y divide-border overflow-hidden text-left">
            {list.map((o) => (
              <div key={o.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${o.color}18` }}><Icon name="storefront-outline" style={{ fontSize: '17px', color: o.color }} /></div>
                <div className="flex-1 min-w-0"><p className="text-[12.5px] font-bold text-navy-dark truncate">{o.biz}</p><p className="text-[10.5px] text-gray-400">{o.id} · {o.items} item{o.items > 1 ? 's' : ''}</p></div>
                <span className="text-[12.5px] font-extrabold text-navy-dark tnum shrink-0">{money(o.total)}</span>
              </div>
            ))}
          </div>
          <button onClick={() => go('orders')} className="press w-full mt-6 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2"><Icon name="receipt-outline" style={{ fontSize: '17px' }} />View my orders</button>
          <button onClick={() => go('home')} className="press w-full mt-2.5 h-12 border border-border bg-white text-navy rounded-xl text-[14px] font-bold">Continue shopping</button>
        </div>
      </div>
    </div>
  )
}
