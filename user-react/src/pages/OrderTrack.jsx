import { useState } from 'react'
import Icon from '../components/Icon'
import ImgCell from '../components/ImgCell'
import StoreLogo from '../components/StoreLogo'
import { BUSINESSES, PID, money, unitPrice, imgUrl } from '../data/catalog'
import { TRACK_STEPS } from '../data/ordersData'
import { useApp } from '../store'

const TRACK_DESC = {
  Confirmed: 'Your order has been placed and confirmed',
  Packing: 'The store is preparing your items',
  Shipped: 'Your order is on its way',
  Delivered: 'Order delivered',
}

const REPORT_REASONS = ['Item missing from order', 'Item damaged', 'Wrong item received', 'Item quality issue', 'Other']
const RETURN_REASONS = ['Changed my mind', 'Wrong size / fit', 'Damaged or defective', 'Not as described', 'Other']
const CANCEL_REASONS = ['Ordered by mistake', 'Found it cheaper elsewhere', 'Delivery taking too long', 'Changed my mind', 'Other']

export default function OrderTrack() {
  const { route, orders, back, openStore, openProduct, openSettings, go, addresses, addMyIssue, cancelOrder, showToast } = useApp()
  const o = orders.find((x) => x.id === route.orderId)
  const [sheet, setSheet] = useState(null) // null | 'menu' | 'contact' | 'report' | 'return' | 'cancel'
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  if (!o) return null
  const b = BUSINESSES.find((x) => x.id === o.bizId)
  const cur = TRACK_STEPS.findIndex((s) => s.key === o.status)
  const lines = o.lines.map((l) => (PID[l.pid] ? { ...l, p: PID[l.pid].p, b: PID[l.pid].b } : null)).filter(Boolean)
  const addr = addresses.find((a) => a.def) || addresses[0]
  const canCancel = ['Confirmed', 'Packing'].includes(o.status)
  const delivered = o.status === 'Delivered'

  const openSheet = (v) => { setReason(''); setNote(''); setSheet(v) }
  const submitForm = (kind) => {
    if (!reason) return showToast('Please select a reason')
    addMyIssue(kind, reason, note, o)
    setSheet(null)
    showToast(kind === 'return' ? 'Return request sent — track it in My requests' : 'Problem reported — track it in My requests')
  }
  const confirmCancel = () => {
    if (!reason) return showToast('Please select a reason')
    cancelOrder(o.id, reason)
    setSheet(null)
    go('orders')
  }

  return (
    <div className="screen">
      <div className="sticky top-0 z-40 bg-white border-b border-border px-4 pt-11 pb-3 flex items-center gap-3">
        <button onClick={back} className="w-9 h-9 rounded-xl bg-page border border-border flex items-center justify-center press shrink-0"><Icon name="chevron-back-outline" className="text-navy" style={{ fontSize: '17px' }} /></button>
        <div className="flex-1 min-w-0"><h1 className="text-[16px] font-extrabold text-navy-dark leading-tight">Track order</h1><p className="text-[10.5px] text-gray-400 leading-tight truncate">{o.id} · {o.biz}</p></div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-5 text-white relative overflow-hidden mb-4">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4"></div>
          <div className="relative z-10">
            <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">Current status</p>
            <p className="text-[22px] font-extrabold mt-0.5">{o.status}</p>
            <p className="text-[12px] text-white/70 mt-1">{TRACK_DESC[o.status] || ''}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4 mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-3">Progress</p>
          {TRACK_STEPS.map((s, i) => {
            const done = i < cur, current = i === cur, reached = i <= cur, isLast = i === TRACK_STEPS.length - 1
            const nodeBg = reached ? (current ? '#1a2d6b' : '#2dd36f') : '#fff'
            const nodeBorder = reached ? nodeBg : '#e2e8f0'
            const nodeColor = reached ? '#fff' : '#cbd5e1'
            return (
              <div key={s.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${current ? 'ring-4 ring-navy/15' : ''}`} style={{ background: nodeBg, border: `2px solid ${nodeBorder}` }}>
                    <Icon name={done ? 'checkmark-outline' : s.icon} style={{ fontSize: '16px', color: nodeColor }} />
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 my-1" style={{ minHeight: '26px', background: i < cur ? '#2dd36f' : '#e8ecf1' }}></div>}
                </div>
                <div className="pb-5">
                  <p className={`text-[13px] font-bold ${reached ? 'text-navy-dark' : 'text-gray-400'}`}>{s.key}{current && <span className="ml-2 text-[9px] font-bold bg-navy text-white px-2 py-0.5 rounded-full align-middle">Current</span>}</p>
                  <p className={`text-[11px] mt-0.5 leading-snug ${reached ? 'text-gray-500' : 'text-gray-400'}`}>{TRACK_DESC[s.key]}</p>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={() => openStore(b.id)} className="press w-full flex items-center gap-3 bg-white rounded-2xl border border-border p-3.5 mb-4 text-left">
          <StoreLogo b={b} size={40} />
          <div className="flex-1 min-w-0"><p className="text-[13px] font-bold text-navy-dark truncate">{b.name}</p><p className="text-[11px] text-gray-400">Sold & shipped by store</p></div>
          <Icon name="chevron-forward" className="text-gray-300" style={{ fontSize: '15px' }} />
        </button>

        {addr && (
          <div className="bg-white rounded-2xl border border-border p-4 mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2">Delivery address</p>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-page flex items-center justify-center shrink-0"><Icon name={addr.label === 'Office' ? 'business-outline' : 'home-outline'} className="text-navy" style={{ fontSize: '18px' }} /></div>
              <div className="flex-1 min-w-0"><p className="text-[12.5px] font-bold text-navy-dark">{addr.label}</p><p className="text-[12px] text-gray-600 leading-snug">{addr.line}, {addr.city}</p><p className="text-[11px] text-gray-400 mt-0.5">{addr.name} · {addr.phone}</p></div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-4">
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em]">Items ({lines.length})</p>
          {lines.map((l) => (
            <div key={l.pid} onClick={() => openProduct(l.pid)} className="press cursor-pointer flex items-center gap-3 px-4 py-2.5 border-t border-border">
              <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0"><ImgCell src={imgUrl(l.p)} cat={l.p.cat} color={l.b.color} width="100%" height={44} /></div>
              <div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-navy-dark truncate">{l.p.name}</p><p className="text-[10.5px] text-gray-400">{money(unitPrice(l.p))} × {l.qty}</p></div>
              <span className="text-[12px] font-bold text-navy-dark tnum shrink-0">{money(unitPrice(l.p) * l.qty)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-gray-50/60"><span className="text-[12px] font-bold text-navy-dark">Order total</span><span className="text-[14px] font-extrabold text-navy-dark tnum">{money(o.total)}</span></div>
        </div>

        <button onClick={() => openSheet('menu')} className="press w-full h-11 bg-white border border-border text-navy-dark rounded-xl text-[13px] font-bold flex items-center justify-center gap-2"><Icon name="help-buoy-outline" style={{ fontSize: '17px' }} />Need help with this order?</button>
        <div className="h-4"></div>
      </div>

      {/* ── Order Help bottom sheet ── */}
      <div className={`${sheet ? 'show' : ''}`} id="sheet-backdrop" onClick={() => setSheet(null)}></div>
      <div id="sheet" className={sheet ? 'open' : ''}>
        <div className="sheet-handle"></div>
        {sheet === 'menu' && (
          <>
            <div className="px-5 pt-1 pb-3"><p className="text-[16px] font-extrabold text-navy-dark">Need help?</p><p className="text-[11.5px] text-gray-400 tnum">{o.id} · {b.name}</p></div>
            <div className="mx-4 mb-3 bg-white border border-border rounded-2xl overflow-hidden">
              <HelpOpt icon="chatbubbles-outline" color="#3366cc" title="Contact the store" sub={`Reach ${b.name} about this order`} onClick={() => setSheet('contact')} />
              <HelpOpt icon="alert-circle-outline" color="#ff9800" title="Report a problem" sub="Missing, damaged or wrong item" onClick={() => openSheet('report')} />
              {delivered && <HelpOpt icon="arrow-undo-outline" color="#7c4dff" title="Request return / refund" sub="Start a return for this order" onClick={() => openSheet('return')} />}
              {canCancel && <HelpOpt icon="close-circle-outline" color="#eb445a" title="Cancel order" sub="Cancel before it ships" onClick={() => openSheet('cancel')} />}
              <HelpOpt icon="chatbox-ellipses-outline" color="#1a2d6b" title="My requests" sub="See problems & returns you raised" onClick={() => { setSheet(null); openSettings('myissues') }} />
              <HelpOpt icon="help-circle-outline" color="#2dd36f" title="Help center" sub="Delivery, payments & returns FAQ" onClick={() => { setSheet(null); openSettings('help') }} />
            </div>
            <div className="px-4 pb-5"><button onClick={() => setSheet(null)} className="press w-full h-11 rounded-xl border border-border text-gray-500 text-[13px] font-bold">Close</button></div>
          </>
        )}

        {sheet === 'contact' && (
          <>
            <div className="px-5 pt-1 pb-3 flex items-center gap-2.5">
              <button onClick={() => setSheet('menu')} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center press shrink-0"><Icon name="chevron-back-outline" style={{ fontSize: '16px', color: '#64748b' }} /></button>
              <div className="min-w-0"><p className="text-[15px] font-extrabold text-navy-dark truncate">Contact {b.name}</p><p className="text-[11px] text-gray-400 tnum">Order {o.id}</p></div>
            </div>
            <div className="mx-4 mb-4 bg-white border border-border rounded-2xl overflow-hidden">
              <ContactRow icon="call-outline" title="Call store" val="+92 42 111 222 333" onClick={() => showToast('Calling ' + b.name)} />
              <ContactRow icon="logo-whatsapp" title="WhatsApp" val="Chat on WhatsApp" onClick={() => showToast('Opening WhatsApp')} />
            </div>
          </>
        )}

        {(sheet === 'report' || sheet === 'return') && (
          <>
            <div className="px-5 pt-1 pb-3 flex items-center gap-2.5">
              <button onClick={() => setSheet('menu')} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center press shrink-0"><Icon name="chevron-back-outline" style={{ fontSize: '16px', color: '#64748b' }} /></button>
              <div className="min-w-0"><p className="text-[15px] font-extrabold text-navy-dark truncate">{sheet === 'report' ? 'Report a problem' : 'Request return / refund'}</p><p className="text-[11px] text-gray-400 tnum">{o.id} · {o.biz}</p></div>
            </div>
            <div className="px-4 space-y-3">
              <div><label className="slbl">Reason</label>
                <select className="sinp" value={reason} onChange={(e) => setReason(e.target.value)}>
                  <option value="">Select a reason…</option>
                  {(sheet === 'report' ? REPORT_REASONS : RETURN_REASONS).map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label className="slbl">Details <span className="text-gray-300 font-normal">(optional)</span></label><textarea rows="3" className="sinp resize-none" placeholder="Tell the store what happened…" value={note} onChange={(e) => setNote(e.target.value)} /></div>
            </div>
            <div className="px-4 py-4"><button onClick={() => submitForm(sheet)} className="press w-full h-12 bg-navy text-white rounded-xl text-[14px] font-bold">{sheet === 'report' ? 'Submit report' : 'Request return'}</button></div>
          </>
        )}

        {sheet === 'cancel' && (
          <>
            <div className="px-5 pt-1 pb-3"><p className="text-[15px] font-extrabold text-navy-dark">Cancel order?</p><p className="text-[11px] text-gray-400 tnum">{o.id} · {o.biz}</p></div>
            <div className="px-4">
              <div className="flex items-start gap-2.5 bg-brand-red/5 border border-brand-red/15 rounded-xl px-4 py-3 mb-3">
                <Icon name="warning-outline" style={{ fontSize: '14px', color: '#eb445a', flexShrink: 0, marginTop: '1px' }} />
                <p className="text-[11px] text-gray-600 leading-relaxed">The store will be notified and any payment is refunded per its policy.</p>
              </div>
              <label className="slbl">Reason</label>
              <select className="sinp" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="">Select a reason…</option>
                {CANCEL_REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="px-4 py-4 flex gap-2">
              <button onClick={() => setSheet('menu')} className="press flex-1 h-12 border border-border rounded-xl text-[13px] font-bold text-gray-600">Keep order</button>
              <button onClick={confirmCancel} className="press flex-1 h-12 bg-brand-red text-white rounded-xl text-[13px] font-bold">Cancel order</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function HelpOpt({ icon, color, title, sub, onClick }) {
  return (
    <button onClick={onClick} className="press w-full flex items-center gap-3 px-4 py-3.5 text-left border-t border-border first:border-0">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}><Icon name={icon} style={{ fontSize: '18px', color }} /></div>
      <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-navy-dark">{title}</p><p className="text-[11px] text-gray-400">{sub}</p></div>
      <Icon name="chevron-forward" className="text-gray-300 shrink-0" style={{ fontSize: '15px' }} />
    </button>
  )
}
function ContactRow({ icon, title, val, onClick }) {
  return (
    <button onClick={onClick} className="press w-full flex items-center gap-3 px-4 py-3.5 text-left border-t border-border first:border-0">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#2dd36f18' }}><Icon name={icon} style={{ fontSize: '18px', color: '#2dd36f' }} /></div>
      <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-navy-dark">{title}</p><p className="text-[11px] text-gray-400">{val}</p></div>
    </button>
  )
}
