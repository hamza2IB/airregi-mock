import Icon from '../Icon'
import Slideover from '../Slideover'
import { useToast } from '../Toast'

function InfoChip({ icon, label, value, extra }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-border">
      <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
        <Icon name={icon} className="text-gray-500" style={{ fontSize: '15px' }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{label}</p>
        <p className="text-[12.5px] font-semibold text-navy-dark truncate mt-0.5">{value}</p>
        {extra && <p className="text-[10px] text-gray-400 mt-0.5">{extra}</p>}
      </div>
    </div>
  )
}

function Content({ t, onClose, showToast }) {
  const isPOS = t.channel === 'POS'
  const validLines = t.lines.filter((l) => l.qty > 0)
  const subtotal = validLines.reduce((s, l) => s + l.total, 0)
  const tax = Math.round(subtotal * 0.05)

  return (
    <>
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPOS ? 'bg-navy/10' : 'bg-brand-blue/10'}`}>
            <Icon name={isPOS ? 'storefront-outline' : 'globe-outline'} className={isPOS ? 'text-navy' : 'text-brand-blue'} style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">{t.id}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{t.date} · {t.time} · Al Fatah {t.store}</p>
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
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Order Total</p>
          <p className="text-[34px] font-extrabold leading-tight">{t.amount}</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/15">
            <div><p className="text-[10px] text-white/50 mb-0.5">Items</p><p className="text-[15px] font-bold">{t.items} item{t.items !== 1 ? 's' : ''}</p></div>
            <div className="w-px h-6 bg-white/20"></div>
            <div><p className="text-[10px] text-white/50 mb-0.5">Payment</p><p className="text-[15px] font-bold">{t.pay}</p></div>
            <div className="w-px h-6 bg-white/20"></div>
            <div><p className="text-[10px] text-white/50 mb-0.5">Channel</p><p className="text-[15px] font-bold">{t.channel}</p></div>
          </div>
        </div>
      </div>

      {/* Order details chips */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Order Details</p>
        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
          <InfoChip icon="storefront-outline" label="Store" value={`Al Fatah ${t.store}`} extra="Lahore, Pakistan" />
          <InfoChip icon="time-outline" label="Date & Time" value={t.date} extra={t.time} />
          <InfoChip
            icon={isPOS ? 'person-outline' : 'person-circle-outline'}
            label={isPOS ? 'Cashier' : 'Customer'}
            value={isPOS ? t.cashier : t.customer}
            extra={isPOS ? `Register ${t.register}` : 'Online Customer'}
          />
          <InfoChip icon={isPOS ? 'cash-outline' : 'bicycle-outline'} label="Payment" value={t.pay} extra={isPOS ? 'Paid at counter' : 'Cash on delivery'} />
        </div>
      </div>

      {/* Line items */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Items Ordered</p>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid px-4 py-2.5 bg-gray-50/80 border-b border-border text-[10px] font-semibold text-gray-400 uppercase tracking-[0.07em]" style={{ gridTemplateColumns: '1fr 0.4fr 0.7fr 0.7fr' }}>
            <div>Product</div>
            <div className="text-center">Qty</div>
            <div className="text-right">Unit Price</div>
            <div className="text-right">Total</div>
          </div>
          <div className="divide-y divide-gray-100">
            {validLines.map((l, i) => (
              <div key={i} className={`grid items-center px-4 py-3 transition hover:bg-gray-50/60 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`} style={{ gridTemplateColumns: '1fr 0.4fr 0.7fr 0.7fr' }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-navy/[.08] flex items-center justify-center shrink-0">
                    <Icon name="cube-outline" className="text-navy" style={{ fontSize: '11px' }} />
                  </div>
                  <p className="text-[12px] font-medium text-navy-dark truncate">{l.name}</p>
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-navy/10 text-navy text-[10px] font-bold">{l.qty}</span>
                </div>
                <p className="text-[11px] text-gray-500 text-right">Rs.{l.price.toLocaleString()}</p>
                <p className="text-[12px] font-semibold text-navy-dark text-right">Rs.{l.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="px-6 py-4">
        <div className="bg-gray-50 rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Subtotal ({validLines.length} items)</span>
              <span className="font-medium text-navy-dark">Rs.{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Tax (5% GST)</span>
              <span className="font-medium text-navy-dark">Rs.{tax.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-navy/5 border-t border-border">
            <span className="text-[13px] font-extrabold text-navy-dark">Total Paid</span>
            <span className="text-[18px] font-extrabold text-navy-dark">{t.amount}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border sticky bottom-0 bg-white flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">
          Close
        </button>
        <button onClick={() => showToast('Refund flow coming soon', 'info')} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-brand-red/25 bg-brand-red/5 text-brand-red rounded-xl text-[13px] font-semibold hover:bg-brand-red/10 transition">
          <Icon name="return-down-back-outline" style={{ fontSize: '15px' }} /> Refund
        </button>
        <button onClick={() => showToast('Receipt printed', 'success')} className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">
          <Icon name="print-outline" style={{ fontSize: '15px' }} /> Print Receipt
        </button>
      </div>
    </>
  )
}

export default function TransactionDetailSlideover({ txn, onClose }) {
  const showToast = useToast()
  return <Slideover item={txn} onClose={onClose} width={580} render={(t) => <Content t={t} onClose={onClose} showToast={showToast} />} />
}
