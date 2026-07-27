import Slideover from '../Slideover'
import Icon from '../Icon'
import { initialsOf } from '../../data/dashboardData'
import { SM_SHIFT_STORE, fmtRs, shiftExpected, shiftTotalSales, shiftTxns, shiftVariance, varianceBadge, shiftTransactions } from '../../data/shiftData'

const TENDER_TAG = {
  cash: 'text-brand-green bg-brand-green/10',
  card: 'text-brand-blue bg-brand-blue/10',
  wallet: 'text-brand-purple bg-brand-purple/10',
}

const PAY_META = {
  cash: { label: 'Cash', icon: 'cash-outline', color: 'text-brand-green', bg: 'bg-brand-green/10' },
  card: { label: 'Card', icon: 'card-outline', color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
  wallet: { label: 'Wallet / QR', icon: 'qr-code-outline', color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
}

function Row({ label, value, cls = '' }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${cls}`}>
      <span className="text-[12px] text-gray-500">{label}</span>
      <span className="text-[13px] font-semibold text-navy-dark">{value}</span>
    </div>
  )
}

function Content({ s, onClose }) {
  const isOpen = s.status === 'open'
  const expected = shiftExpected(s)
  const totalSales = shiftTotalSales(s)
  const txns = shiftTxns(s)
  const diff = shiftVariance(s)
  const vb = diff == null ? null : varianceBadge(diff)
  const txnList = shiftTransactions(s)
  const cashTxnTotal = txnList.filter((t) => t.tender === 'cash').reduce((a, t) => a + t.amount, 0)

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="min-w-0">
          <h3 className="text-[16px] font-extrabold text-navy-dark truncate">{s.cashier} · {s.register}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{SM_SHIFT_STORE} · {s.id}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition shrink-0">
          <Icon name="close-outline" style={{ fontSize: '18px', color: '#64748b' }} />
        </button>
      </div>

      <div className="p-6">
        {/* Cashier + status */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-gray-50 mb-4">
          <div className="w-11 h-11 rounded-xl bg-navy/10 flex items-center justify-center shrink-0 text-[13px] font-extrabold text-navy">{initialsOf(s.cashier)}</div>
          <div className="min-w-0">
            <p className="text-[14px] font-extrabold text-navy-dark truncate">{s.cashier}</p>
            <p className="text-[11px] text-gray-400">{s.register} · {txns} transactions</p>
          </div>
          {isOpen ? (
            <span className="ml-auto text-[11px] font-bold text-navy bg-navy/10 px-2.5 py-1 rounded-full whitespace-nowrap">Open</span>
          ) : (
            <span className={`ml-auto flex items-center gap-1 text-[11px] font-bold ${vb.color} ${vb.bg} px-2.5 py-1 rounded-full whitespace-nowrap`}>
              <Icon name={vb.icon} style={{ fontSize: '13px' }} />{diff === 0 ? 'Balanced' : diff < 0 ? 'Short' : 'Over'}
            </span>
          )}
        </div>

        {/* Timing */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="px-4 py-3 rounded-xl border border-border">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Opened</p>
            <p className="text-[12px] font-semibold text-navy-dark">{s.opened}</p>
          </div>
          <div className="px-4 py-3 rounded-xl border border-border">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Closed</p>
            <p className="text-[12px] font-semibold text-navy-dark">{s.closed || '—'}</p>
          </div>
        </div>

        {/* Sales breakdown */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sales by Tender</p>
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          {['cash', 'card', 'wallet'].map((k) => {
            const m = PAY_META[k]
            return (
              <div key={k} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.bg}`}>
                  <Icon name={m.icon} className={m.color} style={{ fontSize: '15px' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-navy-dark">{m.label}</p>
                  <p className="text-[10px] text-gray-400">{s.sales[k].n} transaction{s.sales[k].n !== 1 ? 's' : ''}</p>
                </div>
                <p className="ml-auto text-[13px] font-bold text-navy-dark">{fmtRs(s.sales[k].amt)}</p>
              </div>
            )
          })}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50/70">
            <span className="text-[12px] font-semibold text-gray-500">Total sales</span>
            <span className="text-[14px] font-extrabold text-navy-dark">{fmtRs(totalSales)}</span>
          </div>
        </div>

        {/* Drawer reconciliation */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Drawer Reconciliation</p>
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <Row label="Opening float" value={fmtRs(s.openingFloat)} cls="border-b border-gray-100" />
          <Row label="Cash sales" value={fmtRs(s.sales.cash.amt)} cls="border-b border-gray-100" />
          <Row label="Expected in drawer" value={fmtRs(expected)} cls="border-b border-gray-100" />
          {isOpen ? (
            <div className="flex items-center justify-between px-4 py-3 bg-brand-blue/5">
              <span className="text-[12px] font-semibold text-brand-blue">Counted</span>
              <span className="text-[12px] font-medium text-gray-400">Pending close</span>
            </div>
          ) : (
            <>
              <Row label="Counted (actual)" value={fmtRs(s.counted)} cls="border-b border-gray-100" />
              <div className={`flex items-center justify-between px-4 py-3 ${vb.bg}`}>
                <span className={`text-[12px] font-semibold ${vb.color}`}>Variance</span>
                <span className={`text-[14px] font-extrabold ${vb.color}`}>{diff === 0 ? fmtRs(0) : vb.label}</span>
              </div>
            </>
          )}
        </div>

        {/* Note / status message */}
        {isOpen ? (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-brand-blue/5 border border-brand-blue/15">
            <Icon name="information-circle-outline" className="text-brand-blue" style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">This shift is still open. Count the drawer and close it to record the actual cash and any variance.</p>
          </div>
        ) : diff !== 0 ? (
          <div className={`flex items-start gap-2 px-4 py-3 rounded-xl ${vb.bg}`}>
            <Icon name="alert-circle-outline" className={vb.color} style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{diff < 0 ? 'The drawer came up short of the expected amount.' : 'The drawer had more cash than expected (overage).'}</p>
              {s.note && <p className="text-[11px] font-semibold text-navy-dark mt-1">Note: {s.note}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-brand-green/10">
            <Icon name="checkmark-circle-outline" className="text-brand-green" style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">This shift balanced perfectly — the counted cash matches the expected amount.</p>
          </div>
        )}

        {/* Full transaction ledger for the shift */}
        {txnList.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-5 mb-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Transactions ({txnList.length})</p>
              <p className="text-[10px] text-gray-400">{(s.closed && s.closed !== 'Now' ? s.closed : s.opened).split('·')[0].trim()}</p>
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Cash-total helper so the manager can tie the ledger to the drawer */}
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-green/5 border-b border-border">
                <Icon name="information-circle-outline" className="text-brand-green" style={{ fontSize: '13px', flexShrink: 0 }} />
                <p className="text-[10px] text-gray-600 leading-snug">
                  Cash transactions total <strong className="text-navy-dark">{fmtRs(cashTxnTotal)}</strong> — this is what should be in the drawer on top of the {fmtRs(s.openingFloat)} opening float.
                </p>
              </div>
              <div className="max-h-[340px] overflow-y-auto thin-scroll">
                {txnList.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-semibold text-navy-dark font-mono">{t.id}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TENDER_TAG[t.tender]}`}>{t.pay}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.time} · {t.items} item{t.items !== 1 ? 's' : ''}</p>
                    </div>
                    <p className="text-[12px] font-bold text-navy-dark shrink-0">{fmtRs(t.amount)}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/70 border-t border-border">
                <span className="text-[12px] font-semibold text-gray-500">Total ({txnList.length} transactions)</span>
                <span className="text-[14px] font-extrabold text-navy-dark">{fmtRs(totalSales)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
      </div>
    </>
  )
}

export default function ShiftDetailSlideover({ shift, onClose }) {
  return <Slideover item={shift} onClose={onClose} width={480} render={(s) => <Content s={s} onClose={onClose} />} />
}
