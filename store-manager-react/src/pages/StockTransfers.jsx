import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { SM_TR_STATUS, trParty } from '../data/transferData'
import { useTransferActions } from '../hooks/useTransferActions'
import TransferDetailSlideover from '../components/transfers/TransferDetailSlideover'
import DispatchModal from '../components/transfers/DispatchModal'
import RejectTransferModal from '../components/transfers/RejectTransferModal'
import NewStockRequestModal from '../components/inventory/NewStockRequestModal'

const COLS = '1fr 1.4fr 0.85fr 0.5fr 0.5fr 0.7fr 0.85fr 1.35fr'
const PAGE_SIZE = 10

function Kpi({ icon, iconBg, iconColor, value, valueCls, label, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3 ${onClick ? 'cursor-pointer hover:shadow-sm transition' : ''}`}>
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={iconColor} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function PriorityBadge({ urgent }) {
  return urgent
    ? <span className="text-[9px] font-bold text-white bg-brand-red px-2 py-0.5 rounded-full">URGENT</span>
    : <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Normal</span>
}

export default function StockTransfers({ inv, transfers, patchTransfer, adjustStock, addMovements, submitStockRequest }) {
  const [dir, setDir] = useState('out') // 'out' = my requests · 'in' = requests to fulfil
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [requestFor, setRequestFor] = useState(null)

  const tr = useTransferActions({ patchTransfer, adjustStock, addMovements })
  const availOf = (sku) => inv.find((i) => i.sku === sku)?.onHand ?? 0

  const dataset = useMemo(() => transfers.filter((t) => (t.dir || 'in') === dir), [transfers, dir])

  const kpi = {
    pending: dataset.filter((t) => t.status === 'pending').length,
    transit: dataset.filter((t) => t.status === 'dispatched').length,
    received: dataset.filter((t) => t.status === 'received').length,
    rejected: dataset.filter((t) => t.status === 'rejected').length,
  }
  const inboundPending = transfers.filter((t) => (t.dir || 'in') === 'in' && t.status === 'pending').length

  const pendingLbl = dir === 'out' ? 'Pending' : 'To Approve'
  const transitLbl = dir === 'out' ? 'In Transit' : 'Dispatched'
  const col2Lbl = dir === 'out' ? 'To (Fulfils)' : 'From (Branch)'

  const TABS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: pendingLbl },
    { key: 'dispatched', label: transitLbl },
    { key: 'received', label: 'Received' },
    { key: 'rejected', label: 'Rejected' },
  ]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return dataset.filter((t) => {
      const party = trParty(t).toLowerCase()
      const matchS = !q || t.id.toLowerCase().includes(q) || party.includes(q)
      const matchF = filter === 'all' || t.status === filter
      return matchS && matchF
    })
  }, [dataset, search, filter])

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const curPage = Math.min(page, pages)
  const pageItems = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE)

  const switchDir = (d) => { setDir(d); setFilter('all'); setPage(1); setSearch('') }
  const setFilterReset = (f) => { setFilter(f); setPage(1) }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Purpose banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-navy-dark">Replenishment transfers between your branch and the Central Warehouse (or another branch).</strong> Raise a request, track it from pending → in transit → received, and confirm receipt when a shipment arrives to add the units to your stock.
        </p>
      </div>

      {/* Direction toggle */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <button onClick={() => switchDir('out')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold transition ${dir === 'out' ? 'bg-navy text-white' : 'bg-white border border-border text-gray-500 hover:text-navy hover:border-navy/30'}`}>
          <Icon name="arrow-up-circle-outline" style={{ fontSize: '16px' }} />Outgoing · My Requests
        </button>
        <button onClick={() => switchDir('in')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold transition ${dir === 'in' ? 'bg-navy text-white' : 'bg-white border border-border text-gray-500 hover:text-navy hover:border-navy/30'}`}>
          <Icon name="arrow-down-circle-outline" style={{ fontSize: '16px' }} />Incoming · Requests to Fulfil
          {inboundPending > 0 && <span className="ml-0.5 text-[9px] font-bold bg-brand-purple text-white px-1.5 py-0.5 rounded-full">{inboundPending}</span>}
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon="hourglass-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" value={kpi.pending} valueCls="text-brand-purple" label={pendingLbl} onClick={() => setFilterReset('pending')} />
        <Kpi icon="cube-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpi.transit} valueCls="text-brand-orange" label={transitLbl} onClick={() => setFilterReset('dispatched')} />
        <Kpi icon="checkmark-circle-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={kpi.received} valueCls="text-brand-green" label="Received" onClick={() => setFilterReset('received')} />
        <Kpi icon="close-circle-outline" iconBg="bg-brand-red/10" iconColor="text-brand-red" value={kpi.rejected} valueCls="text-brand-red" label="Rejected" onClick={() => setFilterReset('rejected')} />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} type="text" placeholder="Search transfer #, branch…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setFilterReset(t.key)} className={`px-3 py-1.5 text-[11px] transition whitespace-nowrap ${filter === t.key ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}>{t.label}</button>
            ))}
          </div>
          {dir === 'out' && (
            <div className="ml-auto shrink-0">
              <button onClick={() => setRequestFor({})} className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition">
                <Icon name="paper-plane-outline" style={{ fontSize: '16px' }} /> New Stock Request
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[880px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Transfer #</div><div>{col2Lbl}</div><div>Requested</div>
              <div className="text-right">Items</div><div className="text-right">Units</div>
              <div className="text-center">Priority</div><div className="text-center">Status</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {pageItems.length === 0 ? (
                <div className="py-16 text-center">
                  <Icon name="swap-horizontal-outline" size={30} style={{ color: '#cbd5e1' }} />
                  <p className="text-[13px] text-gray-400 mt-2">{dir === 'out' ? 'No stock requests found' : 'No incoming requests to fulfil'}</p>
                </div>
              ) : (
                pageItems.map((t) => {
                  const st = SM_TR_STATUS[t.status] || SM_TR_STATUS.pending
                  const party = trParty(t)
                  const isWH = party === 'Central Warehouse'
                  const outgoing = t.dir === 'out'
                  return (
                    <div key={t.id} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
                      <p className="text-[12px] font-mono font-semibold text-brand-blue">{t.id}</p>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon name={isWH ? 'business-outline' : 'storefront-outline'} style={{ fontSize: '13px', color: isWH ? '#3366cc' : '#7c4dff', flexShrink: 0 }} />
                        <p className="text-[11px] font-medium text-navy-dark truncate">{party}</p>
                      </div>
                      <p className="text-[11px] text-gray-500">{t.date}</p>
                      <p className="text-[13px] font-bold text-navy-dark text-right">{t.items}</p>
                      <p className="text-[13px] font-bold text-navy-dark text-right">{t.units}</p>
                      <div className="text-center"><PriorityBadge urgent={t.urgent} /></div>
                      <div className="text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${st.cls}`}>{st.label}</span></div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => tr.setViewTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap">
                          <Icon name="eye-outline" style={{ fontSize: '12px' }} />View
                        </button>
                        {outgoing && t.status === 'dispatched' && (
                          <button onClick={() => tr.confirmReceipt(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                            <Icon name="checkmark-done-outline" style={{ fontSize: '12px' }} />Confirm Receipt
                          </button>
                        )}
                        {outgoing && t.status === 'pending' && (
                          <button onClick={() => tr.cancelTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition shrink-0 whitespace-nowrap">
                            <Icon name="close-outline" style={{ fontSize: '12px' }} />Cancel
                          </button>
                        )}
                        {!outgoing && t.status === 'pending' && (
                          <>
                            <button onClick={() => tr.approveTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                              <Icon name="checkmark-outline" style={{ fontSize: '12px' }} />Approve &amp; Dispatch
                            </button>
                            <button onClick={() => tr.rejectTransferOpen(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition shrink-0 whitespace-nowrap">
                              <Icon name="close-outline" style={{ fontSize: '12px' }} />Reject
                            </button>
                          </>
                        )}
                        {!outgoing && t.status === 'dispatched' && (
                          <span className="text-[9px] text-brand-orange italic whitespace-nowrap">Awaiting receipt</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">{total ? `Showing ${(curPage - 1) * PAGE_SIZE + 1}–${Math.min(curPage * PAGE_SIZE, total)} of ${total}` : 'Showing 0 of 0'}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={curPage === 1} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition disabled:opacity-40"><Icon name="chevron-back-outline" style={{ fontSize: '13px' }} /></button>
            {Array.from({ length: pages }, (_, idx) => idx + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-[11px] font-semibold flex items-center justify-center transition ${p === curPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={curPage === pages} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition disabled:opacity-40"><Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} /></button>
          </div>
        </div>
      </div>

      <TransferDetailSlideover transfer={tr.viewTransfer} onClose={() => tr.setViewTransfer(null)} onApprove={tr.approveTransfer} onReject={tr.rejectTransferOpen} onReceipt={tr.confirmReceipt} onCancel={tr.cancelTransfer} />
      <DispatchModal transfer={tr.dispatchFor} onClose={() => tr.setDispatchFor(null)} onConfirm={tr.confirmDispatch} availOf={availOf} />
      <RejectTransferModal transfer={tr.rejectTransferFor} onClose={() => tr.setRejectTransferFor(null)} onConfirm={tr.confirmRejectTransfer} />
      <NewStockRequestModal state={requestFor} onClose={() => setRequestFor(null)} onSubmit={(payload) => { submitStockRequest(payload); setRequestFor(null); setDir('out'); setFilter('all'); setPage(1) }} />
    </div>
  )
}
