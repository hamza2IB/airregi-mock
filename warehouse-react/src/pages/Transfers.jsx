import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import TransferDetailSlideover from '../components/transfers/TransferDetailSlideover'
import DispatchModal from '../components/transfers/DispatchModal'
import RejectTransferModal from '../components/transfers/RejectTransferModal'
import NewStockRequestModal from '../components/transfers/NewStockRequestModal'
import { TRANSFER_DATA, TR_STATUS, INV_DATA, WH_NAME, WH_MANAGER, trLines } from '../data/warehouseData'

const TR_PAGE = 10
const COLS = '0.9fr 1.5fr 0.9fr 0.5fr 0.5fr 0.75fr 0.9fr 2.3fr'

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

function KpiCard({ icon, iconBg, iconColor, value, valueCls, label, onClick }) {
  return (
    <div className={`bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={iconColor} size={18} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function Transfers() {
  const showToast = useToast()
  const [transfers, setTransfers] = useState(TRANSFER_DATA)
  const [dir, setDir] = useState('in')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [view, setView] = useState(null)
  const [dispatchFor, setDispatchFor] = useState(null)
  const [rejectFor, setRejectFor] = useState(null)
  const [newReqOpen, setNewReqOpen] = useState(false)

  const patch = (id, p) => setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, ...p } : t)))

  const dataset = useMemo(() => transfers.filter((t) => (t.dir || 'in') === dir), [transfers, dir])

  const kpis = {
    pending: dataset.filter((t) => t.status === 'pending').length,
    transit: dataset.filter((t) => t.status === 'dispatched').length,
    received: dataset.filter((t) => t.status === 'received').length,
    rejected: dataset.filter((t) => t.status === 'rejected').length,
  }
  const inboundPending = transfers.filter((t) => (t.dir || 'in') === 'in' && t.status === 'pending').length

  const data = useMemo(() => {
    const q = search.toLowerCase()
    return dataset.filter((t) => {
      const cp = dir === 'in' ? t.store : t.fulfilledBy || ''
      const ms = !q || t.id.toLowerCase().includes(q) || cp.toLowerCase().includes(q)
      const mf = filter === 'all' || t.status === filter
      return ms && mf
    })
  }, [dataset, dir, search, filter])

  const total = data.length
  const pages = Math.ceil(total / TR_PAGE) || 1
  const curPage = Math.min(page, pages)
  const items = data.slice((curPage - 1) * TR_PAGE, curPage * TR_PAGE)

  const pills = useMemo(() => {
    const maxPills = 5
    let start = Math.max(1, curPage - Math.floor(maxPills / 2))
    let end = Math.min(pages, start + maxPills - 1)
    if (end - start < maxPills - 1) start = Math.max(1, end - maxPills + 1)
    const arr = []
    for (let i = start; i <= end; i++) arr.push(i)
    return arr
  }, [curPage, pages])

  const switchDir = (d) => { setDir(d); setFilter('all'); setPage(1) }
  const setTab = (f) => { setFilter(f); setPage(1) }

  // ── Actions ──
  const approveTransfer = (t) => { setView(null); setDispatchFor(t) }
  const rejectTransferOpen = (t) => { setView(null); setRejectFor(t) }

  const confirmDispatch = (t, lines, totalUnits, reqTotal) => {
    lines.forEach((l) => {
      if (!l.dispatched) return
      const item = INV_DATA.find((i) => i.sku === l.sku)
      if (item) item.onHand = Math.max(0, item.onHand - l.dispatched)
    })
    const partial = totalUnits < reqTotal
    patch(t.id, { status: 'dispatched', approvedBy: WH_MANAGER, dispatchedOn: 'Jul 21, 2026', partial, requestedUnits: reqTotal, units: totalUnits, lines })
    setDispatchFor(null)
    showToast(partial ? `${t.id} partially dispatched — ${totalUnits} of ${reqTotal} units sent to ${t.store}.` : `${t.id} approved — ${totalUnits} units dispatched to ${t.store}.`, partial ? 'info' : 'success')
  }

  const confirmRejectTransfer = (t, label, note) => {
    patch(t.id, { status: 'rejected', rejectedBy: WH_MANAGER, rejectReason: label + (note ? ` — ${note}` : '') })
    setRejectFor(null)
    showToast(`${t.id} rejected — "${label}". ${t.store} notified.`, 'info')
  }

  const confirmReceipt = (t) => {
    trLines(t).forEach((l) => {
      const qty = l.dispatched != null ? l.dispatched : l.qty
      if (!qty) return
      const item = INV_DATA.find((i) => i.sku === l.sku)
      if (item) item.onHand += qty
    })
    patch(t.id, { status: 'received', receivedOn: 'Jul 21, 2026' })
    setView(null)
    showToast(`${t.id} received — units added to warehouse stock.`, 'success')
  }

  const cancelRequest = (t) => {
    patch(t.id, { status: 'cancelled' })
    setView(null)
    showToast(`${t.id} cancelled. ${t.fulfilledBy || 'The fulfiller'} has been notified.`, 'info')
  }

  const submitNewRequest = ({ fulfilledBy, lines, urgent, units, items: itemCount }) => {
    const maxN = transfers.reduce((mx, t) => {
      const n = parseInt((t.id || '').replace('TR-2026-', ''), 10)
      return isNaN(n) ? mx : Math.max(mx, n)
    }, 53)
    const id = 'TR-2026-' + String(maxN + 1).padStart(3, '0')
    const rec = {
      id, dir: 'out', store: WH_NAME, fulfilledBy, date: 'Jul 21, 2026', items: itemCount, units,
      status: 'pending', urgent, requestedBy: WH_MANAGER, approvedBy: null, rejectedBy: null, rejectReason: null,
      lines: lines.map((l) => ({ ...l })),
    }
    setTransfers((prev) => [rec, ...prev])
    setNewReqOpen(false)
    setDir('out')
    setFilter('all')
    setPage(1)
    showToast(`${id} sent to ${fulfilledBy} — ${units} units requested.`, 'success')
  }

  const dirBtn = (active) =>
    active
      ? 'tr-dir-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold bg-navy text-white transition'
      : 'tr-dir-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold bg-white border border-border text-gray-500 hover:text-navy hover:border-navy/30 transition'

  const TABS = [
    { k: 'all', label: 'All' },
    { k: 'pending', label: dir === 'in' ? 'To Approve' : 'Pending' },
    { k: 'dispatched', label: dir === 'in' ? 'Dispatched' : 'In Transit' },
    { k: 'received', label: 'Received' },
    { k: 'rejected', label: 'Rejected' },
  ]

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Purpose banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" size={15} style={{ color: '#3366cc', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-navy-dark">Replenishment transfers between the Central Warehouse and your stores.</strong> Review incoming store requests and approve &amp; dispatch (send what you can), or raise your own stock requests to pull stock in. Track each one from pending → in transit → received.
        </p>
      </div>

      {/* Direction toggle */}
      <div className="flex items-center gap-2 mb-5 max-md:flex-col max-md:items-stretch">
        <button onClick={() => switchDir('in')} className={dirBtn(dir === 'in')}>
          <Icon name="arrow-down-circle-outline" size={16} />Incoming · Requests to Fulfil
          {inboundPending > 0 && <span className="ml-0.5 text-[9px] font-bold bg-brand-purple text-white px-1.5 py-0.5 rounded-full">{inboundPending}</span>}
        </button>
        <button onClick={() => switchDir('out')} className={dirBtn(dir === 'out')}>
          <Icon name="arrow-up-circle-outline" size={16} />Outgoing · My Requests
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="hourglass-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" value={kpis.pending} valueCls="text-brand-purple" label={dir === 'in' ? 'To Approve' : 'Pending'} onClick={() => setTab('pending')} />
        <KpiCard icon="cube-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpis.transit} valueCls="text-brand-orange" label={dir === 'in' ? 'Dispatched' : 'In Transit'} onClick={() => setTab('dispatched')} />
        <KpiCard icon="checkmark-circle-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={kpis.received} valueCls="text-brand-green" label="Received" />
        <KpiCard icon="close-circle-outline" iconBg="bg-brand-red/10" iconColor="text-brand-red" value={kpis.rejected} valueCls="text-brand-red" label="Rejected" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search store, transfer #…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`px-3 py-1.5 text-[11px] transition ${filter === t.k ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {dir === 'out' && (
            <div className="ml-auto shrink-0">
              <button onClick={() => setNewReqOpen(true)} className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition">
                <Icon name="paper-plane-outline" size={16} /> New Stock Request
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[1120px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Transfer #</div>
              <div>{dir === 'in' ? 'From (Store)' : 'To (Fulfils)'}</div>
              <div>Requested</div>
              <div className="text-right">Items</div>
              <div className="text-right">Units</div>
              <div className="text-center">Priority</div>
              <div className="text-center">Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <Icon name="swap-horizontal-outline" size={30} style={{ color: '#cbd5e1' }} />
              <p className="text-[13px] text-gray-400 mt-2">{dir === 'in' ? 'No incoming requests to fulfil' : 'No outgoing transfers found'}</p>
            </div>
          ) : (
            items.map((t) => {
              const cp = dir === 'in' ? t.store : t.fulfilledBy || 'Unassigned'
              return (
                <div key={t.id} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
                  <p className="text-[12px] font-mono font-semibold text-brand-blue">{t.id}</p>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon name={dir === 'in' ? 'storefront-outline' : 'business-outline'} size={12} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <p className="text-[11px] font-medium text-navy-dark truncate">{cp}</p>
                  </div>
                  <p className="text-[11px] text-gray-500">{t.date}</p>
                  <p className="text-[13px] font-bold text-navy-dark text-right">{t.items}</p>
                  <p className="text-[13px] font-bold text-navy-dark text-right">{t.units}</p>
                  <div className="text-center"><PriorityBadge urgent={t.urgent} /></div>
                  <div className="text-center"><TrBadge status={t.status} /></div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <button onClick={() => setView(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap">
                      <Icon name="eye-outline" size={12} />View
                    </button>
                    {dir === 'in' && t.status === 'pending' && (
                      <>
                        <button onClick={() => approveTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                          <Icon name="checkmark-outline" size={12} />Approve &amp; Dispatch
                        </button>
                        <button onClick={() => rejectTransferOpen(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition shrink-0 whitespace-nowrap">
                          <Icon name="close-outline" size={12} />Reject
                        </button>
                      </>
                    )}
                    {dir === 'in' && t.status === 'dispatched' && <span className="text-[9px] text-brand-orange italic">Awaiting receipt</span>}
                    {dir === 'out' && t.status === 'dispatched' && (
                      <button onClick={() => confirmReceipt(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                        <Icon name="checkmark-done-outline" size={12} />Confirm Receipt
                      </button>
                    )}
                    {dir === 'out' && t.status === 'pending' && (
                      <button onClick={() => cancelRequest(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition shrink-0 whitespace-nowrap">
                        <Icon name="close-outline" size={12} />Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
            </div>
          </div>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {total ? `Showing ${Math.min((curPage - 1) * TR_PAGE + 1, total)}–${Math.min(curPage * TR_PAGE, total)} of ${total}` : 'Showing 0 of 0'}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy transition">
              <Icon name="chevron-back-outline" size={13} />
            </button>
            {pills.map((i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-lg border text-[11px] font-semibold transition ${i === curPage ? 'bg-navy text-white border-navy' : 'border-border bg-white text-gray-500 hover:border-navy/30 hover:text-navy'}`}
              >
                {i}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy transition">
              <Icon name="chevron-forward-outline" size={13} />
            </button>
          </div>
        </div>
      </div>

      <TransferDetailSlideover
        transfer={view}
        onClose={() => setView(null)}
        onApprove={approveTransfer}
        onReject={rejectTransferOpen}
        onReceipt={confirmReceipt}
        onCancel={cancelRequest}
      />
      <DispatchModal transfer={dispatchFor} onClose={() => setDispatchFor(null)} onConfirm={confirmDispatch} />
      <RejectTransferModal transfer={rejectFor} onClose={() => setRejectFor(null)} onConfirm={confirmRejectTransfer} />
      <NewStockRequestModal open={newReqOpen} onClose={() => setNewReqOpen(false)} onSubmit={submitNewRequest} />
    </div>
  )
}
