import { useState } from 'react'
import Icon from '../components/Icon'
import ImgCell from '../components/ImgCell'
import StoreLogo from '../components/StoreLogo'
import { PID, money, unitPrice, imgUrl } from '../data/catalog'
import { PM_TYPES, BANKS } from '../data/payMeta'
import { useApp, DELIVERY_FEE, FREE_DELIVERY_OVER } from '../store'

const STEPS = ['Address', 'Payment', 'Review']

function Radio({ on }) {
  return <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${on ? 'border-navy' : 'border-gray-300'}`}>{on && <div className="w-2.5 h-2.5 rounded-full bg-navy" />}</div>
}

export default function Checkout() {
  const { cart, cartCount, cartSubtotal, addresses, payments, user, saveAddress, addPayment, placeOrder, back, go, showToast } = useApp()
  const [step, setStep] = useState(1)
  const [view, setView] = useState('main') // 'main' | 'addr' | 'pay'
  const [addrId, setAddrId] = useState((addresses.find((a) => a.def) || addresses[0])?.id || null)
  const [payId, setPayId] = useState('cod')

  // inline add-address form
  const [af, setAf] = useState({ label: 'Home', name: user.name, phone: user.phone, line: '', city: 'Lahore' })
  // inline add-payment form
  const [payType, setPayType] = useState('JazzCash')
  const [pf, setPf] = useState({ mobile: '', acct: '', bank: BANKS[0] })

  const subtotal = cartSubtotal
  const delivery = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  const goBack = () => {
    if (view !== 'main') return setView('main')
    if (step > 1) return setStep(step - 1)
    back()
  }
  const next = () => {
    if (step === 1 && !addrId) return showToast('Please select an address')
    setStep(step + 1)
  }
  const payLabel = () => {
    if (payId === 'cod') return { title: 'Cash on Delivery', detail: 'Pay when it arrives', icon: 'cash-outline', color: '#2dd36f' }
    const m = payments.find((x) => x.id === payId)
    return m ? { title: m.type, detail: m.detail, icon: m.icon, color: m.color } : { title: 'Cash on Delivery', detail: '', icon: 'cash-outline', color: '#2dd36f' }
  }

  const submitAddr = () => {
    if (!af.line.trim()) return showToast('Please enter an address')
    const id = saveAddress({ label: af.label, name: af.name.trim() || user.name, phone: af.phone.trim() || user.phone, line: af.line.trim(), city: af.city.trim() || 'Lahore' }, null)
    setAddrId(id)
    setView('main'); setStep(1); showToast('Address added')
  }
  const submitPay = () => {
    const cfg = PM_TYPES[payType]
    let detail
    if (cfg.field === 'mobile') {
      const m = pf.mobile.replace(/\D/g, '')
      if (m.length < 11) return showToast('Enter a valid 11-digit mobile number')
      detail = 'Wallet · ' + m.slice(0, 4) + '•••' + m.slice(-4)
    } else {
      const acct = pf.acct.replace(/\s/g, '')
      if (acct.replace(/\D/g, '').length < 4) return showToast('Enter a valid account number')
      detail = pf.bank + ' ••••' + acct.slice(-4)
    }
    addPayment({ type: payType, detail, icon: cfg.icon, color: cfg.color })
    setView('main'); setStep(2); showToast(payType + ' added')
  }

  const doPlace = () => {
    const ids = placeOrder()
    go('order-success', { orderIds: ids })
  }

  // ── inline add-address view ──
  if (view === 'addr') {
    return (
      <div className="screen">
        <Head goBack={goBack} />
        <div className="p-4">
          <p className="text-[13px] font-bold text-navy-dark mb-3">Add address</p>
          <div className="bg-white rounded-2xl border border-border p-4 space-y-3.5">
            <div>
              <label className="slbl">Label</label>
              <div className="flex gap-2">
                {['Home', 'Office', 'Other'].map((l) => (
                  <button key={l} onClick={() => setAf({ ...af, label: l })} className={`press flex-1 py-2 rounded-lg text-[12px] font-semibold border ${af.label === l ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-border'}`}>{l}</button>
                ))}
              </div>
            </div>
            <Field label="Full name" value={af.name} onChange={(v) => setAf({ ...af, name: v })} />
            <Field label="Phone" value={af.phone} onChange={(v) => setAf({ ...af, phone: v })} />
            <div><label className="slbl">Address</label><textarea rows="2" className="sinp resize-none" placeholder="House / street / area" value={af.line} onChange={(e) => setAf({ ...af, line: e.target.value })} /></div>
            <Field label="City" value={af.city} onChange={(v) => setAf({ ...af, city: v })} />
          </div>
          <div className="flex gap-2.5 mt-4">
            <button onClick={goBack} className="press flex-1 h-12 border border-border rounded-xl text-[13px] font-bold text-gray-600 bg-white">Cancel</button>
            <button onClick={submitAddr} className="press flex-1 h-12 bg-navy text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5"><Icon name="checkmark-outline" style={{ fontSize: '16px' }} />Save address</button>
          </div>
        </div>
      </div>
    )
  }

  // ── inline add-payment view ──
  if (view === 'pay') {
    const cfg = PM_TYPES[payType]
    return (
      <div className="screen">
        <Head goBack={goBack} />
        <div className="p-4">
          <p className="text-[13px] font-bold text-navy-dark mb-3">Add payment method</p>
          <div className="mb-3">
            <label className="slbl">Payment type</label>
            <div className="flex gap-2">
              {Object.keys(PM_TYPES).map((t) => (
                <button key={t} onClick={() => setPayType(t)} className={`press flex-1 rounded-xl border p-2.5 flex flex-col items-center gap-1.5 ${payType === t ? 'border-navy bg-navy/5' : 'border-border bg-white'}`}>
                  <Icon name={PM_TYPES[t].icon} style={{ fontSize: '20px', color: PM_TYPES[t].color }} />
                  <span className={`text-[10.5px] font-semibold ${payType === t ? 'text-navy-dark' : 'text-gray-500'}`}>{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4 space-y-3.5">
            {cfg.field === 'mobile' ? (
              <>
                <div><label className="slbl">Mobile number</label><input className="sinp" inputMode="numeric" placeholder="03XX XXXXXXX" value={pf.mobile} onChange={(e) => setPf({ ...pf, mobile: e.target.value })} /></div>
                <Field label="Account title (optional)" value={user.name} onChange={() => {}} />
              </>
            ) : (
              <>
                <div><label className="slbl">Bank</label><select className="sinp" value={pf.bank} onChange={(e) => setPf({ ...pf, bank: e.target.value })}>{BANKS.map((x) => <option key={x}>{x}</option>)}</select></div>
                <div><label className="slbl">Account number / IBAN</label><input className="sinp" inputMode="numeric" placeholder="PK00 XXXX XXXX XXXX" value={pf.acct} onChange={(e) => setPf({ ...pf, acct: e.target.value })} /></div>
              </>
            )}
          </div>
          <div className="flex gap-2.5 mt-4">
            <button onClick={goBack} className="press flex-1 h-12 border border-border rounded-xl text-[13px] font-bold text-gray-600 bg-white">Cancel</button>
            <button onClick={submitPay} className="press flex-1 h-12 bg-navy text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5"><Icon name="checkmark-outline" style={{ fontSize: '16px' }} />Save method</button>
          </div>
        </div>
      </div>
    )
  }

  const addr = addresses.find((x) => x.id === addrId)
  const pay = payLabel()
  const groups = {}
  cart.forEach((i) => { const { p, b } = PID[i.pid]; (groups[b.id] = groups[b.id] || { b, items: [] }).items.push({ p, qty: i.qty }) })

  return (
    <div className="screen">
      <Head goBack={goBack} />
      <div className="p-4">
        {/* step bar */}
        <div className="flex items-center mb-5">
          {STEPS.map((label, i) => {
            const n = i + 1, done = step > n, cur = step === n
            const dot = cur ? 'bg-navy text-white' : done ? 'bg-brand-green text-white' : 'bg-page text-gray-400 border border-border'
            return (
              <div key={label} className={`flex items-center ${i < 2 ? 'flex-1' : ''}`}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${dot}`}>{done ? <Icon name="checkmark-outline" style={{ fontSize: '14px' }} /> : n}</div>
                  <span className={`text-[11px] font-semibold ${cur || done ? 'text-navy-dark' : 'text-gray-400'}`}>{label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-2 rounded-full ${done ? 'bg-brand-green' : 'bg-border'}`}></div>}
              </div>
            )
          })}
        </div>

        {step === 1 && (
          <>
            <p className="text-[13px] font-bold text-navy-dark mb-2.5">Delivery address</p>
            <div className="space-y-2.5">
              {addresses.map((a) => (
                <button key={a.id} onClick={() => setAddrId(a.id)} className={`press w-full text-left bg-white rounded-2xl border p-4 flex items-start gap-3 ${a.id === addrId ? 'border-navy ring-2 ring-navy/15' : 'border-border'}`}>
                  <div className="w-9 h-9 rounded-lg bg-page flex items-center justify-center shrink-0"><Icon name={a.label === 'Office' ? 'business-outline' : 'home-outline'} className="text-navy" style={{ fontSize: '18px' }} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-[13px] font-bold text-navy-dark">{a.label}</p>{a.def && <span className="text-[9px] font-bold bg-navy text-white px-2 py-0.5 rounded-full">Default</span>}</div>
                    <p className="text-[12px] text-gray-600 mt-0.5 leading-snug">{a.line}, {a.city}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{a.name} · {a.phone}</p>
                  </div>
                  <Radio on={a.id === addrId} />
                </button>
              ))}
            </div>
            <button onClick={() => setView('addr')} className="press w-full mt-3 h-12 border-2 border-dashed border-border rounded-xl text-[13px] font-bold text-navy flex items-center justify-center gap-2"><Icon name="add-outline" style={{ fontSize: '18px' }} />Add new address</button>
            <button onClick={next} className={`press w-full mt-5 h-12 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 ${addrId ? 'bg-navy text-white' : 'bg-gray-200 text-gray-400 pointer-events-none'}`}>Continue to payment<Icon name="arrow-forward-outline" style={{ fontSize: '16px' }} /></button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[13px] font-bold text-navy-dark mb-2.5">Payment method</p>
            <div className="space-y-2.5">
              <button onClick={() => setPayId('cod')} className={`press w-full text-left bg-white rounded-2xl border p-4 flex items-center gap-3 ${payId === 'cod' ? 'border-navy ring-2 ring-navy/15' : 'border-border'}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2dd36f18' }}><Icon name="cash-outline" style={{ fontSize: '20px', color: '#2dd36f' }} /></div>
                <div className="flex-1 min-w-0"><p className="text-[13px] font-bold text-navy-dark">Cash on Delivery</p><p className="text-[11px] text-gray-400">Pay with cash when your order arrives</p></div>
                <Radio on={payId === 'cod'} />
              </button>
              {payments.map((m) => (
                <button key={m.id} onClick={() => setPayId(m.id)} className={`press w-full text-left bg-white rounded-2xl border p-4 flex items-center gap-3 ${payId === m.id ? 'border-navy ring-2 ring-navy/15' : 'border-border'}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${m.color}18` }}><Icon name={m.icon} style={{ fontSize: '20px', color: m.color }} /></div>
                  <div className="flex-1 min-w-0"><p className="text-[13px] font-bold text-navy-dark">{m.type}</p><p className="text-[11px] text-gray-400">{m.detail}</p></div>
                  <Radio on={payId === m.id} />
                </button>
              ))}
            </div>
            <button onClick={() => setView('pay')} className="press w-full mt-3 h-12 border-2 border-dashed border-border rounded-xl text-[13px] font-bold text-navy flex items-center justify-center gap-2"><Icon name="add-outline" style={{ fontSize: '18px' }} />Add payment method</button>
            <button onClick={next} className="press w-full mt-5 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2">Review order<Icon name="arrow-forward-outline" style={{ fontSize: '16px' }} /></button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-white rounded-2xl border border-border p-4 mb-3">
              <div className="flex items-center justify-between mb-1"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Deliver to</p><button onClick={() => setStep(1)} className="text-[11.5px] font-semibold text-brand-blue press">Change</button></div>
              {addr ? <><p className="text-[13px] font-bold text-navy-dark">{addr.label} · {addr.name}</p><p className="text-[12px] text-gray-600 mt-0.5 leading-snug">{addr.line}, {addr.city}</p><p className="text-[11px] text-gray-400 mt-0.5">{addr.phone}</p></> : <p className="text-[12px] text-brand-red">No address selected</p>}
            </div>
            <div className="bg-white rounded-2xl border border-border p-4 mb-3">
              <div className="flex items-center justify-between mb-1"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Payment</p><button onClick={() => setStep(2)} className="text-[11.5px] font-semibold text-brand-blue press">Change</button></div>
              <div className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${pay.color}18` }}><Icon name={pay.icon} style={{ fontSize: '18px', color: pay.color }} /></div><div><p className="text-[13px] font-bold text-navy-dark">{pay.title}</p>{pay.detail && <p className="text-[11px] text-gray-400">{pay.detail}</p>}</div></div>
            </div>
            <div className="bg-white rounded-2xl border border-border p-4 mb-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Items ({cartCount})</p>
              {Object.values(groups).map((g) => (
                <div key={g.b.id} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2 mb-2"><StoreLogo b={g.b} size={22} /><span className="text-[12px] font-bold text-navy-dark truncate">{g.b.name}</span></div>
                  <div className="space-y-2">
                    {g.items.map(({ p, qty }) => (
                      <div key={p.pid} className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0"><ImgCell src={imgUrl(p)} cat={p.cat} color={g.b.color} width="100%" height={44} /></div>
                        <div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-navy-dark truncate">{p.name}</p><p className="text-[10.5px] text-gray-400">{money(unitPrice(p))} × {qty}</p></div>
                        <span className="text-[12px] font-bold text-navy-dark tnum shrink-0">{money(unitPrice(p) * qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-[12.5px] text-gray-500">Subtotal</span><span className="text-[12.5px] font-semibold text-navy-dark tnum">{money(subtotal)}</span></div>
              <div className="flex items-center justify-between mb-2"><span className="text-[12.5px] text-gray-500">Delivery</span><span className={`text-[12.5px] font-semibold tnum ${delivery === 0 ? 'text-brand-green' : 'text-navy-dark'}`}>{delivery === 0 ? 'FREE' : money(delivery)}</span></div>
              <div className="flex items-center justify-between pt-2.5 border-t border-border"><span className="text-[14px] font-bold text-navy-dark">Total</span><span className="text-[17px] font-extrabold text-navy-dark tnum">{money(total)}</span></div>
            </div>
            <button onClick={doPlace} className="press w-full mt-4 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2"><Icon name="lock-closed" style={{ fontSize: '16px' }} />Place order · {money(total)}</button>
            <p className="text-center text-[10.5px] text-gray-400 mt-2.5 px-6 leading-relaxed">By placing this order you agree to our Terms & Refund policy.</p>
          </>
        )}
      </div>
    </div>
  )
}

function Head({ goBack }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-border px-4 pt-11 pb-3 flex items-center gap-3">
      <button onClick={goBack} className="w-9 h-9 rounded-xl bg-page border border-border flex items-center justify-center press shrink-0"><Icon name="chevron-back-outline" className="text-navy" style={{ fontSize: '17px' }} /></button>
      <div className="flex-1 min-w-0"><h1 className="text-[16px] font-extrabold text-navy-dark leading-tight">Checkout</h1><p className="text-[10.5px] text-gray-400 leading-tight">Secure checkout</p></div>
      <Icon name="lock-closed-outline" className="text-gray-300" style={{ fontSize: '18px' }} />
    </div>
  )
}

function Field({ label, value, onChange }) {
  return <div><label className="slbl">{label}</label><input className="sinp" value={value} onChange={(e) => onChange(e.target.value)} /></div>
}
