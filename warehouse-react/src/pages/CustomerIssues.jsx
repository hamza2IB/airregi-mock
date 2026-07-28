import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import Slideover from '../components/Slideover'
import { useToast } from '../components/Toast'
import { ISS_STATUS } from '../data/issuesData'

const COLS = '0.9fr 1.1fr 1.2fr 1.4fr 1fr 0.9fr 0.7fr'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
]

function Kpi({ icon, iconBg, iconColor, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
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

function Field({ label, value, mono }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">{label}</p>
      <p className={`font-semibold text-navy-dark mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

export default function CustomerIssues({ issues, patchIssue }) {
  const showToast = useToast()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const counts = useMemo(() => ({
    open: issues.filter((i) => i.status === 'open').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
  }), [issues])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return issues.filter((i) => {
      const mf = filter === 'all' || i.status === filter
      const ms = !q || i.id.toLowerCase().includes(q) || i.orderId.toLowerCase().includes(q) || i.customer.toLowerCase().includes(q)
      return mf && ms
    })
  }, [issues, search, filter])

  const advance = (id, status) => {
    patchIssue(id, { status })
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
    showToast(status === 'resolved' ? `${id} marked resolved.` : `Started resolving ${id}.`, 'success')
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon="alert-circle-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={counts.open} valueCls="text-brand-orange" label="Open" />
        <Kpi icon="time-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={counts.in_progress} valueCls="text-brand-blue" label="In Progress" />
        <Kpi icon="checkmark-circle-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={counts.resolved} valueCls="text-brand-green" label="Resolved" />
        <Kpi icon="layers-outline" iconBg="bg-navy/10" iconColor="text-navy" value={issues.length} valueCls="text-navy-dark" label="Total" />
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[11px] text-gray-600 leading-relaxed"><strong className="text-navy-dark">Issues raised by customers from the shopping app</strong> against orders this warehouse fulfils — wrong or short shipments, transit damage, and cancellations. Review each one, start resolving while you work it, and mark it resolved when done.</p>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search issue #, order #, customer…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setFilter(t.key)} className={`px-3 py-1.5 text-[11px] transition ${filter === t.key ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[820px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Issue #</div><div>Order #</div><div>Customer</div><div>Reason</div><div>Date</div>
              <div className="text-center">Status</div><div className="text-right">Action</div>
            </div>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Icon name="checkmark-done-circle-outline" size={32} style={{ color: '#cbd5e1' }} />
                <p className="text-[13px] text-gray-400 mt-2">No issues match your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((i) => {
                  const s = ISS_STATUS[i.status]
                  return (
                    <div key={i.id} className="grid items-center px-5 py-3 text-[12px] hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
                      <div className="font-mono text-[11px] text-navy-dark">{i.id}</div>
                      <div className="font-mono text-[11px] text-gray-500">{i.orderId}</div>
                      <div className="font-semibold text-navy-dark truncate">{i.customer}</div>
                      <div className="text-gray-600 truncate">{i.reason}</div>
                      <div className="text-gray-400 text-[11px]">{i.date.split(',')[0]}</div>
                      <div className="text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span></div>
                      <div className="text-right"><button onClick={() => setSelected(i)} className="text-[11px] font-semibold text-brand-blue hover:underline">View</button></div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail slideover */}
      <Slideover
        item={selected}
        onClose={() => setSelected(null)}
        width={520}
        render={(i) => {
          const s = ISS_STATUS[i.status]
          return (
            <>
              <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-[16px] font-extrabold text-navy-dark">{i.id}</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Order {i.orderId}</p>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
                  <Icon name="close-outline" style={{ fontSize: '18px', color: '#64748b' }} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                </div>
                <div className="bg-gray-50 border border-border rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
                    <Field label="Customer" value={i.customer} />
                    <Field label="Phone" value={i.phone} />
                    <Field label="Order" value={i.orderId} mono />
                    <Field label="Raised" value={i.date} />
                  </div>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Reason</p>
                <p className="text-[13.5px] font-bold text-navy-dark">{i.reason}</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mt-4 mb-1.5">Details</p>
                <p className="text-[12.5px] text-gray-600 leading-relaxed">{i.note ? i.note : <span className="text-gray-400 italic">No additional details provided.</span>}</p>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
                <button onClick={() => setSelected(null)} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Close</button>
                {i.status === 'open' && (
                  <button onClick={() => advance(i.id, 'in_progress')} className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl text-[13px] font-semibold hover:bg-brand-blue/85 transition flex items-center justify-center gap-1.5">
                    <Icon name="play-outline" style={{ fontSize: '15px' }} />Start resolving
                  </button>
                )}
                {i.status === 'in_progress' && (
                  <button onClick={() => advance(i.id, 'resolved')} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5">
                    <Icon name="checkmark-outline" style={{ fontSize: '15px' }} />Mark resolved
                  </button>
                )}
              </div>
            </>
          )
        }}
      />
    </div>
  )
}
