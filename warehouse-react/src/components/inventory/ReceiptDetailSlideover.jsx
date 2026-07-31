import Icon from '../Icon'
import Slideover from '../Slideover'
import { rcptUnits } from '../../data/warehouseData'

function Body({ rcpt, onClose, onViewSku }) {
  const units = rcptUnits(rcpt)
  const batchTracked = rcpt.lines.some((l) => l.batch || l.expiry)

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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#0f7a3d,#2dd36f)' }}>
            <Icon name="arrow-down-circle-outline" size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Goods Receipt</h2>
            <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{rcpt.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={18} style={{ color: '#64748b' }} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 space-y-5">
        {/* Supplier + totals */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-gray-50">
          <div className="w-11 h-11 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0"><Icon name="business-outline" className="text-brand-green" size={20} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-navy-dark truncate">{rcpt.supplier}</p>
            <p className="text-[10px] text-gray-400 font-mono">{rcpt.ref || 'No reference'}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[18px] font-extrabold text-brand-green leading-none">+{units.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">units received</p>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date & Time">{rcpt.date} · {rcpt.time}</Field>
          <Field label="Received By">{rcpt.by}</Field>
          <Field label="Reference">{rcpt.ref || '—'}</Field>
          <Field label="Line Items">{rcpt.lines.length}</Field>
        </div>

        {/* Line items */}
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.08em] mb-2">Items Received</p>
          <div className="border border-border rounded-xl overflow-hidden bg-white">
            {rcpt.lines.map((l, i) => (
              <button
                key={l.sku + i}
                onClick={() => onViewSku?.(l.sku)}
                className="w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={15} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-navy-dark truncate">{l.name} — {l.variant}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{l.sku}</p>
                  {(l.batch || l.expiry) && (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {l.batch && <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded"><Icon name="flask-outline" size={10} />Batch {l.batch}</span>}
                      {l.expiry && <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded"><Icon name="time-outline" size={10} />Exp {l.expiry}</span>}
                    </div>
                  )}
                </div>
                <p className="text-[13px] font-extrabold text-brand-green shrink-0">+{l.qty}</p>
              </button>
            ))}
          </div>
          {batchTracked && (
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1.5">
              <Icon name="information-circle-outline" size={12} style={{ color: '#94a3b8' }} />
              Batch &amp; expiry captured for batch-tracked products (drives first-expiry-first-out picking).
            </p>
          )}
        </div>

        {/* Note */}
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.08em] mb-1.5">Notes</p>
          <div className="bg-white border border-border rounded-xl px-4 py-3">
            <p className="text-[12px] text-gray-600 leading-relaxed">{rcpt.note || 'No additional notes recorded.'}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
        <button onClick={onClose} className="w-full py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
      </div>
    </div>
  )
}

export default function ReceiptDetailSlideover({ rcpt, onClose, onViewSku }) {
  return <Slideover item={rcpt} onClose={onClose} width={520} render={(it) => <Body rcpt={it} onClose={onClose} onViewSku={onViewSku} />} />
}
