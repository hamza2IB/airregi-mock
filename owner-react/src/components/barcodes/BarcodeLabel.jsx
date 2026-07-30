import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'
import { pmBarcode } from '../../data/productData'

export const LABEL_SIZES = {
  standard: { w: 189, h: 94 },
  large: { w: 378, h: 189 },
  small: { w: 144, h: 72 },
}

// A single printable label — barcode/QR + optional name/variant/price + SKU.
export default function BarcodeLabel({ product, settings }) {
  const { fmt, sizeKey, inclName, inclVariant, inclPrice } = settings
  const size = LABEL_SIZES[sizeKey] || LABEL_SIZES.standard
  const code = pmBarcode(product) // the barcode value we encode (owner-managed)
  const svgRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (fmt === 'QR') {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, code, { width: Math.min(size.w - 16, 72), margin: 1 }, () => {})
      }
    } else if (svgRef.current) {
      const opts = { width: 1.4, height: Math.round(size.h * 0.42), displayValue: false, margin: 2 }
      try {
        JsBarcode(svgRef.current, code, { ...opts, format: fmt === 'EAN13' ? 'EAN13' : 'CODE128' })
      } catch {
        // EAN13 needs a valid 13-digit numeric code — fall back to Code 128.
        JsBarcode(svgRef.current, code, { ...opts, format: 'CODE128' })
      }
    }
  }, [code, fmt, sizeKey, size.w, size.h])

  return (
    <div
      style={{
        width: size.w,
        minHeight: size.h,
        border: '1px solid #e8ecf1',
        borderRadius: 6,
        padding: '5px 6px',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', width: '100%', overflow: 'hidden' }}>
        {inclName && (
          <p style={{ fontSize: 9, fontWeight: 700, color: '#0a1535', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: size.w - 12, margin: 0 }}>
            {product.name}
          </p>
        )}
        {inclVariant && <p style={{ fontSize: 8, color: '#64748b', margin: '1px 0 0' }}>{product.variant}</p>}
        {inclPrice && <p style={{ fontSize: 8, fontWeight: 600, color: '#0a1535', margin: '1px 0 0' }}>Rs.{(product.price || 0).toLocaleString()}</p>}
      </div>
      {fmt === 'QR' ? (
        <canvas ref={canvasRef} style={{ marginTop: 3 }} />
      ) : (
        <svg ref={svgRef} style={{ maxWidth: size.w - 8, height: 'auto', marginTop: 3 }} />
      )}
      <p style={{ fontSize: 7, color: '#94a3b8', letterSpacing: '0.05em', margin: '1px 0 0' }}>{code} · {product.sku}</p>
    </div>
  )
}
