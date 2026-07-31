import Icon from '../Icon'
import Slideover from '../Slideover'
import { invStatus, SH_META, shSeed } from '../../data/inventoryData'

function Body({ item, movements, onClose, onAddStock, onAdjust }) {
  const live = movements.filter((m) => m.sku === item.sku)
  const all = [...live, ...shSeed(item)]
  const st = invStatus(item)
  const avail = item.onHand - item.reserved

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#1a2d6b,#3366cc)' }}>
            <Icon name="time-outline" size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Stock History</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{item.name} — {item.variant} · {item.sku}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={18} style={{ color: '#64748b' }} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex-1">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-gray-50 mb-4">
          <div className="w-11 h-11 rounded-xl bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={20} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-navy-dark truncate">{item.name} — {item.variant}</p>
            <p className="text-[10px] text-gray-400 font-mono">{item.sku} · {item.cat}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[18px] font-extrabold text-navy-dark leading-none">{item.onHand}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">physical stock</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white border border-border rounded-xl px-3 py-2.5 text-center">
            <p className="text-[15px] font-extrabold text-navy-dark">{item.reserved}</p>
            <p className="text-[9px] text-gray-400 font-medium">Reserved</p>
          </div>
          <div className="bg-white border border-border rounded-xl px-3 py-2.5 text-center">
            <p className={`text-[15px] font-extrabold ${avail <= 0 ? 'text-brand-red' : 'text-navy-dark'}`}>{avail}</p>
            <p className="text-[9px] text-gray-400 font-medium">Available</p>
          </div>
          <div className="bg-white border border-border rounded-xl px-3 py-2.5 text-center">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
            <p className="text-[9px] text-gray-400 font-medium mt-1.5">Reorder @ {item.reorder}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">Movement History</p>
          <span className="text-[10px] text-gray-400">{all.length} movements</span>
        </div>
        <div className="border border-border rounded-xl overflow-hidden bg-white">
          {all.map((m, i) => {
            const meta = SH_META[m.type] || SH_META.adjustment
            const pos = m.qty >= 0
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                <div className={`w-8 h-8 rounded-lg ${meta.cls} flex items-center justify-center shrink-0`}>
                  <Icon name={meta.icon} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
                    <span className="text-[10px] text-gray-400">{m.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">{m.note || '—'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">by {m.by}</p>
                </div>
                <p className={`text-[13px] font-extrabold shrink-0 ${pos ? 'text-brand-green' : 'text-brand-red'}`}>{pos ? '+' : ''}{m.qty}</p>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button onClick={() => onAddStock(item.sku)} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[12px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-1.5">
            <Icon name="arrow-down-circle-outline" size={15} />Add Stock
          </button>
          <button onClick={() => onAdjust(item.sku)} className="flex-1 py-2.5 border border-border rounded-xl text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-1.5">
            <Icon name="create-outline" size={15} />Adjust
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StockHistorySlideover({ item, movements, onClose, onAddStock, onAdjust }) {
  return (
    <Slideover
      item={item}
      onClose={onClose}
      width={520}
      render={(it) => <Body item={it} movements={movements} onClose={onClose} onAddStock={onAddStock} onAdjust={onAdjust} />}
    />
  )
}
