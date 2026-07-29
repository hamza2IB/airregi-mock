import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from './store.jsx'
import { calcTotals, calcCouponDiscount, getEffectivePrice } from '../shared/totals.js'
import { COUPONS, CUSTOMERS, LOYALTY_CONFIG, STORE_CONFIG } from '../shared/catalog.js'
import { fbrVerifyUrl } from '../shared/fbr.js'
import { buildReceiptHtml } from './receiptHtml.js'

const rs = (n) => `Rs.${(n || 0).toLocaleString()}`

export default function Modals() {
  const { modal } = useStore()
  if (!modal) return null
  switch (modal.type) {
    case 'opening': return <OpeningModal />
    case 'payment': return <PaymentModal />
    case 'cash': return <CashModal />
    case 'customer': return <CustomerModal />
    case 'coupon': return <CouponModal />
    case 'redeem': return <RedeemModal />
    case 'refund': return <RefundModal idx={modal.data.idx} />
    case 'receipt': return <ReceiptModal data={modal.data} />
    case 'shiftReport': return <ShiftReportModal data={modal.data} />
    case 'endshift': return <EndShiftModal />
    default: return null
  }
}

function Overlay({ children, onClose, max = 'max-w-md', z = 'z-[80]' }) {
  return (
    <div className={`fixed inset-0 bg-black/60 ${z} flex items-center justify-center p-4`} onClick={onClose}>
      <div className={`bg-white rounded-2xl w-full ${max} p-6 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
function CloseBtn({ onClose, size = 26, box = 11 }) {
  const boxCls = box === 10 ? 'w-10 h-10' : 'w-11 h-11'
  return (
    <button onClick={onClose} className={`tap-btn ${boxCls} rounded-full bg-gray-100 text-gray-500 flex items-center justify-center`}>
      <ion-icon name="close-outline" style={{ fontSize: `${size}px` }}></ion-icon>
    </button>
  )
}

/* ---------- Opening balance ---------- */
function OpeningModal() {
  const { openingBalance, setOpeningBalance, setModal } = useStore()
  const ref = useRef(null)
  useEffect(() => { setTimeout(() => ref.current?.focus(), 50) }, [])
  const save = () => { setOpeningBalance(parseInt(ref.current.value) || 0); setModal(null) }
  return (
    <Overlay onClose={() => setModal(null)} max="max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-[18px] text-black">Opening Cash</h3>
          <p className="text-[14px] text-gray-500 mt-1">Count the cash in drawer</p>
        </div>
        <CloseBtn onClose={() => setModal(null)} />
      </div>
      <div className="bg-blue-50 rounded-xl p-4 mb-5 flex items-start gap-3">
        <ion-icon name="information-circle-outline" class="text-brand-blue text-xl shrink-0 mt-0.5"></ion-icon>
        <p className="text-[13px] text-navy leading-relaxed">This amount will be used to tally at the end of day.</p>
      </div>
      <label className="block text-[14px] text-gray-500 mb-2 font-medium">Cash counted (Rs.)</label>
      <input ref={ref} type="number" defaultValue={openingBalance || ''} placeholder="e.g. 5000"
        onKeyDown={(e) => e.key === 'Enter' && save()}
        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 h-[58px] text-[24px] font-mono focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 mb-5" />
      <button onClick={save} className="tap-btn w-full h-[54px] bg-navy text-white text-[16px] font-semibold rounded-xl flex items-center justify-center gap-2">
        <ion-icon name="checkmark-outline" style={{ fontSize: '22px' }}></ion-icon> Confirm & Start
      </button>
    </Overlay>
  )
}

/* ---------- Payment method ---------- */
function PaymentModal() {
  const { setModal, completePayment } = useStore()
  const pick = (mode) => { if (mode === 'cash') setModal({ type: 'cash' }); else completePayment(mode) }
  const opts = [
    { id: 'cash', label: 'Cash', desc: 'Customer pays with cash', icon: 'cash-outline', btn: 'hover:border-brand-green hover:bg-green-50/50', box: 'bg-green-50', icn: 'text-brand-green text-3xl' },
    { id: 'card', label: 'Card', desc: 'Swipe / insert / tap', icon: 'card-outline', btn: 'hover:border-brand-blue hover:bg-blue-50/50', box: 'bg-blue-50', icn: 'text-brand-blue text-3xl' },
    { id: 'qr', label: 'QR / App Pay', desc: 'Scan QR or pay via app', icon: 'qr-code-outline', btn: 'hover:border-brand-purple hover:bg-purple-50/50', box: 'bg-purple-50', icn: 'text-brand-purple text-3xl' },
  ]
  return (
    <Overlay onClose={() => setModal(null)}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-[18px] text-black">Payment Method</h3>
          <p className="text-[14px] text-gray-500 mt-1">How is the customer paying?</p>
        </div>
        <CloseBtn onClose={() => setModal(null)} />
      </div>
      <div className="space-y-3">
        {opts.map((o) => (
          <button key={o.id} onClick={() => pick(o.id)}
            className={`tap-btn w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl ${o.btn} text-left min-h-[72px]`}>
            <div className={`w-14 h-14 ${o.box} rounded-xl flex items-center justify-center`}>
              <ion-icon name={o.icon} class={o.icn}></ion-icon>
            </div>
            <div className="flex-1">
              <p className="text-[17px] font-semibold text-black">{o.label}</p>
              <p className="text-[14px] text-gray-500">{o.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Overlay>
  )
}

/* ---------- Cash tendered ---------- */
function CashModal() {
  const { display, setModal, completePayment } = useStore()
  const total = display.displayTotal
  const [tendered, setTendered] = useState('')
  const ref = useRef(null)
  useEffect(() => { setTimeout(() => ref.current?.focus(), 50) }, [])

  const quick = useMemo(() => {
    const denoms = [50, 100, 500, 1000, 5000]
    const out = [total]
    const r10 = Math.ceil(total / 10) * 10
    if (r10 !== total) out.push(r10)
    for (const d of denoms) { const r = Math.ceil(total / d) * d; if (r > total && !out.includes(r)) out.push(r); if (out.length >= 4) break }
    return [...new Set(out)].sort((a, b) => a - b).slice(0, 4)
  }, [total])

  const val = parseInt(tendered) || 0
  const enough = val >= total
  const change = val - total

  const confirm = () => { if (val < total) return; setModal(null); completePayment('cash', val) }

  return (
    <Overlay onClose={() => setModal(null)} max="max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-[18px] text-black">Cash Payment</h3>
          <p className="text-[14px] text-gray-500 mt-1">Enter amount received</p>
        </div>
        <CloseBtn onClose={() => setModal(null)} />
      </div>
      <div className="bg-navy/5 rounded-xl p-4 mb-5 text-center">
        <p className="text-[13px] text-gray-500 uppercase font-medium">Amount Due</p>
        <p className="text-[32px] font-bold text-navy mt-1">{rs(total)}</p>
      </div>
      <label className="block text-[14px] text-gray-500 mb-2 font-medium">Cash Received (Rs.)</label>
      <input ref={ref} type="number" value={tendered} onChange={(e) => setTendered(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { confirm(); e.preventDefault() } }} placeholder="Enter amount..."
        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 h-[58px] text-[24px] font-mono focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 mb-3" />
      <div className="grid grid-cols-4 gap-2 mb-4">
        {quick.map((v) => (
          <button key={v} onClick={() => setTendered(String(v))} className="tap-btn py-2.5 border border-gray-200 rounded-lg text-center hover:bg-navy/5 hover:border-navy/30">
            <p className="text-[13px] font-bold text-black">{rs(v)}</p>
          </button>
        ))}
      </div>
      {enough && val > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex justify-between items-center">
          <span className="text-[14px] text-gray-600 font-medium">Change Due</span>
          <span className="text-[22px] font-bold text-brand-green">{rs(change)}</span>
        </div>
      )}
      {val > 0 && !enough && (
        <div className="mb-3 px-4 py-2.5 bg-red-50 rounded-xl text-[13px] text-brand-red flex items-center gap-2">
          <ion-icon name="alert-circle-outline" class="text-base shrink-0"></ion-icon>
          <span>Insufficient amount</span>
        </div>
      )}
      <button onClick={confirm} disabled={!enough}
        className="tap-btn w-full h-[54px] bg-brand-green text-white text-[16px] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400">
        <ion-icon name="checkmark-outline" style={{ fontSize: '22px' }}></ion-icon> Confirm Payment
      </button>
      <button onClick={() => { setModal(null); completePayment('cash', total) }} className="tap-btn w-full mt-3 h-[44px] text-[14px] font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1.5">
        <ion-icon name="wallet-outline" style={{ fontSize: '18px' }}></ion-icon> Exact Amount
      </button>
    </Overlay>
  )
}

/* ---------- Customer (lookup + register) ---------- */
function CustomerModal() {
  const { setModal, linkCustomer } = useStore()
  const [tab, setTab] = useState('lookup')
  const [lookupErr, setLookupErr] = useState(false)
  const phoneRef = useRef(null)
  const [reg, setReg] = useState({ name: '', phone: '', area: '' })
  const [regErr, setRegErr] = useState('')
  const [regDone, setRegDone] = useState(null)

  useEffect(() => { if (tab === 'lookup') setTimeout(() => phoneRef.current?.focus(), 50) }, [tab])

  const submitLookup = () => {
    const val = (phoneRef.current.value || '').trim().replace(/[-\s]/g, '')
    if (!val) return
    const hit = Object.values(CUSTOMERS).find((c) => c.phone && c.phone.replace(/[-\s]/g, '') === val)
    if (hit) { linkCustomer(hit); setModal(null) } else setLookupErr(true)
  }
  const register = () => {
    setRegErr('')
    if (!reg.name.trim()) return setRegErr('Please enter the customer name')
    if (!reg.phone.trim() || reg.phone.trim().length < 7) return setRegErr('Please enter a valid phone number')
    const parts = reg.name.trim().split(' ')
    const initials = (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || 'X')).toUpperCase()
    const randomNum = String(Math.floor(Math.random() * 90000000) + 10000000)
    const userId = initials + '-' + randomNum
    const newCustomer = {
      userId, name: reg.name.trim(), initial: reg.name.trim()[0].toUpperCase(), area: reg.area.trim() || 'Karachi',
      visits: 0, lifetime: 'Rs.0', last: 'New', loyaltyPoints: 0, loyaltyTier: 'Member', phone: reg.phone.trim(),
    }
    CUSTOMERS[initials.toLowerCase() + randomNum.slice(0, 4)] = newCustomer
    setRegDone(userId)
    setTimeout(() => { linkCustomer(newCustomer); setModal(null) }, 1200)
  }

  const tabCls = (active) => active
    ? 'tap-btn flex-1 py-3 text-[15px] font-semibold rounded-lg bg-white text-navy shadow-sm'
    : 'tap-btn flex-1 py-3 text-[15px] font-medium rounded-lg text-gray-500'

  return (
    <Overlay onClose={() => setModal(null)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-[18px] text-black">Customer</h3>
          <p className="text-[14px] text-gray-500 mt-0.5">Link existing or register new</p>
        </div>
        <CloseBtn onClose={() => setModal(null)} />
      </div>
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
        <button onClick={() => setTab('lookup')} className={tabCls(tab === 'lookup')}>Look up</button>
        <button onClick={() => setTab('register')} className={tabCls(tab === 'register')}>Register New</button>
      </div>

      {tab === 'lookup' ? (
        <div>
          <label className="block text-[14px] text-gray-500 mb-2 font-medium">Phone Number</label>
          <input ref={phoneRef} type="tel" placeholder="e.g. 0300-1234567"
            onChange={() => setLookupErr(false)} onKeyDown={(e) => { if (e.key === 'Enter') { submitLookup(); e.preventDefault() } }}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-5 h-[54px] text-[16px] font-mono focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 mb-4" />
          {lookupErr && (
            <div className="mb-3 px-4 py-2.5 bg-red-50 rounded-xl text-[13px] text-brand-red flex items-center gap-2">
              <ion-icon name="alert-circle-outline" class="text-base shrink-0"></ion-icon>
              <span>Customer not found. Try registering them instead.</span>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="tap-btn flex-1 h-[50px] bg-gray-100 text-black text-[15px] font-medium rounded-xl">Cancel</button>
            <button onClick={submitLookup} className="tap-btn flex-1 h-[50px] bg-navy text-white text-[15px] font-semibold rounded-xl">Search</button>
          </div>
          <p className="text-[12px] text-gray-400 mt-3 text-center">Try "0300-1111111" (Ahmed) or "0321-2222222" (Fatima)</p>
        </div>
      ) : (
        <div>
          <div className="space-y-3 mb-4">
            <Field label="Full Name *" value={reg.name} onChange={(v) => setReg({ ...reg, name: v })} placeholder="e.g. Saad Ahmed" />
            <Field label="Phone Number *" value={reg.phone} onChange={(v) => setReg({ ...reg, phone: v })} placeholder="e.g. 0300-1234567" mono />
            <Field label="Area (optional)" value={reg.area} onChange={(v) => setReg({ ...reg, area: v })} placeholder="e.g. Gulshan, Karachi" />
          </div>
          {regErr && (
            <div className="mb-3 px-4 py-2.5 bg-red-50 rounded-xl text-[13px] text-brand-red flex items-center gap-2">
              <ion-icon name="alert-circle-outline" class="text-base shrink-0"></ion-icon><span>{regErr}</span>
            </div>
          )}
          {regDone && (
            <div className="mb-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <ion-icon name="checkmark-circle" class="text-brand-green text-xl"></ion-icon>
                <span className="text-[14px] font-semibold text-brand-green">Registered!</span>
              </div>
              <p className="text-[13px] text-gray-600">User ID: <strong className="font-mono text-black">{regDone}</strong></p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="tap-btn flex-1 h-[50px] bg-gray-100 text-black text-[15px] font-medium rounded-xl">Cancel</button>
            <button onClick={register} disabled={!!regDone} className="tap-btn flex-1 h-[50px] bg-brand-green text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-200">
              <ion-icon name="person-add-outline" style={{ fontSize: '20px' }}></ion-icon> Register & Link
            </button>
          </div>
          <div className="mt-4 bg-blue-50 rounded-xl px-4 py-3 flex items-start gap-2">
            <ion-icon name="information-circle-outline" class="text-brand-blue text-xl shrink-0 mt-0.5"></ion-icon>
            <p className="text-[12px] text-navy leading-relaxed">Customer starts with <strong>0 points</strong> and earns 1 pt per Rs.10 spent.</p>
          </div>
        </div>
      )}
    </Overlay>
  )
}
function Field({ label, value, onChange, placeholder, mono }) {
  return (
    <div>
      <label className="block text-[14px] text-gray-500 mb-1.5 font-medium">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 h-[52px] text-[16px] ${mono ? 'font-mono' : ''} focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20`} />
    </div>
  )
}

/* ---------- Coupon ---------- */
function CouponModal() {
  const { cart, setAppliedCoupon, setModal } = useStore()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const ref = useRef(null)
  useEffect(() => { setTimeout(() => ref.current?.focus(), 50) }, [])
  const { sub } = calcTotals(cart, null, 0)

  const apply = (raw) => {
    const c = (raw ?? code).trim().toUpperCase()
    setErr(''); setOk('')
    if (!c) return setErr('Please enter a coupon code')
    const coupon = COUPONS.find((x) => x.code === c)
    if (!coupon) return setErr('Invalid coupon code. Please try again.')
    if (sub < coupon.minOrder) return setErr(`Minimum order of Rs.${coupon.minOrder.toLocaleString()} required. Current subtotal: Rs.${sub.toLocaleString()}`)
    const discount = calcCouponDiscount(coupon, sub)
    setAppliedCoupon(coupon)
    setOk(`${coupon.code} applied! You save Rs.${discount.toLocaleString()}`)
    setTimeout(() => setModal(null), 800)
  }

  return (
    <Overlay onClose={() => setModal(null)}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-[16px] text-black">Apply Coupon</h3>
          <p className="text-[13px] text-gray-500 mt-1">Enter a coupon code for order discount</p>
        </div>
        <CloseBtn onClose={() => setModal(null)} size={24} box={10} />
      </div>
      <div className="relative mb-4">
        <ion-icon name="pricetag-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></ion-icon>
        <input ref={ref} value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(''); setOk('') }}
          onKeyDown={(e) => { if (e.key === 'Enter') { apply(); e.preventDefault() } }} placeholder="e.g. SAVE50"
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-4 h-[52px] text-[16px] font-mono uppercase focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-200" />
      </div>
      {err && (
        <div className="mb-4 px-4 py-3 bg-red-50 rounded-xl text-[13px] text-brand-red flex items-center gap-2">
          <ion-icon name="alert-circle-outline" class="text-lg shrink-0"></ion-icon><span>{err}</span>
        </div>
      )}
      {ok && (
        <div className="mb-4 px-4 py-3 bg-green-50 rounded-xl text-[13px] text-brand-green flex items-center gap-2">
          <ion-icon name="checkmark-circle-outline" class="text-lg shrink-0"></ion-icon><span>{ok}</span>
        </div>
      )}
      <button onClick={() => apply()} className="tap-btn w-full h-[52px] bg-brand-purple text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 mb-4">
        <ion-icon name="checkmark-outline" style={{ fontSize: '20px' }}></ion-icon> Apply
      </button>
      <div className="border-t border-gray-100 pt-4">
        <p className="text-[12px] text-gray-500 font-medium mb-3 uppercase tracking-wide">Available Coupons</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {COUPONS.map((c) => {
            const eligible = sub >= c.minOrder
            return (
              <button key={c.code} disabled={!eligible} onClick={() => apply(c.code)}
                className={`tap-btn flex-shrink-0 w-[180px] flex flex-col items-start gap-1.5 p-3 border rounded-xl text-left ${eligible ? 'border-purple-200 hover:border-brand-purple hover:bg-purple-50/50' : 'border-gray-100 opacity-50'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-bold font-mono ${eligible ? 'text-black' : 'text-gray-400'} truncate`}>{c.code}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${eligible ? 'bg-purple-100 text-brand-purple' : 'bg-gray-100 text-gray-400'} font-semibold whitespace-nowrap`}>{c.label}</span>
                </div>
                <p className={`text-[11px] ${eligible ? 'text-gray-500' : 'text-gray-400'} leading-tight`}>{c.description}</p>
                {!eligible && <p className="text-[10px] text-brand-red">Min Rs.{c.minOrder.toLocaleString()}</p>}
              </button>
            )
          })}
        </div>
      </div>
    </Overlay>
  )
}

/* ---------- Redeem points ---------- */
function RedeemModal() {
  const { customer, cart, appliedCoupon, setRedeemedPoints, setModal } = useStore()
  const [input, setInput] = useState('')
  const [err, setErr] = useState('')
  const ref = useRef(null)
  useEffect(() => { setTimeout(() => ref.current?.focus(), 50) }, [])

  const pts = customer?.loyaltyPoints || 0
  const value = Math.round(pts / LOYALTY_CONFIG.redemptionRate)
  const { totalBeforePoints } = calcTotals(cart, appliedCoupon, 0)
  const maxRedeemRs = Math.floor(totalBeforePoints * (LOYALTY_CONFIG.maxRedeemPercent / 100))
  const maxRedeemPts = Math.min(pts, maxRedeemRs * LOYALTY_CONFIG.redemptionRate)

  const quick = [
    { label: '25%', points: Math.floor(maxRedeemPts * 0.25) },
    { label: '50%', points: Math.floor(maxRedeemPts * 0.5) },
    { label: 'Max', points: maxRedeemPts },
  ].filter((o) => o.points >= LOYALTY_CONFIG.minRedeemPoints)

  const previewRs = Math.round((parseInt(input) || 0) / LOYALTY_CONFIG.redemptionRate)

  const confirm = () => {
    const val = parseInt(input) || 0
    setErr('')
    if (val < LOYALTY_CONFIG.minRedeemPoints) return setErr(`Minimum ${LOYALTY_CONFIG.minRedeemPoints} points required`)
    if (val > pts) return setErr(`Customer only has ${pts.toLocaleString()} points`)
    if (val > maxRedeemPts) return setErr(`Max ${LOYALTY_CONFIG.maxRedeemPercent}% of order total (${maxRedeemPts.toLocaleString()} pts)`)
    if (cart.length === 0) return setErr('Add items to cart first')
    setRedeemedPoints(val); setModal(null)
  }

  return (
    <Overlay onClose={() => setModal(null)} max="max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-[16px] text-black">Redeem Points</h3>
          <p className="text-[13px] text-gray-500 mt-1">{customer?.name}</p>
        </div>
        <CloseBtn onClose={() => setModal(null)} size={24} box={10} />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ion-icon name="star" class="text-amber-500 text-xl"></ion-icon>
            <span className="text-[14px] font-semibold text-black">{pts.toLocaleString()} points</span>
          </div>
          <span className="text-[12px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">{customer?.loyaltyTier || 'Member'}</span>
        </div>
        <div className="flex justify-between text-[12px] text-gray-500">
          <span>Value: <strong className="text-black">{rs(value)}</strong></span>
          <span>Rate: 10 pts = Rs.1</span>
        </div>
      </div>
      <p className="text-[12px] text-gray-500 font-medium mb-2">Quick redeem:</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {quick.length === 0 ? (
          <p className="col-span-3 text-[11px] text-gray-400 text-center py-2">Add items to cart first</p>
        ) : quick.map((o) => (
          <button key={o.label} onClick={() => setInput(String(o.points))} className="tap-btn p-2.5 border border-amber-200 rounded-xl text-center hover:bg-amber-50 hover:border-amber-400">
            <p className="text-[12px] font-bold text-black">{o.points.toLocaleString()} pts</p>
            <p className="text-[11px] text-amber-600">{o.label} · {rs(Math.round(o.points / LOYALTY_CONFIG.redemptionRate))}</p>
          </button>
        ))}
      </div>
      <label className="block text-[13px] text-gray-500 mb-2 font-medium">Or enter points to redeem:</label>
      <div className="relative mb-2">
        <input ref={ref} type="number" value={input} onChange={(e) => { setInput(e.target.value); setErr('') }}
          onKeyDown={(e) => { if (e.key === 'Enter') { confirm(); e.preventDefault() } }} placeholder="e.g. 500"
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 h-[52px] text-[18px] font-mono focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">pts</span>
      </div>
      <div className="mb-4 px-4 py-2 bg-gray-50 rounded-lg text-[12px] text-gray-500 flex justify-between">
        <span>Discount:</span><span className="font-semibold text-black">{rs(previewRs)}</span>
      </div>
      {err && (
        <div className="mb-4 px-4 py-2 bg-red-50 rounded-xl text-[12px] text-brand-red flex items-center gap-2">
          <ion-icon name="alert-circle-outline" class="text-sm shrink-0"></ion-icon><span>{err}</span>
        </div>
      )}
      <button onClick={confirm} className="tap-btn w-full h-[52px] bg-amber-500 text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600">
        <ion-icon name="star" style={{ fontSize: '18px' }}></ion-icon> Redeem Points
      </button>
      <p className="text-[11px] text-gray-400 text-center mt-3">Min {LOYALTY_CONFIG.minRedeemPoints} pts · Max 50% of order total</p>
    </Overlay>
  )
}

/* ---------- Refund ---------- */
function RefundModal({ idx }) {
  const { salesHistory, processRefund, setModal, setScreen } = useStore()
  const tx = salesHistory[idx]
  const [selected, setSelected] = useState([])
  const [type, setType] = useState('refund')
  const [reason, setReason] = useState('')
  if (!tx) return null

  const orderSubtotal = tx.products.reduce((s, p) => s + (p.effectivePrice || p.price) * p.qty, 0)
  const full = selected.length === tx.products.length
  let amount = 0
  if (full) amount = tx.total
  else { let sel = 0; selected.forEach((i) => { const p = tx.products[i]; if (p) sel += (p.effectivePrice || p.price) * p.qty }); amount = orderSubtotal > 0 ? Math.round((sel / orderSubtotal) * tx.total) : 0 }

  const toggle = (i) => setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  const methodLabels = { cash: 'Cash', card: 'Card', qr: 'QR Pay' }
  const methodIcons = { cash: 'cash-outline', card: 'card-outline', qr: 'qr-code-outline' }
  const reasons = ['Damaged/Defective', 'Wrong item', 'Customer changed mind', 'Expired product']

  const confirm = () => {
    if (selected.length === 0) return
    processRefund(idx, { selectedItems: selected, reason: reason || 'No reason provided', type })
    setModal(null); setScreen('orders')
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4" onClick={() => setModal(null)}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[16px] text-black">Return & Refund</h3>
            <p className="text-[13px] text-gray-500 mt-0.5 font-mono">{tx.id}</p>
          </div>
          <CloseBtn onClose={() => setModal(null)} size={24} box={10} />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-[13px] space-y-1.5">
          <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-black font-medium">{tx.at.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} · {tx.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="text-black font-medium">{methodLabels[tx.method] || tx.method}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="text-black font-medium">{tx.customer || 'Guest'}</span></div>
        </div>
        <p className="text-[13px] text-gray-500 mb-2 font-medium">Select items to return:</p>
        <div className="space-y-1 mb-4 border border-gray-200 rounded-xl overflow-hidden">
          {tx.products.map((p, i) => {
            const ep = p.effectivePrice || p.price
            return (
              <label key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 min-h-[52px]">
                <input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="w-5 h-5 rounded border-gray-300 accent-navy" />
                <div className="w-9 h-9 bg-gray-100 rounded-lg shrink-0 overflow-hidden"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0"><span className="text-[13px] text-black truncate block">{p.name}</span></div>
                <span className="text-[12px] text-gray-500">×{p.qty}</span>
                <span className="text-[13px] font-medium text-black">{rs(ep * p.qty)}</span>
              </label>
            )
          })}
        </div>
        <div className="mb-4">
          <p className="text-[13px] text-gray-500 mb-2 font-medium">Return type:</p>
          <div className="grid grid-cols-2 gap-3">
            {['refund', 'exchange'].map((t) => (
              <button key={t} onClick={() => setType(t)} className={`tap-btn p-4 border-2 rounded-xl text-left min-h-[60px] ${type === t ? 'border-navy bg-navy/5' : 'border-gray-200'}`}>
                <p className="text-[13px] font-semibold text-black capitalize">{t}</p>
                <p className="text-[12px] text-gray-500">{t === 'refund' ? 'Return money' : 'Swap item'}</p>
              </button>
            ))}
          </div>
        </div>
        {type === 'refund' && (
          <div className="mb-4">
            <p className="text-[13px] text-gray-500 mb-2 font-medium">Refund to:</p>
            <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
              <ion-icon name={methodIcons[tx.method] || 'card-outline'} class="text-brand-blue text-lg"></ion-icon>
              <span className="text-[13px] font-medium text-navy">Refund via {methodLabels[tx.method] || 'original method'}</span>
            </div>
          </div>
        )}
        <div className="mb-4">
          <p className="text-[13px] text-gray-500 mb-2 font-medium">Reason:</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {reasons.map((r) => (
              <button key={r} onClick={() => setReason(r)} className={`tap-btn px-4 py-3 text-[12px] border rounded-xl text-left hover:border-navy min-h-[44px] ${reason === r ? 'border-navy bg-navy/5' : 'border-gray-200'}`}>{r}</button>
            ))}
          </div>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Or type a reason..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-[44px] text-[13px] focus:outline-none focus:border-navy" />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-gray-500">Refund Amount</span>
            <span className="text-[18px] font-bold text-brand-red">{rs(amount)}</span>
          </div>
          <p className="text-[12px] text-gray-400 mt-1">{selected.length} item{selected.length !== 1 ? 's' : ''} selected</p>
        </div>
        <button onClick={confirm} disabled={selected.length === 0}
          className="tap-btn w-full h-[52px] bg-brand-red text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500">
          <ion-icon name="return-down-back-outline" style={{ fontSize: '18px' }}></ion-icon>
          <span>{type === 'refund' ? 'Confirm Refund' : 'Confirm Exchange'}</span>
        </button>
      </div>
    </div>
  )
}

/* ---------- Receipt ---------- */
function ReceiptModal({ data }) {
  const { newSaleAfterReceipt, setModal } = useStore()
  const { tx, cashTendered, mode } = data
  const bodyRef = useRef(null)

  const html = useMemo(() => buildReceiptHtml(tx, { mode, cashTendered }), [tx, mode, cashTendered])

  useEffect(() => {
    const el = bodyRef.current?.querySelector('#fbr-qr')
    if (el && typeof window.QRCode !== 'undefined') {
      el.innerHTML = ''
      // eslint-disable-next-line no-new
      new window.QRCode(el, { text: fbrVerifyUrl(tx.fbrInvoice, tx.total), width: 88, height: 88, correctLevel: window.QRCode.CorrectLevel.M })
    }
  }, [html, tx])

  const close = () => (mode === 'success' ? newSaleAfterReceipt() : setModal(null))
  const isReprint = mode === 'reprint'

  return (
    <div id="receipt-modal" className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className={`${isReprint ? 'bg-navy' : 'bg-brand-green'} px-6 py-5 text-center`}>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <ion-icon name={isReprint ? 'receipt-outline' : 'checkmark-circle'} class="text-white text-4xl"></ion-icon>
          </div>
          <p className="text-white text-[20px] font-bold">{isReprint ? 'Order Receipt' : 'Payment Successful'}</p>
          <p className="text-white/80 text-[15px] mt-1">{isReprint ? tx.id : `${rs(tx.total)} via ${({ qr: 'PayFast QR', cash: 'Cash', card: 'Card (POS)' }[tx.method] || tx.method)}`}</p>
        </div>
        <div ref={bodyRef} className="overflow-y-auto flex-1 px-5 py-4" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="px-5 pb-5 pt-2 flex gap-3 border-t border-gray-100 shrink-0">
          <button onClick={() => window.print()} className="tap-btn flex-1 h-[52px] bg-navy text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2">
            <ion-icon name="print-outline" style={{ fontSize: '20px' }}></ion-icon> Print
          </button>
          <button onClick={close} className="tap-btn flex-1 h-[52px] bg-brand-green text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2">
            <ion-icon name={isReprint ? 'close-outline' : 'add-circle-outline'} style={{ fontSize: '20px' }}></ion-icon> {isReprint ? 'Close' : 'New Sale'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Shift closing report ---------- */
function ShiftReportModal({ data }) {
  const { setModal } = useStore()
  const now = new Date()
  const r = data
  const rsv = (v) => `Rs.${(v || 0).toLocaleString()}`
  const fmt = (d) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—')
  const line = (label, val, bold) => (
    <div className={`flex justify-between py-1.5 ${bold ? 'font-bold text-black' : 'text-gray-600'}`}>
      <span>{label}</span><span className={bold ? '' : 'font-medium text-black'}>{val}</span>
    </div>
  )
  const title = (t) => <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-4 mb-1 pb-1 border-b border-dashed border-gray-300">{t}</p>
  const diffLabel = r.difference === 0 ? 'Rs.0 — Balanced' : r.difference > 0 ? `+${rsv(r.difference)} Over` : `-${rsv(Math.abs(r.difference))} Short`

  return (
    <div id="shift-report-modal" className="fixed inset-0 bg-black/60 z-[85] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-navy text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ion-icon name="document-text-outline" style={{ fontSize: '22px' }}></ion-icon>
            <p className="text-[17px] font-bold">Shift Closing Report</p>
          </div>
          <span className="text-[12px] text-white/60">Generated {now.toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 text-[13px]">
          <div className="text-center border-b border-dashed border-gray-300 pb-3 mb-2">
            <p className="text-[15px] font-bold text-black">{STORE_CONFIG.name} — Shift Closing Report</p>
            <p className="text-[12px] text-gray-500 mt-0.5">{now.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          {title('Shift')}
          {line('Staff', `${r.staff} (${r.staffId})`)}
          {line('Register', r.register)}
          {line('Shift Start', fmt(r.shiftStart))}
          {line('Shift End', fmt(r.shiftEnd))}
          {title('Sales Summary')}
          {line('Total Transactions', r.txCount)}
          {line('Gross Sales', rsv(r.grossTotal))}
          {line('Refunds', `-${rsv(r.totalRefundAmount)}`)}
          {line('Net Sales', rsv(r.netTotal), true)}
          {title('Payment Breakdown')}
          {line(`Cash (${r.cashCount} tx)`, rsv(r.cashTotal))}
          {line(`Card (${r.cardCount} tx)`, rsv(r.cardTotal))}
          {line(`QR / App (${r.qrCount} tx)`, rsv(r.qrTotal))}
          {title('Discounts & Loyalty')}
          {line(`Coupon Discounts (${r.couponCount})`, `-${rsv(r.couponTotal)}`)}
          {line(`Points Redeemed (${r.pointsPtsTotal.toLocaleString()} pts)`, `-${rsv(r.pointsRsTotal)}`)}
          {title('Cash Drawer')}
          {line('Opening Balance', rsv(r.openingBalance))}
          {line('Cash Received', `+${rsv(r.cashTotal)}`)}
          {line('Cash Out (Refunds)', `-${rsv(r.cashRefunds)}`)}
          {line('Expected in Drawer', rsv(r.expected))}
          {line('Actual Counted', rsv(r.actual))}
          {line('Difference', diffLabel, true)}
          {r.notes && <>{title('Notes')}<p className="text-gray-600 py-1.5">{r.notes}</p></>}
          <div className="mt-5 pt-4 border-t border-dashed border-gray-300">
            <p className="text-[11px] text-gray-400">Signature: ______________________________</p>
            <p className="text-[10px] text-gray-400 mt-3">Generated at {now.toLocaleString('en-PK')} · Powered by Air Register</p>
          </div>
        </div>
        <div className="px-6 pb-5 pt-3 flex gap-3 border-t border-gray-100 shrink-0">
          <button onClick={() => window.print()} className="tap-btn flex-1 h-[52px] bg-white border-2 border-gray-200 text-gray-700 text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50">
            <ion-icon name="print-outline" style={{ fontSize: '20px' }}></ion-icon> Print Report
          </button>
          <button onClick={() => setModal({ type: 'endshift' })} className="tap-btn flex-1 h-[52px] bg-brand-red text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2">
            <ion-icon name="log-out-outline" style={{ fontSize: '20px' }}></ion-icon> End Shift & Logout
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- End shift confirm ---------- */
function EndShiftModal() {
  const { staff, endShift, setModal } = useStore()
  return (
    <div className="fixed inset-0 bg-black/70 z-[90] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <ion-icon name="log-out-outline" class="text-brand-red text-3xl"></ion-icon>
        </div>
        <h3 className="text-[18px] font-bold text-black mb-2">End shift for {staff?.name || 'Staff'}?</h3>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-5">Are you sure? This will end your shift. The register will be locked until the next staff logs in.</p>
        <div className="flex gap-3">
          <button onClick={() => setModal(null)} className="tap-btn flex-1 h-[50px] bg-gray-100 text-black text-[15px] font-medium rounded-xl">Cancel</button>
          <button onClick={endShift} className="tap-btn flex-1 h-[50px] bg-brand-red text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2">
            <ion-icon name="checkmark-outline" style={{ fontSize: '20px' }}></ion-icon> End Shift
          </button>
        </div>
      </div>
    </div>
  )
}
