import Icon from '../components/Icon'
import ImgCell from '../components/ImgCell'
import StoreLogo from '../components/StoreLogo'
import { PID, money, unitPrice, imgUrl } from '../data/catalog'
import { useApp, DELIVERY_FEE, FREE_DELIVERY_OVER } from '../store'

export default function Cart() {
  const { cart, cartCount, cartSubtotal, cartStep, removeCartItem, openStore, openProduct, go } = useApp()

  const Body = () => {
    if (!cart.length) {
      return (
        <div className="flex flex-col items-center justify-center text-center px-8" style={{ height: '55vh' }}>
          <div className="w-20 h-20 rounded-3xl bg-brand-blue/10 flex items-center justify-center mb-4">
            <Icon name="cart-outline" className="text-brand-blue" style={{ fontSize: '38px' }} />
          </div>
          <p className="text-[15px] font-bold text-navy-dark">Your cart is empty</p>
          <p className="text-[12.5px] text-gray-400 mt-1 leading-relaxed">Add products from any store and they'll show up here, grouped by seller.</p>
          <button onClick={() => go('stores')} className="mt-5 bg-navy text-white text-[13px] font-semibold px-6 py-3 rounded-xl press">Start shopping</button>
        </div>
      )
    }
    const groups = {}
    cart.forEach((i) => { const { p, b } = PID[i.pid]; (groups[b.id] = groups[b.id] || { b, items: [] }).items.push({ p, qty: i.qty }) })
    const subtotal = cartSubtotal
    const delivery = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE
    const total = subtotal + delivery

    return (
      <>
        {Object.values(groups).map((g) => (
          <div key={g.b.id} className="bg-white rounded-2xl border border-border overflow-hidden mb-3">
            <button onClick={() => openStore(g.b.id)} className="press w-full flex items-center gap-2.5 px-4 py-3 border-b border-border">
              <StoreLogo b={g.b} size={30} />
              <span className="text-[13px] font-bold text-navy-dark flex-1 text-left truncate">{g.b.name}</span>
              <Icon name="chevron-forward" className="text-gray-300" style={{ fontSize: '15px' }} />
            </button>
            {g.items.map(({ p, qty }) => (
              <div key={p.pid} className="flex items-center gap-3 px-4 py-3">
                <div onClick={() => openProduct(p.pid)} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 press cursor-pointer"><ImgCell src={imgUrl(p)} cat={p.cat} color={g.b.color} width="100%" height={64} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-semibold text-brand-blue uppercase tracking-wide truncate">{p.sub}</p>
                  <p className="text-[12.5px] font-bold text-navy-dark leading-tight truncate">{p.name}</p>
                  <p className="text-[13px] font-extrabold text-navy-dark tnum mt-0.5">{money(unitPrice(p))}{p.unit !== 'each' && <span className="text-[9px] font-medium text-gray-400"> / {p.unit}</span>}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button onClick={() => removeCartItem(p.pid)} className="text-gray-300 hover:text-brand-red press"><Icon name="trash-outline" style={{ fontSize: '15px' }} /></button>
                  <div className="flex items-center bg-page border border-border rounded-lg">
                    <button onClick={() => cartStep(p.pid, -1)} className="w-7 h-7 flex items-center justify-center text-navy press"><Icon name="remove-outline" style={{ fontSize: '15px' }} /></button>
                    <span className="w-6 text-center text-[12px] font-extrabold text-navy-dark tnum">{qty}</span>
                    <button onClick={() => cartStep(p.pid, 1)} className="w-7 h-7 flex items-center justify-center text-navy press"><Icon name="add-outline" style={{ fontSize: '15px' }} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-border p-4 mt-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Order summary</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12.5px] text-gray-500">Subtotal ({cartCount} items)</span>
            <span className="text-[12.5px] font-semibold text-navy-dark tnum">{money(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12.5px] text-gray-500">Delivery</span>
            <span className={`text-[12.5px] font-semibold tnum ${delivery === 0 ? 'text-brand-green' : 'text-navy-dark'}`}>{delivery === 0 ? 'FREE' : money(delivery)}</span>
          </div>
          {delivery > 0 && <p className="text-[10.5px] text-gray-400 mb-2">Add {money(FREE_DELIVERY_OVER - subtotal)} more for free delivery</p>}
          <div className="flex items-center justify-between pt-2.5 border-t border-border">
            <span className="text-[14px] font-bold text-navy-dark">Total</span>
            <span className="text-[17px] font-extrabold text-navy-dark tnum">{money(total)}</span>
          </div>
        </div>
        <button onClick={() => go('checkout')} className="w-full mt-3 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 press">
          <Icon name="lock-closed" style={{ fontSize: '16px' }} />Checkout · {money(total)}
        </button>
      </>
    )
  }

  return (
    <div className="screen">
      <div className="px-5 pt-12 pb-3">
        <h1 className="text-[20px] font-extrabold text-navy-dark">Cart</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Items you're ready to buy, grouped by store</p>
      </div>
      <div className="px-4"><Body /></div>
    </div>
  )
}
