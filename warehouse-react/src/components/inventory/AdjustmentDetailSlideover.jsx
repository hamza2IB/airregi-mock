import Icon from '../Icon'
import Slideover from '../Slideover'
import { adjReasonMeta } from '../../data/inventoryData'
import { adjUnitPrice } from '../../data/warehouseData'

function Body({ adj, onClose, onViewSku }) {
  const meta = adjReasonMeta(adj.reason)
  const delta = adj.after - adj.before
  const positive = delta >= 0
  const value = Math.abs(delta) * adjUnitPrice(adj.sku)

  const Field = ({ label, children }) => (
    <div>
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.08em]">{label}</p>
      <p className="text-[12.5px] text-navy-dark font-semibold mt-0.5">{children}</p>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#1a2d6b,#3366cc)' }}>
            <Icon name="create-outline" size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Stock Adjustment</h2>
            <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{adj.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={18} style={{ color: '#64748b' }} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 space-y-5">
        {/* Product */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-gray-50">
          <div className="w-11 h-11 rounded-xl bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={20} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-navy-dark truncate">{adj.name} — {adj.variant}</p>
            <p className="text-[10px] text-gray-400 font-mono">{adj.sku} · {adj.cat}</p>
          </div>
        </div>

        {/* Before → After */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="bg-white border border-border rounded-xl px-3 py-3 text-center">
            <p className="text-[18px] font-extrabold text-navy-dark leading-none">{adj.before}</p>
            <p className="text-[9px] text-gray-400 font-medium mt-1">Before</p>
          </div>
          <div className={`rounded-xl px-3 py-3 text-center ${positive ? 'bg-brand-green/10' : 'bg-brand-red/10'}`}>
            <p className={`text-[18px] font-extrabold leading-none ${positive ? 'text-brand-green' : 'text-brand-red'}`}>{positive ? '+' : ''}{delta}</p>
            <p className="text-[9px] text-gray-400 font-medium mt-1">Change</p>
          </div>
          <div className="bg-white border border-border rounded-xl px-3 py-3 text-center">
            <p className="text-[18px] font-extrabold text-navy-dark leading-none">{adj.after}</p>
            <p className="text-[9px] text-gray-400 font-medium mt-1">After</p>
          </div>
        </div>

        {/* Reason + value */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${meta.cls}`}>
            <Icon name={meta.icon} size={13} />{adj.reason}
          </span>
          <span className={`text-[12px] font-bold ${positive ? 'text-brand-green' : 'text-brand-red'}`}>
            {positive ? '+' : '−'}Rs.{value.toLocaleString()} value
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <Field label="Date & Time">{adj.date} · {adj.time}</Field>
          <Field label="Adjusted By">{adj.by}</Field>
          <Field label="Reference">{adj.ref || '—'}</Field>
          <Field label="Adjustment ID">{adj.id}</Field>
        </div>

        {/* Note */}
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.08em] mb-1.5">Notes</p>
          <div className="bg-white border border-border rounded-xl px-4 py-3">
            <p className="text-[12px] text-gray-600 leading-relaxed">{adj.note || 'No additional notes recorded.'}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
        <button onClick={() => onViewSku?.(adj.sku)} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-1.5">
          <Icon name="cube-outline" size={15} />View in Stock Levels
        </button>
      </div>
    </div>
  )
}

export default function AdjustmentDetailSlideover({ adj, onClose, onViewSku }) {
  return <Slideover item={adj} onClose={onClose} width={520} render={(it) => <Body adj={it} onClose={onClose} onViewSku={onViewSku} />} />
}
