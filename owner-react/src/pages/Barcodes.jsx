import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import BarcodePreviewModal from '../components/barcodes/BarcodePreviewModal'
import BarcodeLabel from '../components/barcodes/BarcodeLabel'
import { INV_DATA, pmBarcode } from '../data/productData'

const FORMATS = [
  { key: 'CODE128', label: 'Code 128' },
  { key: 'EAN13', label: 'EAN-13' },
  { key: 'QR', label: 'QR Code' },
]

const SIZES = [
  { key: 'standard', label: '50mm × 25mm (standard)' },
  { key: 'large', label: '100mm × 50mm (large)' },
  { key: 'small', label: '38mm × 19mm (small)' },
]

// Simple stock status for the selector rows.
function invStatus(item) {
  if (item.onHand === 0) return { label: 'Out of Stock', cls: 'text-brand-red bg-brand-red/10' }
  if (item.reorder && item.onHand <= item.reorder) return { label: 'Low Stock', cls: 'text-brand-orange bg-brand-orange/10' }
  return { label: 'In Stock', cls: 'text-brand-green bg-brand-green/10' }
}

export default function Barcodes() {
  const showToast = useToast()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [fmt, setFmt] = useState('CODE128')
  const [sizeKey, setSizeKey] = useState('standard')
  const [copies, setCopies] = useState(1)
  const [inclName, setInclName] = useState(true)
  const [inclVariant, setInclVariant] = useState(true)
  const [inclPrice, setInclPrice] = useState(false)

  const [preview, setPreview] = useState(null)
  const [printJob, setPrintJob] = useState(null)

  const products = useMemo(() => {
    const q = search.toLowerCase()
    return INV_DATA.filter((i) => !q || i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || pmBarcode(i).includes(q))
  }, [search])

  const toggle = (sku) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(sku)) next.delete(sku)
      else next.add(sku)
      return next
    })

  const settings = { fmt, sizeKey, copies: Math.max(1, copies || 1), inclName, inclVariant, inclPrice }

  const generatePreview = () => {
    if (selected.size === 0) {
      showToast('Select at least one product first.', 'warning')
      return
    }
    const picked = INV_DATA.filter((p) => selected.has(p.sku))
    setPreview({ products: picked, settings })
  }

  const doPrint = () => {
    const picked = INV_DATA.filter((p) => selected.has(p.sku))
    setPreview(null)
    setPrintJob({ products: picked, settings })
  }

  // Once the print sheet is rendered, trigger the browser print dialog.
  useEffect(() => {
    if (!printJob) return
    const t = setTimeout(() => {
      window.print()
      setPrintJob(null)
    }, 450)
    return () => clearTimeout(t)
  }, [printJob])

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" size={15} style={{ color: '#3366cc', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Select products below to generate and print barcode labels. Supported formats: <strong className="text-navy-dark">Code 128, EAN-13, QR Code</strong>. Barcode assignment updates globally — every store sees the new barcode immediately.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {/* Product selector */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <p className="text-[13px] font-semibold text-navy-dark">Select Products</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Choose variants to print barcodes for</p>
            </div>
            <span className="text-[11px] font-bold text-brand-blue bg-brand-blue/10 px-2.5 py-1 rounded-full">{selected.size} selected</span>
          </div>
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border">
              <Icon name="search-outline" size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search product, SKU, barcode…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-100 overflow-y-auto thin-scroll" style={{ maxHeight: 420 }}>
            {products.length === 0 ? (
              <div className="py-16 text-center">
                <Icon name="cube-outline" size={28} style={{ color: '#cbd5e1' }} />
                <p className="text-[12px] text-gray-400 mt-2">No products found</p>
              </div>
            ) : (
              products.map((i) => {
                const st = invStatus(i)
                return (
                  <label key={i.sku} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/70 cursor-pointer transition">
                    <input type="checkbox" checked={selected.has(i.sku)} onChange={() => toggle(i.sku)} className="w-4 h-4 rounded accent-navy" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-navy-dark truncate">{i.name} <span className="text-gray-400 font-normal">— {i.variant}</span></p>
                      <p className="text-[10px] text-gray-400 font-mono">{i.sku} · {pmBarcode(i)}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                  </label>
                )
              })
            )}
          </div>
        </div>

        {/* Print config */}
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[13px] font-semibold text-navy-dark mb-4">Print Settings</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Barcode Format</label>
              <div className="grid grid-cols-3 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFmt(f.key)}
                    className={`px-3 py-2.5 rounded-xl text-[11px] transition ${fmt === f.key ? 'border-2 border-navy bg-navy/5 font-semibold text-navy' : 'border border-border font-medium text-gray-500 hover:border-navy/30'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Label Size</label>
              <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)} className="text-[12px] font-medium text-gray-700 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer w-full">
                {SIZES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Copies per Label</label>
              <input type="number" min="1" max="100" value={copies} onChange={(e) => setCopies(parseInt(e.target.value, 10) || 1)} className="text-[12px] font-medium text-gray-700 bg-page border border-border rounded-lg px-3 py-2 w-full" />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-gray-600">Include on Label</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inclName} onChange={(e) => setInclName(e.target.checked)} className="w-4 h-4 rounded accent-navy" />
                <span className="text-[12px] text-gray-600">Product Name</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inclVariant} onChange={(e) => setInclVariant(e.target.checked)} className="w-4 h-4 rounded accent-navy" />
                <span className="text-[12px] text-gray-600">Variant Info</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inclPrice} onChange={(e) => setInclPrice(e.target.checked)} className="w-4 h-4 rounded accent-navy" />
                <span className="text-[12px] text-gray-600">Price</span>
              </label>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button onClick={generatePreview} className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">
              <Icon name="eye-outline" size={16} /> Preview &amp; Print
            </button>
          </div>
        </div>
      </div>

      <BarcodePreviewModal state={preview} onClose={() => setPreview(null)} onPrint={doPrint} />

      {/* Print sheet — portaled into <body> so print CSS can isolate it */}
      {printJob &&
        createPortal(
          <div id="bc-print-sheet">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6mm', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {printJob.products.map((p) =>
                Array.from({ length: printJob.settings.copies }).map((_, c) => (
                  <BarcodeLabel key={`${p.sku}-${c}`} product={p} settings={printJob.settings} />
                )),
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
