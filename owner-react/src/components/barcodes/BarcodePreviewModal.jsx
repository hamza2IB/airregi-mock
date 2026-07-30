import { useEffect, useState } from 'react'
import Icon from '../Icon'
import BarcodeLabel from './BarcodeLabel'

const PREVIEW_CAP = 5 // show at most 5 copies per product in the preview

// `state` = { products, settings } or null. Keeps last content during fade-out.
export default function BarcodePreviewModal({ state, onClose, onPrint }) {
  const [shown, setShown] = useState(state)

  useEffect(() => {
    if (state) setShown(state)
  }, [state])

  const open = !!state
  const products = shown?.products || []
  const settings = shown?.settings || { copies: 1 }
  const copies = settings.copies || 1
  const total = products.length * copies
  const sub = `${products.length} product${products.length !== 1 ? 's' : ''} · ${copies} cop${copies !== 1 ? 'ies' : 'y'} each · ${total} label${total !== 1 ? 's' : ''} total`

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative bg-white rounded-2xl w-full max-w-3xl z-10 flex flex-col transition-transform duration-200 ${open ? 'scale-100' : 'scale-95'}`} style={{ maxHeight: '90vh', boxShadow: '0 24px 64px rgba(10,21,53,0.22)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
              <Icon name="barcode-outline" className="text-navy" size={18} />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-navy-dark">Barcode Preview</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
            <Icon name="close-outline" size={17} style={{ color: '#64748b' }} />
          </button>
        </div>

        {/* Preview grid */}
        <div className="overflow-y-auto thin-scroll p-6 flex flex-wrap gap-4 bg-gray-50/60">
          {products.map((p) =>
            Array.from({ length: Math.min(copies, PREVIEW_CAP) }).map((_, c) => (
              <BarcodeLabel key={`${p.sku}-${c}`} product={p} settings={settings} />
            )),
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-white rounded-b-2xl shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onPrint} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-1.5">
            <Icon name="print-outline" size={15} />Print Labels
          </button>
        </div>
      </div>
    </div>
  )
}
