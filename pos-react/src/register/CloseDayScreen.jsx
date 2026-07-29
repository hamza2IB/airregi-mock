import { useMemo, useState } from 'react'
import { useStore } from './store.jsx'

const rs = (n) => `Rs.${(n || 0).toLocaleString()}`

export default function CloseDayScreen() {
  const { salesHistory, staff, shiftStartAt, openingBalance, heldSales, setScreen, setModal } = useStore()
  const now = new Date()
  const [cardTerminal, setCardTerminal] = useState('')
  const [actual, setActual] = useState('')
  const [notes, setNotes] = useState('')

  const agg = useMemo(() => {
    let cashTotal = 0, cardTotal = 0, qrTotal = 0, cashCount = 0, cardCount = 0, qrCount = 0
    let totalRefundAmount = 0, refundCount = 0, couponTotal = 0, couponCount = 0
    let pointsRsTotal = 0, pointsPtsTotal = 0, pointsCount = 0, itemDiscTotal = 0, cashRefunds = 0
    const refundMethods = new Set()
    salesHistory.forEach((tx) => {
      if (tx.method === 'cash') { cashTotal += tx.total; cashCount++ }
      else if (tx.method === 'card') { cardTotal += tx.total; cardCount++ }
      else { qrTotal += tx.total; qrCount++ }
      if ((tx.refunded || tx.partialRefund) && tx.refundAmount) { totalRefundAmount += tx.refundAmount; refundCount++; refundMethods.add({ cash: 'Cash', card: 'Card', qr: 'QR' }[tx.method] || tx.method) }
      if (tx.coupon) { couponTotal += tx.coupon.discount || 0; couponCount++ }
      if (tx.loyalty) { pointsRsTotal += tx.loyalty.discount || 0; pointsPtsTotal += tx.loyalty.pointsUsed || 0; pointsCount++ }
      if (tx.totalDiscount) itemDiscTotal += tx.totalDiscount
      if (tx.method === 'cash' && (tx.refunded || tx.partialRefund) && tx.refundType === 'refund') cashRefunds += tx.refundAmount || 0
    })
    const grossTotal = cashTotal + cardTotal + qrTotal
    const systemTotal = grossTotal - totalRefundAmount
    return { cashTotal, cardTotal, qrTotal, cashCount, cardCount, qrCount, totalRefundAmount, refundCount, couponTotal, couponCount, pointsRsTotal, pointsPtsTotal, pointsCount, itemDiscTotal, cashRefunds, grossTotal, systemTotal, refundMethods: [...refundMethods] }
  }, [salesHistory])

  const pct = (v) => (agg.systemTotal > 0 ? Math.round((v / agg.systemTotal) * 100) : 0)
  const netCash = agg.cashTotal - agg.cashRefunds
  const expected = openingBalance + netCash
  const actualNum = parseInt(actual) || 0
  const diff = actualNum - expected
  const cardTerminalNum = cardTerminal !== '' ? parseInt(cardTerminal) || 0 : null
  const cardDiff = cardTerminalNum !== null ? cardTerminalNum - agg.cardTotal : null

  const submit = () => {
    if (!actual) return
    if (heldSales.length > 0) { alert(`You have ${heldSales.length} held order${heldSales.length !== 1 ? 's' : ''}. Resume or discard them before closing.`); return }
    setModal({
      type: 'shiftReport',
      data: {
        staff: staff ? staff.name : 'Staff', staffId: staff ? staff.id : '—',
        shiftStart: shiftStartAt, shiftEnd: new Date(), register: 'Register 1',
        txCount: salesHistory.length, grossTotal: agg.grossTotal, netTotal: agg.systemTotal,
        cashTotal: agg.cashTotal, cardTotal: agg.cardTotal, qrTotal: agg.qrTotal,
        cashCount: agg.cashCount, cardCount: agg.cardCount, qrCount: agg.qrCount,
        refundCount: agg.refundCount, totalRefundAmount: agg.totalRefundAmount, refundMethods: agg.refundMethods,
        couponTotal: agg.couponTotal, couponCount: agg.couponCount, pointsRsTotal: agg.pointsRsTotal, pointsPtsTotal: agg.pointsPtsTotal, pointsCount: agg.pointsCount,
        openingBalance, cashRefunds: agg.cashRefunds, expected, actual: actualNum, difference: diff,
        cardTerminal: cardTerminalNum, cardDifference: cardDiff, notes: notes.trim(),
      },
    })
  }

  const diffBox = (value, isDiff) => {
    if (value === 0) return { cls: 'bg-green-50', text: `Rs.0 — ${isDiff ? 'Balanced' : 'Matched'} ✓`, color: 'text-brand-green' }
    if (value > 0) return { cls: 'bg-orange-50', text: `+${rs(value)} Over`, color: 'text-brand-orange' }
    return { cls: 'bg-red-50', text: `-${rs(Math.abs(value))} Short`, color: 'text-brand-red' }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-navy text-white px-5 py-3.5 flex items-center justify-between shrink-0">
        <button onClick={() => setScreen('main')} className="tap-btn px-4 py-2.5 bg-white/10 rounded-lg text-[15px] hover:bg-white/20 flex items-center gap-2 min-h-[48px]">
          <ion-icon name="arrow-back-outline" style={{ fontSize: '22px' }}></ion-icon> Back
        </button>
        <span className="text-[14px] text-white/60">{now.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className="flex-1 overflow-y-auto bg-page">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <h2 className="text-[22px] font-bold text-black mb-1">Daily Settlement</h2>
          <p className="text-[14px] text-gray-500 mb-5">{now.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <Card>
            <Head icon="person-circle-outline" title="Shift Information" />
            <div className="grid grid-cols-4 gap-4 text-[14px]">
              <Info label="Staff" value={staff ? `${staff.name} (${staff.id})` : '—'} />
              <Info label="Shift Start" value={shiftStartAt ? shiftStartAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'} />
              <Info label="Shift End" value={now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (now)'} />
              <Info label="Register" value="Register 1" />
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <TopCard icon="trending-up-outline" boxCls="bg-navy/10" iconCls="text-navy text-2xl" label="Total Sales" value={rs(agg.systemTotal)} sub={`${salesHistory.length} transactions`} />
            <TopCard icon="cash-outline" boxCls="bg-brand-green/10" iconCls="text-brand-green text-2xl" label="Cash" value={rs(agg.cashTotal)} sub={`${agg.cashCount} transactions`} />
            <TopCard icon="card-outline" boxCls="bg-brand-purple/10" iconCls="text-brand-purple text-2xl" label="Digital" value={rs(agg.cardTotal + agg.qrTotal)} sub={`${agg.cardCount + agg.qrCount} transactions`} />
          </div>

          <Card>
            <p className="text-[15px] font-semibold text-black mb-4">Payment Breakdown</p>
            <div className="space-y-4">
              <Bar textCls="text-brand-green" barCls="bg-brand-green" label="Cash" pct={pct(agg.cashTotal)} count={agg.cashCount} val={agg.cashTotal} />
              <Bar textCls="text-brand-blue" barCls="bg-brand-blue" label="Card" pct={pct(agg.cardTotal)} count={agg.cardCount} val={agg.cardTotal} />
              <Bar textCls="text-brand-purple" barCls="bg-brand-purple" label="QR Pay" pct={pct(agg.qrTotal)} count={agg.qrCount} val={agg.qrTotal} />
            </div>
            <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between"><span className="text-[14px] text-gray-500">Gross Sales</span><span className="text-[14px] font-semibold text-black">{rs(agg.grossTotal)}</span></div>
            {agg.totalRefundAmount > 0 && (
              <div className="mt-1 pt-1 flex justify-between items-center">
                <span className="text-gray-700 text-[14px]">Refunds ({agg.refundCount})</span>
                <span className="font-semibold text-brand-red text-[14px]">-{rs(agg.totalRefundAmount)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between"><span className="text-[15px] font-semibold text-black">Net Sales</span><span className="text-[16px] font-bold text-brand-green">{rs(agg.systemTotal)}</span></div>
          </Card>

          <Card>
            <Head icon="pricetags-outline" title="Discounts & Loyalty" />
            <div className="space-y-2 text-[15px]">
              <Row2 label={`Coupon Discounts (${agg.couponCount})`} value={`-${rs(agg.couponTotal)}`} color="text-brand-purple" border />
              <Row2 label={`Points Redeemed (${agg.pointsCount} tx · ${agg.pointsPtsTotal.toLocaleString()} pts)`} value={`-${rs(agg.pointsRsTotal)}`} color="text-amber-600" border />
              <Row2 label="Item Discounts / Promos" value={`-${rs(agg.itemDiscTotal)}`} color="text-brand-green" />
            </div>
          </Card>

          <Card>
            <Head icon="card-outline" title="Card Reconciliation" />
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">POS Card Sales</span><span className="font-medium text-black">{rs(agg.cardTotal)}</span></div>
              <div className="py-3">
                <label className="text-[14px] text-gray-500 block mb-2 font-medium">Card Terminal Total (optional)</label>
                <input value={cardTerminal} onChange={(e) => setCardTerminal(e.target.value)} type="number" placeholder="Enter terminal batch total..."
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 h-[56px] text-[20px] font-mono focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20" />
              </div>
              {cardDiff !== null && (() => { const b = diffBox(cardDiff, false); return (
                <div className={`py-3 px-4 rounded-xl flex justify-between items-center ${b.cls}`}>
                  <span className="text-[14px] font-medium">Card Difference</span>
                  <span className={`font-bold text-[16px] ${b.color}`}>{b.text}</span>
                </div>
              ) })()}
            </div>
          </Card>

          <Card>
            <Head icon="wallet-outline" title="Cash Drawer" />
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between items-center py-2.5 border-b border-gray-100"><span className="text-gray-500">Opening Balance</span><span className="font-medium text-black">{rs(openingBalance)}</span></div>
              <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">+ Cash In</span><span className="font-medium text-brand-green">+{rs(agg.cashTotal)}</span></div>
              <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">− Cash Out (Refunds)</span><span className="font-medium text-brand-red">-{rs(agg.cashRefunds)}</span></div>
              <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">Net Cash Sales</span><span className="font-medium text-black">{rs(netCash)}</span></div>
              <div className="flex justify-between py-2.5 border-b border-gray-200"><span className="text-black font-semibold">Expected in Drawer</span><span className="font-bold text-brand-green text-[18px]">{rs(expected)}</span></div>
              <div className="py-3">
                <label className="text-[14px] text-gray-500 block mb-2 font-medium">Actual Cash Count</label>
                <input value={actual} onChange={(e) => setActual(e.target.value)} type="number" placeholder="Count the cash..."
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 h-[56px] text-[20px] font-mono focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20" />
              </div>
              {actual !== '' && (() => { const b = diffBox(diff, true); return (
                <div className={`py-3 px-4 rounded-xl flex justify-between items-center ${b.cls}`}>
                  <span className="text-[14px] font-medium">Difference</span>
                  <span className={`font-bold text-[16px] ${b.color}`}>{b.text}</span>
                </div>
              ) })()}
            </div>
          </Card>

          <Card mb="mb-6">
            <label className="text-[14px] text-gray-500 block mb-2 font-medium">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any remarks..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-navy resize-none" />
          </Card>
        </div>
      </div>
      <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <button onClick={submit} className="tap-btn w-full h-[58px] bg-brand-red text-white text-[17px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-200">
            <ion-icon name="lock-closed-outline" style={{ fontSize: '22px' }}></ion-icon> Close Day
          </button>
        </div>
      </div>
    </div>
  )
}

function Card({ children, mb = 'mb-5' }) { return <div className={`bg-white rounded-xl border border-gray-200 p-5 ${mb}`}>{children}</div> }
function Head({ icon, title }) {
  return <div className="flex items-center gap-2 mb-4"><ion-icon name={icon} class="text-navy text-2xl"></ion-icon><p className="text-[15px] font-semibold text-black">{title}</p></div>
}
function Info({ label, value }) {
  return <div><p className="text-[12px] text-gray-400 uppercase font-medium mb-1">{label}</p><p className="font-semibold text-black">{value}</p></div>
}
function TopCard({ icon, boxCls, iconCls, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-11 h-11 ${boxCls} rounded-xl flex items-center justify-center mb-3`}><ion-icon name={icon} class={iconCls}></ion-icon></div>
      <p className="text-[13px] text-gray-500 uppercase font-medium">{label}</p>
      <p className="text-[26px] font-bold text-black mt-1">{value}</p>
      <p className="text-[13px] text-gray-400 mt-1">{sub}</p>
    </div>
  )
}
function Bar({ textCls, barCls, label, pct, count, val }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[14px] font-medium ${textCls}`}>{label} ({pct}%) · {count} tx</span>
        <span className="text-[14px] font-semibold text-black">{rs(val)}</span>
      </div>
      <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${barCls} rounded-full transition-all`} style={{ width: pct + '%' }} /></div>
    </div>
  )
}
function Row2({ label, value, color, border }) {
  return (
    <div className={`flex justify-between py-2 ${border ? 'border-b border-gray-100' : ''}`}>
      <span className="text-gray-500">{label}</span><span className={`font-medium ${color}`}>{value}</span>
    </div>
  )
}
