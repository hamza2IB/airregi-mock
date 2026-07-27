import { useEffect, useState } from 'react'
import Icon from '../Icon'
import Slideover from '../Slideover'
import { useToast } from '../Toast'
import { activeCategoryOptions, catById, catPath, cap, money } from '../../data/productData'

// Full step catalog — filtered per product type.
const PC_ALL_STEPS = [
  { id: 'basic', name: 'Basic Information', short: 'Basics', types: ['simple', 'variant', 'bundle'] },
  { id: 'options', name: 'Product Options', short: 'Options', types: ['variant'] },
  { id: 'bundle', name: 'Bundle Builder', short: 'Bundle', types: ['bundle'] },
  { id: 'pricing', name: 'Pricing & Inventory', short: 'Pricing', types: ['simple', 'variant', 'bundle'] },
  { id: 'media', name: 'Media & Marketplace', short: 'Media', types: ['simple', 'variant', 'bundle'] },
  { id: 'review', name: 'Review & Save', short: 'Review', types: ['simple', 'variant', 'bundle'] },
]

const UOMS = ['Piece', 'Kg', 'Gram', 'Litre', 'ml', 'Pack', 'Box', 'Dozen']

const TYPE_HINTS = {
  simple: 'A single product with one SKU, price and stock. e.g. Rice 5kg, Office Chair.',
  variant: 'A product with versions (size, color…). Each variant gets its own SKU, price and stock.',
  bundle: 'A pack made from existing products sold together. e.g. Gaming Bundle.',
}

const CATS = activeCategoryOptions()

function baseState() {
  return {
    step: 0,
    type: 'simple',
    name: '',
    categoryId: '',
    status: 'active',
    description: '',
    details: [],
    options: [],
    variants: [],
    bundle: [],
    bundleRule: 'bundle',
    cost: '',
    price: '',
    sku: '',
    barcode: '',
    uom: 'Piece',
    stock: '',
    reorder: '',
    seoTitle: '',
    seoDesc: '',
    editing: null,
  }
}

function makeState(session) {
  const s = baseState()
  const g = session?.editing
  if (!g) return s
  const r0 = g.rows[0] || {}
  const catMatch = CATS.find((c) => catById(c.id)?.name === g.cat)
  s.editing = g.name
  s.name = g.name
  s.categoryId = catMatch ? String(catMatch.id) : ''
  s.status = g.status
  s.type = g.type
  s.reorder = r0.reorder || ''
  if (g.type === 'simple') {
    s.price = r0.price || ''
    s.sku = r0.sku || ''
    s.stock = r0.onHand || ''
    if (UOMS.includes(r0.variant)) s.uom = r0.variant
  } else if (g.type === 'bundle') {
    s.price = r0.price || ''
    s.sku = r0.sku || ''
    s.stock = r0.onHand || ''
    s.bundle = (r0.bundleItems || []).map((b) => ({ ...b }))
    s.bundleRule = r0.bundleRule || 'bundle'
  } else if (g.type === 'variant') {
    const parts = g.rows.map((r) => (r.variant || '').split(' / '))
    const dims = parts[0] ? parts[0].length : 1
    s.options = []
    for (let d = 0; d < dims; d++) {
      const vals = [...new Set(parts.map((p) => (p[d] || '').trim()).filter(Boolean))]
      s.options.push({ name: 'Option ' + (d + 1), values: vals })
    }
    s.variants = g.rows.map((r, i) => ({
      label: r.variant,
      sku: r.sku,
      barcode: r.barcode || '89640' + String(100000 + i).slice(-6),
      price: r.price || 0,
      stock: r.onHand || 0,
    }))
  }
  return s
}

// Cartesian product of option values → variant rows.
function generateVariants(options, name) {
  const active = options.filter((o) => o.name && o.values.length)
  if (!active.length) return []
  let combos = [[]]
  active.forEach((o) => {
    const next = []
    combos.forEach((c) => o.values.forEach((v) => next.push([...c, v])))
    combos = next
  })
  const seed = (name || 'SKU').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'SKU'
  return combos.map((c, i) => ({
    label: c.join(' / '),
    sku: seed + '-' + c.map((v) => v.substring(0, 3).toUpperCase()).join('-'),
    barcode: '89640' + String(100000 + i).slice(-6),
    price: 0,
    stock: 0,
  }))
}

function SectionHead({ icon, iconColor, title, sub, optional }) {
  return (
    <div className="pc-section-head">
      <div className="pc-section-ic">
        <Icon name={icon} size={18} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="pc-section-title">
          {title}
          {optional && <span className="pc-optional-badge">optional</span>}
        </p>
        {sub && <p className="pc-section-sub">{sub}</p>}
      </div>
    </div>
  )
}

function Body({ state, setState, session, onClose, onSave }) {
  const showToast = useToast()
  const s = state
  const steps = PC_ALL_STEPS.filter((st) => st.types.includes(s.type))
  const stepId = steps[s.step]?.id
  const isLast = s.step === steps.length - 1

  const set = (patch) => setState((p) => ({ ...p, ...patch }))

  const setType = (type) => {
    if (s.type === type) return
    setState((p) => {
      const np = { ...p, type, step: 0 }
      if (type === 'variant' && np.options.length === 0) np.options = [{ name: '', values: [] }]
      return np
    })
  }

  const goto = (i) => {
    const clamped = Math.max(0, Math.min(i, steps.length - 1))
    set({ step: clamped })
    const el = document.getElementById('pc-scroll')
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validateStep = (id) => {
    if (id === 'basic') {
      if (!s.name.trim()) return showToast('Product name is required.', 'warning'), false
      if (!s.categoryId) return showToast('Please select a category.', 'warning'), false
    }
    if (id === 'options') {
      if (s.variants.filter((v) => v.label).length === 0)
        return showToast('Add at least one option with values to create variants.', 'warning'), false
    }
    if (id === 'bundle') {
      if (s.bundle.length === 0) return showToast('Add at least one product to the bundle.', 'warning'), false
    }
    if (id === 'pricing') {
      if (s.type !== 'variant' && !s.price)
        return showToast(s.type === 'bundle' ? 'Bundle price is required.' : 'Selling price is required.', 'warning'), false
    }
    return true
  }

  const next = () => {
    if (!validateStep(stepId)) return
    if (s.step < steps.length - 1) goto(s.step + 1)
  }
  const prev = () => s.step > 0 && goto(s.step - 1)

  // ── Options ──
  const setOptions = (options) => {
    setState((p) => ({ ...p, options, variants: generateVariants(options, p.name) }))
  }
  const addOption = () => set({ options: [...s.options, { name: '', values: [] }] })
  const removeOption = (idx) => setOptions(s.options.filter((_, i) => i !== idx))
  const setOptName = (idx, name) => set({ options: s.options.map((o, i) => (i === idx ? { ...o, name } : o)) })
  const setOptValues = (idx, raw) => {
    const values = raw.split(',').map((v) => v.trim()).filter(Boolean)
    setOptions(s.options.map((o, i) => (i === idx ? { ...o, values } : o)))
  }
  const regenerate = () => setState((p) => ({ ...p, variants: generateVariants(p.options, p.name) }))
  const setVariant = (idx, patch) => set({ variants: s.variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)) })

  // ── Details ──
  const addDetail = (field, value) => set({ details: [...s.details, { field, value }] })
  const setDetail = (idx, patch) => set({ details: s.details.map((d, i) => (i === idx ? { ...d, ...patch } : d)) })
  const removeDetail = (idx) => set({ details: s.details.filter((_, i) => i !== idx) })

  // ── Bundle ──
  const [bundleQ, setBundleQ] = useState('')
  const chosen = new Set(s.bundle.map((b) => b.sku))
  const bundleResults = session
    ? (session.products || [])
        .filter(
          (p) =>
            !chosen.has(p.sku) &&
            (!bundleQ ||
              p.name.toLowerCase().includes(bundleQ.toLowerCase()) ||
              p.sku.toLowerCase().includes(bundleQ.toLowerCase()) ||
              (p.variant || '').toLowerCase().includes(bundleQ.toLowerCase())),
        )
        .slice(0, 8)
    : []
  const addBundleItem = (p) => {
    if (s.bundle.some((b) => b.sku === p.sku)) return
    set({ bundle: [...s.bundle, { sku: p.sku, name: p.name, variant: p.variant, price: p.price, qty: 1 }] })
    setBundleQ('')
  }
  const bundleQty = (idx, delta) =>
    set({ bundle: s.bundle.map((b, i) => (i === idx ? { ...b, qty: Math.max(1, (b.qty || 1) + delta) } : b)) })
  const removeBundleItem = (idx) => set({ bundle: s.bundle.filter((_, i) => i !== idx) })

  const handleSave = (mode) => {
    if (!validateStep('basic')) return
    if (s.type === 'variant' && !validateStep('options')) return
    if (s.type === 'bundle' && !validateStep('bundle')) return
    if (!validateStep('pricing')) return

    const type = s.type
    const name = s.name.trim()
    const catId = +s.categoryId
    const catLeaf = catById(catId)?.name || ''
    const price = +s.price || 0
    const reorder = +s.reorder || 0
    const baseSku = s.sku || name.substring(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-4)
    const stock = +s.stock || 0
    const status = mode === 'publish' ? s.status || 'active' : 'draft'
    const uom = s.uom
    const variants = s.variants.filter((v) => v.label)

    let rows = []
    let added = '1 product'
    if (type === 'variant' && variants.length) {
      rows = variants.map((v) => ({
        name, variant: v.label, sku: v.sku, cat: catLeaf, price: v.price || 0,
        onHand: v.stock || 0, reserved: 0, reorder, batch: false, type, status,
      }))
      added = `${variants.length} variants`
    } else if (type === 'bundle') {
      const bundleStock = s.bundleRule === 'bundle' ? stock : 0
      rows = [{
        name, variant: `Bundle · ${s.bundle.length} items`, sku: baseSku, cat: catLeaf, price,
        onHand: bundleStock, reserved: 0, reorder, batch: false, type, status,
        bundleItems: s.bundle.slice(), bundleRule: s.bundleRule,
      }]
      added = `bundle of ${s.bundle.length} products`
    } else {
      rows = [{ name, variant: uom, sku: baseSku, cat: catLeaf, price, onHand: stock, reserved: 0, reorder, batch: false, type, status }]
    }
    onSave({ rows, editing: s.editing, mode, added, name })
  }

  // ── Review derived values ──
  const catPathStr = s.categoryId ? catPath(catById(+s.categoryId)) : '—'
  const typeLabel = cap(s.type)
  const statusCls =
    { active: 'text-brand-green bg-brand-green/10', draft: 'text-brand-orange bg-brand-orange/10', inactive: 'text-gray-500 bg-gray-100' }[s.status] ||
    'text-gray-500 bg-gray-100'
  const reviewVariants = s.variants.filter((v) => v.label)
  let margin = '—'
  if (s.price && s.cost && +s.price > 0) margin = Math.round(((+s.price - +s.cost) / +s.price) * 100) + '%'
  let heroPrice = money(s.price)
  let heroPriceLabel = 'Selling price'
  if (s.type === 'variant') {
    const prices = reviewVariants.map((v) => +v.price || 0).filter(Boolean)
    if (prices.length) {
      const mn = Math.min(...prices), mx = Math.max(...prices)
      heroPrice = mn === mx ? money(mn) : `${money(mn)}–${money(mx)}`
    } else heroPrice = 'Per variant'
    heroPriceLabel = reviewVariants.length + ' variants'
  } else if (s.type === 'bundle') {
    heroPriceLabel = 'Bundle price'
  }

  const cell = (label, val, full) => (
    <div className={`pc-review-cell${full ? ' full' : ''}`}>
      <p className="k">{label}</p>
      <p className="v">{val}</p>
    </div>
  )
  const ReviewGroup = ({ title, icon, children }) => (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon name={icon} size={13} style={{ color: '#94a3b8' }} />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em]">{title}</p>
      </div>
      {children}
    </div>
  )

  return (
    <div id="pc-scroll" className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border sticky top-0 bg-white z-20">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#1a2d6b,#3366cc)' }}>
              <Icon name="cube" size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">{s.editing ? 'Edit Product' : 'Add Product'}</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">{steps[s.step]?.name} · Step {s.step + 1}/{steps.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
            <Icon name="close-outline" size={18} style={{ color: '#64748b' }} />
          </button>
        </div>
        {/* Stepper */}
        <div className="pc-stepper">
          {steps.map((st, i) => (
            <div key={st.id} className="contents">
              <div className={`pc-step ${i === s.step ? 'active' : ''} ${i < s.step ? 'done' : ''}`} onClick={() => i <= s.step && goto(i)}>
                <div className="pc-step-dot">{i + 1}</div>
                <span className="pc-step-label">{st.short}</span>
              </div>
              {i < steps.length - 1 && <div className={`pc-conn ${i < s.step ? 'done' : ''}`}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1">
        {stepId === 'basic' && (
          <>
            <SectionHead icon="information-circle-outline" iconColor="#1a2d6b" title="General" sub="Core information every product needs." />
            <div className="space-y-4 mb-6">
              <div>
                <label className="pc-label">Product Name <span className="text-brand-red">*</span></label>
                <input type="text" className="inp" placeholder="e.g. Sunsilk Shampoo" value={s.name} onChange={(e) => set({ name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="pc-label">Category <span className="text-brand-red">*</span></label>
                  <select className="inp select-inp" value={s.categoryId} onChange={(e) => set({ categoryId: e.target.value })}>
                    <option value="">Select category…</option>
                    {CATS.map((c) => (
                      <option key={c.id} value={c.id}>{c.path}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="pc-label">Status</label>
                  <select className="inp select-inp" value={s.status} onChange={(e) => set({ status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="pc-label">Product Type <span className="text-brand-red">*</span></label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { t: 'simple', ic: 'cube-outline', label: 'Simple' },
                    { t: 'variant', ic: 'grid-outline', label: 'Variant' },
                    { t: 'bundle', ic: 'albums-outline', label: 'Bundle' },
                  ].map((c) => (
                    <div key={c.t} className={`pc-type-card ${s.type === c.t ? 'active' : ''}`} onClick={() => setType(c.t)}>
                      <Icon name="checkmark-circle" className="pc-type-check" />
                      <div className="pc-type-ic"><Icon name={c.ic} className="text-navy" /></div>
                      <p className="text-[12px] font-bold text-navy-dark">{c.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10.5px] text-gray-400 mt-2">{TYPE_HINTS[s.type]}</p>
              </div>
              <div>
                <label className="pc-label">Description</label>
                <textarea rows={3} className="inp resize-none" placeholder="Short description of the product…" value={s.description} onChange={(e) => set({ description: e.target.value })} />
              </div>
            </div>

            <div className="pc-divider"></div>

            <SectionHead icon="reader-outline" iconColor="#7c4dff" title="Product Details" optional sub="Attributes that describe the product but don't create variants." />
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {['Material', 'Warranty', 'Ingredients', 'Dimensions', 'Country of Origin', 'Storage Instructions'].map((f) => (
                  <button key={f} onClick={() => addDetail(f, '')} className="pc-preset-chip">+ {f}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              {s.details.map((d, i) => (
                <div key={i} className="pc-detail-row">
                  <input type="text" value={d.field} placeholder="Field (e.g. Material)" className="inp text-[12px]" onChange={(e) => setDetail(i, { field: e.target.value })} />
                  <input type="text" value={d.value} placeholder="Value (e.g. Cotton)" className="inp text-[12px]" onChange={(e) => setDetail(i, { value: e.target.value })} />
                  <button onClick={() => removeDetail(i)} className="w-8 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition shrink-0">
                    <Icon name="trash-outline" size={14} style={{ color: '#eb445a' }} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addDetail('', '')} className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-brand-blue hover:underline">
              <Icon name="add-circle-outline" size={16} /> Add custom detail
            </button>
          </>
        )}

        {stepId === 'options' && (
          <>
            <SectionHead icon="grid-outline" iconColor="#7c4dff" title="Product Options" sub="Add options like Color or Size — variants are generated automatically." />
            <div className="space-y-3">
              {s.options.map((o, idx) => (
                <div key={idx} className="pc-opt-row">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-navy/10 flex items-center justify-center shrink-0 text-[10px] font-extrabold text-navy">{idx + 1}</div>
                    <input type="text" value={o.name} placeholder="Option name (e.g. Size)" className="inp text-[12px] flex-1" onChange={(e) => setOptName(idx, e.target.value)} />
                    <button onClick={() => removeOption(idx)} className="w-8 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition shrink-0">
                      <Icon name="trash-outline" size={14} style={{ color: '#eb445a' }} />
                    </button>
                  </div>
                  <input type="text" defaultValue={(o.values || []).join(', ')} placeholder="Values, comma separated (e.g. S, M, L)" className="inp text-[12px] mt-2" onChange={(e) => setOptValues(idx, e.target.value)} />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(o.values || []).map((v) => (
                      <span key={v} className="pc-opt-chip"><Icon name="pricetag-outline" size={10} />{v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addOption} className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-brand-blue hover:underline">
              <Icon name="add-circle-outline" size={16} /> Add another option
            </button>

            {s.variants.length > 0 ? (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">Variant Table ({s.variants.length})</p>
                  <button onClick={regenerate} className="text-[11px] font-semibold text-brand-blue hover:underline">↻ Regenerate</button>
                </div>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.06em] px-3 py-2 bg-gray-50/60 border-b border-border" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 0.8fr 0.7fr' }}>
                    <div>Variant</div>
                    <div>SKU</div>
                    <div>Barcode</div>
                    <div className="text-right">Price</div>
                    <div className="text-right">Stock</div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {s.variants.map((v, i) => (
                      <div key={i} className="pc-variant-row grid items-center gap-2 px-3 py-2.5" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 0.8fr 0.7fr' }}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0"></span>
                          <p className="text-[11.5px] font-semibold text-navy-dark truncate">{v.label}</p>
                        </div>
                        <input value={v.sku} className="pc-mini-inp font-mono" onChange={(e) => setVariant(i, { sku: e.target.value })} />
                        <input value={v.barcode} className="pc-mini-inp font-mono" onChange={(e) => setVariant(i, { barcode: e.target.value })} />
                        <input type="number" value={v.price} className="pc-mini-inp text-right" onChange={(e) => setVariant(i, { price: +e.target.value })} />
                        <input type="number" value={v.stock} className="pc-mini-inp text-right" onChange={(e) => setVariant(i, { stock: +e.target.value })} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-xl">
                <Icon name="grid-outline" size={26} style={{ color: '#cbd5e1' }} />
                <p className="text-[12px] font-semibold text-gray-500 mt-2">No variants yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Add an option with values (e.g. S, M, L) to generate variants.</p>
              </div>
            )}
          </>
        )}

        {stepId === 'bundle' && (
          <>
            <SectionHead icon="albums-outline" iconColor="#ff9800" title="Bundle Builder" sub="Combine existing products into a single sellable bundle." />
            <div className="relative mb-4">
              <div className="flex items-center gap-2 bg-white border-[1.5px] border-border rounded-lg px-3 py-2.5">
                <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <input type="text" placeholder="Search products to add…" value={bundleQ} onChange={(e) => setBundleQ(e.target.value)} className="flex-1 text-[12px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent" />
              </div>
              {bundleQ && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-y-auto thin-scroll" style={{ maxHeight: 220 }}>
                  {bundleResults.length === 0 ? (
                    <p className="text-[11px] text-gray-400 text-center py-4">No products match.</p>
                  ) : (
                    bundleResults.map((p) => (
                      <button key={p.sku} onClick={() => addBundleItem(p)} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition text-left border-b border-gray-100 last:border-0">
                        <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={13} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-navy-dark truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{p.variant || ''} · {p.sku}</p>
                        </div>
                        <Icon name="add-circle-outline" className="text-brand-blue shrink-0" size={17} />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {s.bundle.length > 0 ? (
              <div className="space-y-2">
                {s.bundle.map((b, i) => (
                  <div key={b.sku} className="flex items-center gap-3 bg-white border border-border rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-brand-orange" size={15} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-navy-dark truncate">{b.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{b.variant || ''} · {b.sku}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => bundleQty(i, -1)} className="w-6 h-6 rounded-md border border-border flex items-center justify-center hover:bg-gray-50"><Icon name="remove-outline" size={13} style={{ color: '#64748b' }} /></button>
                      <span className="text-[12px] font-bold text-navy-dark w-6 text-center">{b.qty}</span>
                      <button onClick={() => bundleQty(i, 1)} className="w-6 h-6 rounded-md border border-border flex items-center justify-center hover:bg-gray-50"><Icon name="add-outline" size={13} style={{ color: '#64748b' }} /></button>
                    </div>
                    <button onClick={() => removeBundleItem(i)} className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition shrink-0">
                      <Icon name="trash-outline" size={14} style={{ color: '#eb445a' }} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-xl">
                <Icon name="cube-outline" size={26} style={{ color: '#cbd5e1' }} />
                <p className="text-[12px] font-semibold text-gray-500 mt-2">No products added</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Search above to add products to this bundle.</p>
              </div>
            )}
          </>
        )}

        {stepId === 'pricing' && (
          <>
            <SectionHead
              icon="pricetag-outline"
              iconColor="#2dd36f"
              title={s.type === 'bundle' ? 'Bundle Pricing' : 'Pricing'}
              sub={s.type === 'bundle' ? 'Set the price for the whole bundle.' : 'Set what the product costs and sells for.'}
            />
            {s.type === 'variant' && (
              <div className="flex items-start gap-2.5 bg-brand-purple/5 border border-brand-purple/20 rounded-xl px-4 py-3 mb-4">
                <Icon name="information-circle-outline" size={14} style={{ color: '#7c4dff', flexShrink: 0, marginTop: 1 }} />
                <p className="text-[11px] text-gray-600">This is a <b>variant</b> product — price, SKU and stock are set per variant in the Product Options step. Cost and unit settings below apply to all variants.</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="pc-label">Cost Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">Rs.</span>
                  <input type="number" className="inp" style={{ paddingLeft: 34 }} placeholder="0" value={s.cost} onChange={(e) => set({ cost: e.target.value })} />
                </div>
              </div>
              {s.type !== 'variant' && (
                <div>
                  <label className="pc-label">{s.type === 'bundle' ? 'Bundle Price' : 'Selling Price'} <span className="text-brand-red">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">Rs.</span>
                    <input type="number" className="inp" style={{ paddingLeft: 34 }} placeholder="0" value={s.price} onChange={(e) => set({ price: e.target.value })} />
                  </div>
                </div>
              )}
            </div>

            <div className="pc-divider"></div>

            <SectionHead icon="cube-outline" iconColor="#1a2d6b" title="Inventory" sub={s.type === 'bundle' ? 'Choose how bundle stock is tracked.' : 'Identify and track stock for this product.'} />

            {s.type === 'bundle' && (
              <div className="mb-5">
                <label className="pc-label">Inventory Rule</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className={`pc-rule-card ${s.bundleRule === 'bundle' ? 'active' : ''}`} onClick={() => set({ bundleRule: 'bundle' })}>
                    <Icon name="checkmark-circle" className="pc-type-check" />
                    <p className="text-[12px] font-bold text-navy-dark">Track Bundle Stock</p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Bundle has its own stock count.</p>
                  </div>
                  <div className={`pc-rule-card ${s.bundleRule === 'individual' ? 'active' : ''}`} onClick={() => set({ bundleRule: 'individual' })}>
                    <Icon name="checkmark-circle" className="pc-type-check" />
                    <p className="text-[12px] font-bold text-navy-dark">Track Individual Products</p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Stock follows each component.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {s.type !== 'variant' && (
                <div>
                  <label className="pc-label">SKU</label>
                  <input type="text" className="inp" placeholder="e.g. SS-400-BLU" value={s.sku} onChange={(e) => set({ sku: e.target.value })} />
                </div>
              )}
              {s.type !== 'variant' && (
                <div>
                  <label className="pc-label">Barcode</label>
                  <input type="text" className="inp" placeholder="e.g. 8964000123456" value={s.barcode} onChange={(e) => set({ barcode: e.target.value })} />
                </div>
              )}
              <div>
                <label className="pc-label">Unit of Measure</label>
                <select className="inp select-inp" value={s.uom} onChange={(e) => set({ uom: e.target.value })}>
                  {UOMS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
              {(s.type === 'simple' || (s.type === 'bundle' && s.bundleRule === 'bundle')) && (
                <div>
                  <label className="pc-label">Opening Stock</label>
                  <input type="number" className="inp" placeholder="0" value={s.stock} onChange={(e) => set({ stock: e.target.value })} />
                </div>
              )}
              {s.type !== 'variant' && (
                <div>
                  <label className="pc-label">Low Stock Alert (Reorder at)</label>
                  <input type="number" className="inp" placeholder="e.g. 100" value={s.reorder} onChange={(e) => set({ reorder: e.target.value })} />
                </div>
              )}
              {s.type === 'variant' && (
                <div>
                  <label className="pc-label">Low Stock Alert (Reorder at)</label>
                  <input type="number" className="inp" placeholder="e.g. 100" value={s.reorder} onChange={(e) => set({ reorder: e.target.value })} />
                </div>
              )}
            </div>
          </>
        )}

        {stepId === 'media' && (
          <>
            <SectionHead icon="images-outline" iconColor="#3366cc" title="Images" optional sub="Add a main image and gallery shots." />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="pc-label">Main Image</label>
                <div className="pc-dropzone h-full flex flex-col items-center justify-center" onClick={() => showToast('Image picker is mocked in this demo.', 'info')}>
                  <Icon name="image-outline" size={26} style={{ color: '#94a3b8' }} />
                  <p className="text-[11px] font-semibold text-navy-dark mt-1.5">Upload</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">PNG/JPG · 5MB</p>
                </div>
              </div>
              <div className="col-span-2">
                <label className="pc-label">Gallery Images</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="pc-dropzone" style={{ padding: 14 }} onClick={() => showToast('Image picker is mocked in this demo.', 'info')}>
                      <Icon name="add-outline" size={22} style={{ color: '#94a3b8' }} />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Variant images can be added per-variant after saving.</p>
              </div>
            </div>

            <div className="pc-divider"></div>

            <SectionHead icon="globe-outline" iconColor="#2dd36f" title="Marketplace" optional sub="Control online availability and search visibility." />
            <div className="space-y-4">
              <div>
                <label className="pc-label">SEO Title</label>
                <input type="text" className="inp" placeholder="Title shown in search results" value={s.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} />
              </div>
              <div>
                <label className="pc-label">SEO Description</label>
                <textarea rows={2} className="inp resize-none" placeholder="Meta description for search engines…" value={s.seoDesc} onChange={(e) => set({ seoDesc: e.target.value })} />
              </div>
            </div>
          </>
        )}

        {stepId === 'review' && (
          <>
            <div className="flex items-start gap-2.5 bg-brand-green/5 border border-brand-green/20 rounded-xl px-4 py-3 mb-5">
              <Icon name="checkmark-circle-outline" size={15} style={{ color: '#2dd36f', flexShrink: 0, marginTop: 1 }} />
              <p className="text-[11px] text-gray-600">Review the summary below, then save as draft or publish.</p>
            </div>
            <div className="space-y-3">
              <div className="pc-hero">
                <div className="pc-hero-ic"><Icon name={s.type === 'bundle' ? 'albums-outline' : s.type === 'variant' ? 'grid-outline' : 'cube-outline'} size={24} style={{ color: '#fff' }} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-extrabold leading-tight truncate">{s.name || '—'}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>{cap(s.status)}</span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5 truncate">{catPathStr}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[16px] font-extrabold leading-none">{heroPrice}</p>
                  <p className="text-[10px] text-white/50 mt-1">{heroPriceLabel}</p>
                </div>
              </div>

              <ReviewGroup title="Overview" icon="information-circle-outline">
                <div className="pc-review-grid">
                  {cell('Product Type', typeLabel)}
                  {cell('Category', catPathStr)}
                  {s.type === 'variant'
                    ? cell('Variants', reviewVariants.length + ' generated')
                    : cell('SKU', <span className="font-mono text-[12px]">{s.sku || '—'}</span>)}
                  {s.type === 'variant'
                    ? cell('SKU Prefix', <span className="font-mono text-[12px]">{(reviewVariants[0]?.sku || '—').split('-')[0]}</span>)
                    : cell('Barcode', s.barcode ? <span className="font-mono text-[12px]">{s.barcode}</span> : '—')}
                </div>
              </ReviewGroup>

              {s.type === 'variant' && reviewVariants.length > 0 && (
                <ReviewGroup title={`Variants · ${reviewVariants.length}`} icon="grid-outline">
                  <div className="border border-border rounded-xl overflow-hidden divide-y divide-gray-100">
                    {reviewVariants.map((v, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0"></span>
                          <span className="text-[12px] font-semibold text-navy-dark truncate">{v.label}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10.5px] font-mono text-gray-400">{v.sku}</span>
                          <span className="text-[11.5px] font-bold text-navy-dark">{money(v.price)}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy/8 text-navy">{v.stock || 0} pcs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ReviewGroup>
              )}

              {s.type === 'bundle' && s.bundle.length > 0 && (
                <ReviewGroup title={`Bundle Contains · ${s.bundle.length}`} icon="albums-outline">
                  <div className="border border-border rounded-xl overflow-hidden divide-y divide-gray-100">
                    {s.bundle.map((b, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                          <span className="text-[12px] font-semibold text-navy-dark truncate">{b.name}{b.variant ? ' · ' + b.variant : ''}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy/8 text-navy shrink-0">× {b.qty}</span>
                      </div>
                    ))}
                  </div>
                </ReviewGroup>
              )}

              <ReviewGroup title={s.type === 'bundle' ? 'Bundle Pricing' : 'Pricing & Inventory'} icon="pricetag-outline">
                <div className="pc-review-grid">
                  {s.type === 'simple' && (
                    <>
                      {cell('Cost Price', money(s.cost))}
                      {cell('Selling Price', money(s.price))}
                      {cell('Margin', margin)}
                      {cell('Unit of Measure', s.uom)}
                      {cell('Opening Stock', (s.stock || '0') + ' units')}
                      {cell('Reorder At', s.reorder ? s.reorder + ' units' : '—')}
                    </>
                  )}
                  {s.type === 'variant' && (
                    <>
                      {cell('Cost Price', money(s.cost))}
                      {cell('Unit of Measure', s.uom)}
                      {cell('Reorder At', s.reorder ? s.reorder + ' units' : '—')}
                      {cell('Pricing', 'Set per variant')}
                    </>
                  )}
                  {s.type === 'bundle' && (
                    <>
                      {cell('Cost Price', money(s.cost))}
                      {cell('Bundle Price', money(s.price))}
                      {cell('Margin', margin)}
                      {cell('Unit of Measure', s.uom)}
                      {cell('Inventory Rule', s.bundleRule === 'bundle' ? 'Track bundle stock' : 'Track individual products')}
                      {s.bundleRule === 'bundle' && cell('Opening Stock', (s.stock || '0') + ' units')}
                    </>
                  )}
                </div>
              </ReviewGroup>

              {s.details.filter((d) => d.field).length > 0 && (
                <ReviewGroup title={`Product Details · ${s.details.filter((d) => d.field).length}`} icon="reader-outline">
                  <div className="border border-border rounded-xl overflow-hidden divide-y divide-gray-100">
                    {s.details.filter((d) => d.field).map((d, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 px-3.5 py-2">
                        <span className="text-[11px] font-semibold text-gray-500">{d.field}</span>
                        <span className="text-[12px] font-semibold text-navy-dark text-right truncate">{d.value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </ReviewGroup>
              )}

              {(s.description || s.seoTitle || s.seoDesc) && (
                <ReviewGroup title="Content" icon="globe-outline">
                  <div className="pc-review-grid">
                    {s.description && cell('Description', s.description, true)}
                    {s.seoTitle && cell('SEO Title', s.seoTitle, true)}
                    {s.seoDesc && cell('SEO Description', s.seoDesc, true)}
                  </div>
                </ReviewGroup>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white" style={{ boxShadow: '0 -4px 16px rgba(10,21,53,0.04)' }}>
        <button onClick={prev} style={{ visibility: s.step === 0 ? 'hidden' : 'visible' }} className="flex items-center gap-1.5 px-4 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">
          <Icon name="arrow-back-outline" size={15} />Back
        </button>
        <div className="flex-1"></div>
        {!isLast ? (
          <button onClick={next} className="flex items-center gap-1.5 px-6 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">
            Next <Icon name="arrow-forward-outline" size={15} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => handleSave('draft')} className="px-4 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Save Draft</button>
            <button onClick={() => handleSave('publish')} className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition">
              <Icon name="checkmark-outline" size={16} />Save &amp; Publish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// `session` = { editing: group|null, products: [...] } or null (closed).
export default function ProductWizard({ session, onClose, onSave }) {
  const [state, setState] = useState(baseState)

  useEffect(() => {
    if (session) setState(makeState(session))
  }, [session])

  return (
    <Slideover
      item={session}
      onClose={onClose}
      width={720}
      render={() => <Body state={state} setState={setState} session={session} onClose={onClose} onSave={onSave} />}
    />
  )
}
