import Slideover from '../Slideover'
import Icon from '../Icon'
import { smInvStatus, SM_SH_META, smShSeed } from '../../data/inventoryData'

function Content({ state, onClose }) {
  const { item, movements } = state
  const st = smInvStatus(item)
  const avail = item.onHand - item.reserved
  const all = [...(movements || []), ...smShSeed(item)]

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-[16px] font-extrabold text-navy-dark">Stock History</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{item.name} — {item.variant} · {item.sku}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '18px', color: '#64748b' }} />
        </button>
      </div>

      <div className="p-6">
        {/* Hero */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-gray-50 mb-4">
          <div className="w-11 h-11 rounded-xl bg-navy/[0.08] flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" style={{ fontSize: '20px' }} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-navy-dark truncate">{item.name} — {item.variant}</p>
            <p className="text-[10px] text-gray-400 font-mono">{item.sku} · {item.cat}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[18px] font-extrabold text-navy-dark leading-none">{item.onHand}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">physical stock</p>
          </div>
        </div>

        {/* Reserved / Available / Status */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="text-center px-2 py-3 rounded-xl border border-border bg-white">
            <p className="text-[15px] font-extrabold text-navy-dark">{item.reserved}</p>
            <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-[0.06em]">Reserved</p>
          </div>
          <div className="text-center px-2 py-3 rounded-xl border border-border bg-white">
            <p className={`text-[15px] font-extrabold ${avail <= 0 ? 'text-brand-red' : 'text-navy-dark'}`}>{avail}</p>
            <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-[0.06em]">Available</p>
          </div>
          <div className="text-center px-2 py-3 rounded-xl border border-border bg-white">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
            <p className="text-[9px] text-gray-400 mt-1.5 uppercase tracking-[0.06em]">Reorder @ {item.reorder}</p>
          </div>
        </div>

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2">Movement History</p>
        <div className="rounded-xl border border-border overflow-hidden">
          {all.map((m, idx) => {
            const meta = SM_SH_META[m.type] || SM_SH_META.adjustment
            const pos = m.qty >= 0
            return (
              <div key={idx} className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                <div className={`w-8 h-8 rounded-lg ${meta.cls} flex items-center justify-center shrink-0`}>
                  <Icon name={meta.icon} style={{ fontSize: '15px' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
                    <span className="text-[10px] text-gray-400">{m.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">{m.note || '—'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">by {m.by}</p>
                </div>
                <p className={`text-[13px] font-extrabold shrink-0 ${pos ? 'text-brand-green' : 'text-brand-red'}`}>{m.qty === 0 ? '—' : (pos ? '+' : '') + m.qty}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default function StockHistorySlideover({ state, onClose }) {
  return <Slideover item={state} onClose={onClose} width={520} render={(s) => <Content state={s} onClose={onClose} />} />
}
