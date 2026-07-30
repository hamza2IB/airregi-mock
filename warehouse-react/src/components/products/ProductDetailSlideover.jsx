import { useEffect, useState } from 'react'
import Icon from '../Icon'
import Slideover from '../Slideover'
import { pmColorPair, pmTypeIcon, pmImages, pmDescription, pmBarcode, PM_TYPE_BADGE, PM_STATUS_BADGE, cap, money } from '../../data/productData'

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

function Body({ g, onClose, onEdit, onStockAction }) {
  const [c0, c1] = pmColorPair(g.name)
  const initial = (g.name.trim()[0] || '?').toUpperCase()
  const typeIcon = pmTypeIcon(g.type)
  const r0 = g.rows[0] || {}
  const repSku = r0.sku
  const statusCls = PM_STATUS_BADGE[g.status] || 'text-gray-500 bg-gray-100'
  const typeCls = PM_TYPE_BADGE[g.type] || 'text-gray-500 bg-gray-100'

  const imgs = pmImages(g)
  const [mainImg, setMainImg] = useState(imgs[0])
  const [imgFailed, setImgFailed] = useState(false)
  useEffect(() => { setMainImg(imgs[0]); setImgFailed(false) }, [g.name])

  const doAction = (action) => {
    onClose()
    setTimeout(() => onStockAction?.(action, repSku), 60)
  }

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
      {/* Hero (real product image) */}
      <div className="relative shrink-0 bg-gray-100" style={{ height: 240 }}>
        {imgFailed ? (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${c0},${c1})` }}>
            <span style={{ fontSize: '52px', fontWeight: 800, color: '#fff' }}>{initial}</span>
          </div>
        ) : (
          <img src={mainImg} alt={g.name} className="w-full h-full object-cover" onError={() => setImgFailed(true)} />
        )}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 96, background: 'linear-gradient(to top,rgba(10,21,53,0.78),rgba(10,21,53,0))' }}></div>
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 64, background: 'linear-gradient(to bottom,rgba(10,21,53,0.35),rgba(10,21,53,0))' }}></div>
        <div className="absolute bottom-3.5 left-5 flex items-center gap-1.5">
          <Icon name={typeIcon} size={13} style={{ color: 'rgba(255,255,255,0.92)' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '.2px' }}>{cap(g.type)} Product</span>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-white transition" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <Icon name="close-outline" size={18} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="px-5 py-3 border-b border-border shrink-0 flex gap-2 overflow-x-auto thin-scroll">
        {imgs.map((u, i) => (
          <button
            key={i}
            onClick={() => { setMainImg(u); setImgFailed(false) }}
            className={`pd-thumb rounded-lg overflow-hidden border border-border shrink-0 ${mainImg === u ? 'pd-thumb-active' : ''}`}
            style={{ width: 56, height: 56 }}
          >
            <img src={u} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }} />
          </button>
        ))}
      </div>

      {/* Identity */}
      <div className="px-5 pt-4 pb-4 border-b border-border shrink-0">
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

      {/* Stock action bar — act via business operations, never edit stock directly */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => doAction('in')} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-border hover:border-brand-green/50 hover:bg-brand-green/5 transition">
            <Icon name="arrow-down-circle-outline" size={19} style={{ color: '#2dd36f' }} />
            <span className="text-[10.5px] font-semibold text-navy-dark">Stock In</span>
          </button>
          <button onClick={() => doAction('transfer')} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-border hover:border-brand-purple/50 hover:bg-brand-purple/5 transition">
            <Icon name="swap-horizontal-outline" size={19} style={{ color: '#7c4dff' }} />
            <span className="text-[10.5px] font-semibold text-navy-dark">Transfer</span>
          </button>
          <button onClick={() => doAction('adjust')} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-border hover:border-brand-orange/50 hover:bg-brand-orange/5 transition">
            <Icon name="create-outline" size={19} style={{ color: '#ff9800' }} />
            <span className="text-[10.5px] font-semibold text-navy-dark">Adjust Stock</span>
          </button>
          <button onClick={() => doAction('history')} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-border hover:border-brand-blue/50 hover:bg-brand-blue/5 transition">
            <Icon name="time-outline" size={19} style={{ color: '#3366cc' }} />
            <span className="text-[10.5px] font-semibold text-navy-dark">Stock History</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Description */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(45,211,111,0.14)' }}>
              <Icon name="document-text-outline" size={11} style={{ color: '#16a34a' }} />
            </div>
            <p className="text-[11px] font-bold text-navy-dark uppercase tracking-[0.06em]">Description</p>
          </div>
          <div className="bg-white border border-border rounded-xl px-4 py-3">
            <p className="text-[12.5px] text-gray-600 leading-relaxed">{pmDescription(g)}</p>
          </div>
        </div>

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
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="grid text-[9.5px] font-bold text-gray-400 uppercase tracking-[0.05em] px-3.5 py-2 bg-gray-50/70 border-b border-border" style={{ gridTemplateColumns: '1.3fr 1.1fr 1.2fr 0.6fr' }}>
                <div>Variant</div>
                <div>SKU</div>
                <div>Barcode</div>
                <div className="text-right">Stock</div>
              </div>
              <div className="divide-y divide-gray-100">
                {g.rows.map((v) => (
                  <div key={v.sku} className="grid items-center gap-2 px-3.5 py-2.5" style={{ gridTemplateColumns: '1.3fr 1.1fr 1.2fr 0.6fr' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0"></span>
                      <span className="text-[12px] font-semibold text-navy-dark truncate">{v.variant || '—'}</span>
                    </div>
                    <span className="text-[10.5px] font-mono text-gray-500 truncate">{v.sku}</span>
                    <span className="text-[10.5px] font-mono text-gray-500 truncate">{pmBarcode(v)}</span>
                    <span className={`text-[11px] font-bold text-right ${v.onHand ? 'text-navy-dark' : 'text-brand-red'}`}>{v.onHand || 0}</span>
                  </div>
                ))}
              </div>
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
          {g.type !== 'variant' && <Field k="Barcode"><span className="font-mono">{pmBarcode(r0)}</span></Field>}
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

export default function ProductDetailSlideover({ item, onClose, onEdit, onStockAction }) {
  return <Slideover item={item} onClose={onClose} width={520} render={(g) => <Body g={g} onClose={onClose} onEdit={onEdit} onStockAction={onStockAction} />} />
}
