import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { TR_STATUS, WH_NAME, WH_MANAGER, storeMeta, storeInitial, trLines } from '../../data/warehouseData'

const ITEMS_COLS = '0.35fr 2fr 0.75fr 0.85fr'

function PriorityBadge({ urgent }) {
  return urgent ? (
    <span className="text-[9px] font-bold text-white bg-brand-red px-2 py-0.5 rounded-full">URGENT</span>
  ) : (
    <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Normal</span>
  )
}

function TrBadge({ status }) {
  const s = TR_STATUS[status] || TR_STATUS.pending
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${s.cls}`}>{s.label}</span>
}

function Timeline({ t, inbound }) {
  const rejected = t.status === 'rejected'
  const done = (k) => ['dispatched', 'received'].includes(t.status)
  const steps = [
    { label: inbound ? 'Requested' : 'Initiated', date: t.date, icon: 'paper-plane-outline', done: true },
    { label: rejected ? 'Rejected' : 'Approved', date: rejected ? t.date : t.dispatchedOn ? t.date : null, icon: rejected ? 'close-circle-outline' : 'checkmark-circle-outline', done: done(), bad: rejected },
    { label: 'Dispatched', date: t.dispatchedOn || null, icon: 'cube-outline', done: done() },
    { label: 'Received', date: t.receivedOn || null, icon: 'checkmark-done-outline', done: t.status === 'received' },
  ]
  const shown = rejected ? steps.slice(0, 2) : steps
  return (
    <div className="bg-white rounded-xl border border-border p-4 mb-4">
      {shown.map((st, i) => {
        const dotBg = st.bad ? 'bg-brand-red' : st.done ? 'bg-brand-green' : 'bg-gray-200'
        const dotText = st.done || st.bad ? 'text-white' : 'text-gray-400'
        const labelCls = st.bad ? 'text-brand-red font-bold' : st.done ? 'text-brand-green font-semibold' : 'text-gray-400'
        return (
          <div key={i}>
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full ${dotBg} ${dotText} flex items-center justify-center shrink-0`}>
                <Icon name={st.icon} style={{ fontSize: '13px' }} />
              </div>
              <div className="flex-1"><p className={`text-[12px] ${labelCls}`}>{st.label}</p></div>
              <p className="text-[10px] text-gray-400">{st.date || '—'}</p>
            </div>
            {i < shown.length - 1 && <div className="w-px h-3 bg-gray-200 ml-3.5"></div>}
          </div>
        )
      })}
    </div>
  )
}

function Content({ t, onClose, showToast, onApprove, onReject, onReceipt, onCancel }) {
  const inbound = (t.dir || 'in') === 'in'
  const avatarName = inbound ? t.store : t.fulfilledBy || t.store
  const m = storeMeta(avatarName)
  const lines = trLines(t)
  const wasSent = ['dispatched', 'received'].includes(t.status)

  let totReq = 0
  let totSent = 0
  let sentKnown = false
  const rows = lines.map((l, i) => {
    const sent = l.dispatched != null ? l.dispatched : wasSent ? l.qty : null
    totReq += l.qty
    if (sent != null) { totSent += sent; sentKnown = true }
    return { ...l, sent, i }
  })

  const counterparty = inbound ? t.store : t.fulfilledBy || 'Unassigned'
  const routeLine = inbound ? `${t.store} → ${WH_NAME}` : `${WH_NAME} → ${counterparty}`

  const reject = () => onReject(t)
  const approve = () => onApprove(t)
  const cancelReq = () => (onCancel ? onCancel(t) : (showToast('Request cancelled.', 'info'), onClose()))
  const confirmReceipt = () => (onReceipt ? onReceipt(t) : (showToast('Receipt confirmed. Stock added.', 'success'), onClose()))

  let footer
  if (inbound) {
    if (t.status === 'pending') {
      footer = (
        <>
          <button onClick={reject} className="flex-1 py-2.5 border border-brand-red/30 bg-brand-red/10 text-brand-red rounded-xl text-[13px] font-semibold hover:bg-brand-red/20 transition flex items-center justify-center gap-1.5">
            <Icon name="close-outline" style={{ fontSize: '15px' }} />Reject
          </button>
          <button onClick={approve} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5">
            <Icon name="checkmark-outline" style={{ fontSize: '15px' }} />Approve &amp; Dispatch
          </button>
        </>
      )
    } else if (t.status === 'dispatched') {
      footer = <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-brand-orange"><Icon name="cube-outline" style={{ fontSize: '15px' }} />Awaiting receipt by {t.store}</div>
    } else {
      footer = <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Close</button>
    }
  } else {
    if (t.status === 'pending') {
      footer = <button onClick={cancelReq} className="flex-1 py-2.5 border border-brand-red/30 bg-brand-red/10 text-brand-red rounded-xl text-[13px] font-semibold hover:bg-brand-red/20 transition flex items-center justify-center gap-1.5"><Icon name="close-outline" style={{ fontSize: '15px' }} />Cancel Request</button>
    } else if (t.status === 'dispatched') {
      footer = <button onClick={confirmReceipt} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5"><Icon name="checkmark-done-outline" style={{ fontSize: '15px' }} />Confirm Receipt</button>
    } else {
      footer = <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Close</button>
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-[16px] font-extrabold text-navy-dark">Transfer — {t.id}</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{t.store} · {t.date}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '18px', color: '#64748b' }} />
        </button>
      </div>

      <div className="p-6">
        {/* Route hero */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border mb-4" style={{ background: 'rgba(0,0,0,0.015)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-extrabold text-white" style={{ background: m.color }}>{storeInitial(avatarName)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-navy-dark truncate">{routeLine}</p>
            <p className="text-[10px] text-gray-400">
              {inbound ? <>Requested by {t.requestedBy} · Fulfilled by <span className="font-semibold text-gray-500">{WH_NAME} (you)</span></> : <>Requested by {t.requestedBy} (you) · Fulfilled by <span className="font-semibold text-gray-500">{counterparty}</span></>}
            </p>
          </div>
          <div className="flex items-center gap-1.5"><PriorityBadge urgent={t.urgent} /><TrBadge status={t.status} /></div>
        </div>

        {/* Stat boxes */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center border border-border"><p className="text-[18px] font-extrabold text-navy-dark">{t.items}</p><p className="text-[10px] text-gray-400 font-medium">Items</p></div>
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center border border-border"><p className="text-[18px] font-extrabold text-navy-dark">{t.units}</p><p className="text-[10px] text-gray-400 font-medium">Units</p></div>
        </div>

        {/* Rejection note */}
        {t.status === 'rejected' && t.rejectReason && (
          <div className="flex items-start gap-2.5 bg-brand-red/5 border border-brand-red/15 rounded-xl px-4 py-3 mb-4">
            <Icon name="alert-circle-outline" style={{ fontSize: '14px', color: '#eb445a', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p className="text-[11px] font-bold text-brand-red">Rejected by {t.rejectedBy || (inbound ? WH_MANAGER : t.store)}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{t.rejectReason}</p>
            </div>
          </div>
        )}

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2">Status Timeline</p>
        <Timeline t={t} inbound={inbound} />

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2">Items — Requested vs Sent</p>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid items-center px-4 py-2 bg-gray-50/70 border-b border-border" style={{ gridTemplateColumns: ITEMS_COLS }}>
            <div></div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.06em]">Product</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.06em] text-right">Requested</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.06em] text-right">Sent</p>
          </div>
          {rows.map((l) => {
            const short = l.sent != null && l.sent < l.qty
            return (
              <div key={l.i} className="grid items-center px-4 py-2.5 border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: ITEMS_COLS }}>
                <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400">{l.i + 1}</div>
                <div className="min-w-0"><p className="text-[12px] font-semibold text-navy-dark truncate">{l.product}</p><p className="text-[10px] text-gray-400 font-mono">{l.sku}</p></div>
                <p className="text-[13px] font-bold text-navy-dark text-right">{l.qty}</p>
                <p className="text-right">
                  {l.sent == null ? (
                    <span className="text-[12px] text-gray-300 font-semibold">—</span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 text-[13px] font-extrabold ${short ? 'text-brand-orange' : 'text-brand-green'}`}>
                      {l.sent}<Icon name={short ? 'alert-circle' : 'checkmark-circle'} style={{ fontSize: '11px' }} />
                    </span>
                  )}
                </p>
              </div>
            )
          })}
          <div className="grid items-center px-4 py-2.5 bg-gray-50/70 border-t border-border" style={{ gridTemplateColumns: ITEMS_COLS }}>
            <div></div>
            <p className="text-[11px] font-bold text-navy-dark">Total</p>
            <p className="text-[13px] font-extrabold text-navy-dark text-right">{totReq}</p>
            <p className={`text-[13px] font-extrabold text-right ${sentKnown ? (totSent < totReq ? 'text-brand-orange' : 'text-brand-green') : 'text-gray-300'}`}>{sentKnown ? totSent : '—'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">{footer}</div>
    </>
  )
}

export default function TransferDetailSlideover({ transfer, onClose, onApprove, onReject, onReceipt, onCancel }) {
  const showToast = useToast()
  return <Slideover item={transfer} onClose={onClose} width={520} render={(t) => <Content t={t} onClose={onClose} showToast={showToast} onApprove={onApprove} onReject={onReject} onReceipt={onReceipt} onCancel={onCancel} />} />
}
