import Icon from '../Icon'
import Slideover from '../Slideover'
import { pmColorPair, pmTypeIcon, PM_TYPE_BADGE, PM_STATUS_BADGE, cap, money } from '../../data/productData'

// Section wrapper (admin-style) used inside the detail body.
function Section({ title, icon, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(26,45,107,0.08)' }}>
          <Icon name={icon} size={11} style={{ color: '#1a2d6b' }} />
        </div>
        <p className="text-[11px] font-bold text-navy-dark uppercase tracking-[0.06em]">{title}</p>
      </div>
      <div className="bg-white border border-border rounded-xl px-4 py-1">{children}</div>
    </div>
  )
}

function Field({ k, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-[11px] text-gray-400 shrink-0">{k}</span>
      <span className="text-[12px] font-semibold text-navy-dark text-right truncate">{children ?? '—'}</span>
    </div>
  )
}

function Body({ g, onClose, onEdit }) {
  const [c0, c1] = pmColorPair(g.name)
  const initial = (g.name.trim()[0] || '?').toUpperCase()
  const typeIcon = pmTypeIcon(g.type)
  const r0 = g.rows[0] || {}
  const statusCls = PM_STATUS_BADGE[g.status] || 'text-gray-500 bg-gray-100'
  const typeCls = PM_TYPE_BADGE[g.type] || 'text-gray-500 bg-gray-100'

  let priceDisplay = money(r0.price)
  if (g.type === 'variant') {
    const prices = g.rows.map((r) => +r.price || 0).filter(Boolean)
    if (prices.length) {
      const mn = Math.min(...prices), mx = Math.max(...prices)
      priceDisplay = mn === mx ? money(mn) : `${money(mn)}–${money(mx)}`
    } else priceDisplay = 'Per variant'
  }

  return (
    <>
      {/* Hero */}
      <div className="relative shrink-0">
        <div className="h-24 w-full relative overflow-hidden" style={{ background: `linear-gradient(135deg,${c0} 0%,${c1} 100%)` }}>
          <div style={{ position: 'absolute', top: -24, right: -24, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.13)' }}></div>
          <div style={{ position: 'absolute', bottom: -36, left: 24, width: 130, height: 130, borderRadius: '50%', background: 'rgba(0,0,0,0.10)' }}></div>
          <div style={{ position: 'absolute', bottom: 10, right: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name={typeIcon} size={11} style={{ color: 'rgba(255,255,255,0.7)' }} />
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{cap(g.type)} Product</span>
          </div>
        </div>
        <div className="absolute left-5 bottom-0 translate-y-1/2 w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-[22px] font-extrabold text-white" style={{ background: `linear-gradient(135deg,${c0},${c1})` }}>
          {initial}
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-white transition" style={{ background: 'rgba(0,0,0,0.22)' }}>
          <Icon name="close-outline" size={18} />
        </button>
      </div>

      {/* Identity */}
      <div className="px-5 pt-11 pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${typeCls}`}>{cap(g.type)}</span>
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>{cap(g.status)}</span>
        </div>
        <p className="text-[16px] font-extrabold text-navy-dark leading-tight tracking-tight">{g.name}</p>
        <p className="text-[11.5px] text-gray-400 mt-0.5">{g.cat}</p>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 flex-1">
            <Icon name="grid-outline" size={13} style={{ color: '#94a3b8' }} />
            <span className="text-[12px] font-bold text-navy-dark">{g.type === 'variant' ? g.rows.length : '—'}</span>
            <span className="text-[10px] text-gray-400">Variants</span>
          </div>
          <div className="w-px h-3.5 bg-border"></div>
          <div className="flex items-center gap-1.5 flex-1">
            <Icon name="cube-outline" size={13} style={{ color: '#94a3b8' }} />
            <span className="text-[12px] font-bold text-navy-dark">{g.stock.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400">In stock</span>
          </div>
          <div className="w-px h-3.5 bg-border"></div>
          <div className="flex items-center gap-1.5 flex-1">
            <Icon name="pricetag-outline" size={13} style={{ color: '#94a3b8' }} />
            <span className="text-[11.5px] font-bold text-navy-dark truncate">{priceDisplay}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        <Section title="Overview" icon="information-circle-outline">
          <Field k="Category">{g.cat}</Field>
          <Field k="Product Type">{cap(g.type)}</Field>
          {g.type !== 'variant' ? (
            <Field k="SKU"><span className="font-mono">{r0.sku || '—'}</span></Field>
          ) : (
            <Field k="Variants">{g.rows.length + ' generated'}</Field>
          )}
          <Field k="Status">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>{cap(g.status)}</span>
          </Field>
        </Section>

        {g.type === 'variant' && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(124,77,255,0.12)' }}>
                <Icon name="grid-outline" size={11} style={{ color: '#7c4dff' }} />
              </div>
              <p className="text-[11px] font-bold text-navy-dark uppercase tracking-[0.06em]">Variants · {g.rows.length}</p>
            </div>
            <div className="border border-border rounded-xl overflow-hidden divide-y divide-gray-100">
              {g.rows.map((v) => (
                <div key={v.sku} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0"></span>
                    <span className="text-[12px] font-semibold text-navy-dark truncate">{v.variant || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10.5px] font-mono text-gray-400">{v.sku}</span>
                    <span className="text-[11.5px] font-bold text-navy-dark">{money(v.price)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.onHand ? 'bg-navy/8 text-navy' : 'bg-brand-red/10 text-brand-red'}`}>{v.onHand || 0} pcs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {g.type === 'bundle' && (r0.bundleItems || []).length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(255,152,0,0.12)' }}>
                <Icon name="albums-outline" size={11} style={{ color: '#ff9800' }} />
              </div>
              <p className="text-[11px] font-bold text-navy-dark uppercase tracking-[0.06em]">Bundle Contains · {r0.bundleItems.length}</p>
            </div>
            <div className="border border-border rounded-xl overflow-hidden divide-y divide-gray-100">
              {r0.bundleItems.map((b, i) => (
                <div key={b.sku || i} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                    <span className="text-[12px] font-semibold text-navy-dark truncate">{b.name}{b.variant ? ' · ' + b.variant : ''}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy/8 text-navy shrink-0">× {b.qty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Section title="Pricing & Inventory" icon="pricetag-outline">
          <Field k={g.type === 'bundle' ? 'Bundle Price' : g.type === 'variant' ? 'Price Range' : 'Selling Price'}>{priceDisplay}</Field>
          <Field k="Total Stock">{`${g.stock.toLocaleString()} units`}</Field>
          {g.type !== 'variant' && <Field k="Barcode">{r0.barcode ? <span className="font-mono">{r0.barcode}</span> : '—'}</Field>}
          <Field k="Reorder At">{r0.reorder ? r0.reorder + ' units' : '—'}</Field>
        </Section>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-t border-border sticky bottom-0 bg-white">
        <button onClick={onClose} className="flex-1 h-9 text-[12px] font-semibold text-gray-500 bg-white border border-border rounded-xl hover:bg-gray-50 transition">Close</button>
        <button onClick={() => onEdit(g.name)} className="flex-1 h-9 text-[12px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5">
          <Icon name="create-outline" size={15} />Edit Product
        </button>
      </div>
    </>
  )
}

export default function ProductDetailSlideover({ item, onClose, onEdit }) {
  return <Slideover item={item} onClose={onClose} width={520} render={(g) => <Body g={g} onClose={onClose} onEdit={onEdit} />} />
}
