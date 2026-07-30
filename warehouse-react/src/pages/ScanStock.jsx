import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import { INV_DATA, STORE_INVENTORY, WH_FULFILLERS, storeMeta, storeInitial } from '../data/warehouseData'
import { pmBarcode } from '../data/productData'

const SS_STORES = WH_FULFILLERS

function ssStatus(qty, reorder) {
  if (qty === 0) return { key: 'out', label: 'Out', cls: 'text-brand-red bg-brand-red/10' }
  if (qty <= reorder) return { key: 'low', label: 'Low', cls: 'text-brand-orange bg-brand-orange/10' }
  return { key: 'ok', label: 'In Stock', cls: 'text-brand-green bg-brand-green/10' }
}
function ssQtyColor(qty, reorder) {
  if (qty === 0) return '#eb445a'
  if (qty <= reorder) return '#ff9800'
  return '#0a1535'
}

// Per-branch stock for a SKU, using each branch's lighter reorder point.
function branchStock(row) {
  const reorder = Math.max(4, Math.round((row.reorder || 60) / 3))
  return SS_STORES.map((st) => {
    const q = (STORE_INVENTORY[st] || {})[row.sku] || 0
    return { store: st, qty: q, reorder, ...ssStatus(q, reorder) }
  })
}

export default function ScanStock({ onNavigate }) {
  const showToast = useToast()
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null) // { row } | null
  const [notFound, setNotFound] = useState('')
  const inputRef = useRef(null)
  const camRef = useRef(null)
  const [camOn, setCamOn] = useState(false)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200)
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const samples = useMemo(() => {
    const picks = [INV_DATA[0], INV_DATA.find((p) => p.type === 'variant'), INV_DATA.find((p) => p.onHand === 0)].filter(Boolean)
    const seen = new Set()
    return picks.filter((p) => !seen.has(p.sku) && seen.add(p.sku))
  }, [])

  const resolve = (raw) => {
    const v = (raw != null && typeof raw === 'string' ? raw : value).trim()
    if (!v) return
    const lv = v.toLowerCase()
    const row =
      INV_DATA.find((r) => pmBarcode(r) === v) ||
      INV_DATA.find((r) => (r.sku || '').toLowerCase() === lv) ||
      INV_DATA.find((r) => (r.name || '').toLowerCase().includes(lv) || (r.variant || '').toLowerCase().includes(lv))
    if (!row) {
      setResult(null)
      setNotFound(`Nothing in the catalog matches “${v}”.`)
      return
    }
    setNotFound('')
    setResult({ row })
  }

  const sample = (code) => { setValue(code); resolve(code) }
  const reset = () => { setValue(''); setResult(null); setNotFound(''); inputRef.current?.focus() }

  // ── Optional camera QR/barcode scan (html5-qrcode loaded via CDN in index.html) ──
  const stopCamera = () => {
    if (camRef.current) {
      try { camRef.current.stop().then(() => camRef.current.clear()).catch(() => {}) } catch { /* noop */ }
      camRef.current = null
    }
    setCamOn(false)
  }
  const toggleCamera = () => {
    if (camOn) return stopCamera()
    const Html5Qrcode = window.Html5Qrcode
    if (typeof Html5Qrcode === 'undefined') return showToast('Camera scanner is still loading — try again in a moment.', 'info')
    setCamOn(true)
    setTimeout(() => {
      camRef.current = new Html5Qrcode('scan-cam-view')
      camRef.current
        .start({ facingMode: 'environment' }, { fps: 10, qrbox: 220 }, (text) => { stopCamera(); setValue(text); resolve(text) }, () => {})
        .catch((err) => { showToast('Camera unavailable: ' + err, 'error'); stopCamera() })
    }, 50)
  }

  const row = result?.row
  const avail = row ? (row.onHand || 0) - (row.reserved || 0) : 0
  const whStatus = !row
    ? null
    : row.onHand === 0
    ? { l: 'Out of Stock', c: 'text-brand-red bg-brand-red/10' }
    : row.reorder && row.onHand <= row.reorder
    ? { l: 'Low Stock', c: 'text-brand-orange bg-brand-orange/10' }
    : { l: 'In Stock', c: 'text-brand-green bg-brand-green/10' }

  return (
    <div className="p-8 max-md:p-3.5">
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" size={15} style={{ color: '#3366cc', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-navy-dark">Scan any product to instantly see its stock everywhere.</strong> Use a USB/Bluetooth scanner (it types here automatically), your device camera, or just type a SKU/barcode. You'll get the warehouse count and the live stock in every branch.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 items-start max-md:grid-cols-1">
        {/* Scanner card */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#1a2d6b,#3366cc)' }}>
              <Icon name="scan-outline" size={18} style={{ color: '#fff' }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-navy-dark">Scanner</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Scan, or type a SKU / barcode</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 bg-white border-[1.5px] border-navy/30 rounded-xl px-3 py-3 focus-within:border-navy transition">
              <Icon name="barcode-outline" size={20} style={{ color: '#1a2d6b', flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                placeholder="Scan barcode / QR or type SKU, then Enter…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); resolve() } }}
                className="flex-1 text-[13px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent"
              />
              <button onClick={() => resolve()} className="text-[12px] font-semibold text-white bg-navy px-3 py-1.5 rounded-lg hover:bg-navy-light transition shrink-0">Check</button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10.5px] text-gray-400">Point a USB/Bluetooth scanner here.</p>
              <button onClick={toggleCamera} className="text-[11px] font-semibold text-brand-blue hover:underline flex items-center gap-1">
                <Icon name="camera-outline" size={13} /> {camOn ? 'Stop camera' : 'Use camera'}
              </button>
            </div>

            {camOn && (
              <div className="mt-3 rounded-xl overflow-hidden border border-border bg-black">
                <div id="scan-cam-view" style={{ width: '100%' }}></div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.06em] mb-1.5">Try a sample</p>
              <div className="flex flex-wrap gap-1.5">
                {samples.map((p) => (
                  <button key={p.sku} onClick={() => sample(pmBarcode(p))} className="pc-preset-chip flex items-center gap-1">
                    <Icon name="barcode-outline" size={12} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result card */}
        <div className="bg-white rounded-xl border border-border overflow-hidden min-h-[200px]">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[13px] font-semibold text-navy-dark">Stock Result</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Warehouse &amp; branch stock for the scanned product</p>
          </div>
          <div className="p-5">
            {row ? (
              <>
                {/* Product header */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-gray-50 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[16px] font-extrabold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#1a2d6b,#3366cc)' }}>
                    {(row.name.trim()[0] || '?').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-extrabold text-navy-dark truncate">{row.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{row.variant || ''}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU {row.sku} · {pmBarcode(row)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${whStatus.c}`}>{whStatus.l}</span>
                </div>

                {/* Warehouse stock */}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.06em] mb-1.5">Central Warehouse</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-xl border border-border px-3 py-2.5 text-center"><p className="text-[17px] font-extrabold text-navy-dark leading-none">{row.onHand || 0}</p><p className="text-[9.5px] text-gray-400 mt-1">On hand</p></div>
                  <div className="rounded-xl border border-border px-3 py-2.5 text-center"><p className="text-[17px] font-extrabold text-gray-500 leading-none">{row.reserved || 0}</p><p className="text-[9.5px] text-gray-400 mt-1">Reserved</p></div>
                  <div className="rounded-xl border border-border px-3 py-2.5 text-center"><p className={`text-[17px] font-extrabold leading-none ${avail <= 0 ? 'text-brand-red' : 'text-brand-green'}`}>{avail}</p><p className="text-[9.5px] text-gray-400 mt-1">Available</p></div>
                </div>

                {/* Per-store */}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.06em] mb-1.5">Across Branches</p>
                <div className="border border-border rounded-xl overflow-hidden mb-4">
                  {branchStock(row).map((b) => {
                    const m = storeMeta(b.store)
                    return (
                      <div key={b.store} className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 last:border-0">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0" style={{ background: m.color }}>{storeInitial(b.store)}</span>
                        <div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-navy-dark truncate leading-tight">{b.store}</p><p className="text-[10px] text-gray-400 font-mono">{m.code}</p></div>
                        <p className="text-[14px] font-extrabold shrink-0" style={{ color: ssQtyColor(b.qty, b.reorder) }}>{b.qty}</p>
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${b.cls}`}>{b.label}</span>
                      </div>
                    )
                  })}
                </div>

                <button onClick={() => { stopCamera(); onNavigate?.('products') }} className="w-full h-9 text-[12px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5">
                  <Icon name="eye-outline" size={15} />View product
                </button>
                <button onClick={reset} className="w-full mt-2 h-8 text-[11px] font-semibold text-brand-blue hover:underline">↺ Scan another</button>
              </>
            ) : notFound ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Icon name="alert-circle-outline" size={30} style={{ color: '#eb445a' }} />
                <p className="text-[13px] font-semibold text-navy-dark mt-2">No product matched</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{notFound}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-page flex items-center justify-center mb-3">
                  <Icon name="scan-outline" size={28} style={{ color: '#cbd5e1' }} />
                </div>
                <p className="text-[13px] font-semibold text-gray-500">Waiting for a scan</p>
                <p className="text-[11px] text-gray-400 mt-0.5 max-w-[260px]">Scan or enter a product to see its warehouse and branch stock here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
