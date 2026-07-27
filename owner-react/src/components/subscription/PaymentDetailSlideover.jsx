import Slideover from '../Slideover'
import Icon from '../Icon'
import { PAYMENT_STATUS_CFG } from '../../data/subscriptionData'

function Row({ icon, label, value, sub }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5">
        <Icon name={icon} className="text-gray-400 shrink-0" style={{ fontSize: '15px' }} />
        <span className="text-[12px] text-gray-500">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-[12px] font-semibold text-navy-dark">{value}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function Content({ p, onClose, onSubmitNew }) {
  const cfg = PAYMENT_STATUS_CFG[p.status] || PAYMENT_STATUS_CFG.pending

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
            <Icon name={cfg.ion} className={cfg.iconColor} style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">Payment Details</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{p.ref}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-dark to-navy px-6 py-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Amount Paid</p>
          <p className="text-[34px] font-extrabold leading-tight">{p.amount}</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/15">
            <div><p className="text-[10px] text-white/50 mb-0.5">Plan</p><p className="text-[14px] font-bold">{p.plan} Plan</p></div>
            <div className="w-px h-6 bg-white/20"></div>
            <div><p className="text-[10px] text-white/50 mb-0.5">Status</p><p className="text-[14px] font-bold capitalize">{p.status}</p></div>
            <div className="w-px h-6 bg-white/20"></div>
            <div><p className="text-[10px] text-white/50 mb-0.5">Date</p><p className="text-[14px] font-bold">{p.date}</p></div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.12em] font-semibold">Transfer Information</p>
        <div className="bg-white rounded-xl border border-border divide-y divide-gray-100 overflow-hidden">
          <Row icon="calendar-outline" label="Date & Time" value={p.date} sub={p.time || '—'} />
          <Row icon="business-outline" label="Bank" value={p.bank} />
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Icon name="receipt-outline" className="text-gray-400 shrink-0" style={{ fontSize: '15px' }} />
              <span className="text-[12px] text-gray-500">Reference #</span>
            </div>
            <p className="text-[11px] font-mono font-semibold text-navy-dark">{p.ref}</p>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Icon name="cash-outline" className="text-gray-400 shrink-0" style={{ fontSize: '15px' }} />
              <span className="text-[12px] text-gray-500">Amount</span>
            </div>
            <p className="text-[13px] font-extrabold text-navy-dark">{p.amount}</p>
          </div>
        </div>

        {/* Status block */}
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.12em] font-semibold">Verification Status</p>
        <div className={`rounded-xl border px-5 py-4 flex items-start gap-3 ${cfg.blockBg}`}>
          <Icon name={cfg.blockIcon} className={cfg.blockIconColor} style={{ fontSize: '22px', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p className="text-[13px] font-bold text-navy-dark">{cfg.title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{cfg.desc}</p>
          </div>
        </div>

        {/* Rejection note */}
        {p.status === 'rejected' && p.note && (
          <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon name="alert-circle-outline" className="text-brand-red shrink-0" style={{ fontSize: '15px' }} />
              <p className="text-[12px] font-semibold text-brand-red">Rejection Reason</p>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">{p.note}</p>
          </div>
        )}

        {/* Receipt placeholder */}
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.12em] font-semibold">Receipt</p>
        <div className="h-20 bg-gray-50 border border-border rounded-xl flex items-center justify-center gap-2 text-gray-400">
          <Icon name="document-outline" style={{ fontSize: '20px' }} />
          <span className="text-[12px]">No receipt uploaded</span>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
        <button onClick={onSubmitNew} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-2">
          <Icon name="refresh-outline" style={{ fontSize: '15px' }} /> Submit New Payment
        </button>
      </div>
    </>
  )
}

export default function PaymentDetailSlideover({ payment, onClose, onSubmitNew }) {
  return <Slideover item={payment} onClose={onClose} width={480} render={(p) => <Content p={p} onClose={onClose} onSubmitNew={onSubmitNew} />} />
}
