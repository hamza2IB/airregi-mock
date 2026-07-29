// Builds the thermal-receipt HTML (Jalal Sons style) exactly like the mock.
// Rendered via dangerouslySetInnerHTML so the layout matches 1:1.
import { STORE_CONFIG } from '../shared/catalog.js'

const logoBlock = () =>
  STORE_CONFIG.logo
    ? `<div class="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden"><img src="${STORE_CONFIG.logo}" alt="${STORE_CONFIG.name}" class="w-full h-full object-contain"></div>`
    : `<div class="w-16 h-16 mx-auto mb-2 rounded-lg bg-navy flex items-center justify-center"><ion-icon name="storefront" class="text-white" style="font-size:34px;"></ion-icon></div>`

function itemRows(products) {
  return products
    .map((p) => {
      const ep = p.effectivePrice || p.price
      const gross = ep * p.qty
      const hasDisc = p.discount && ep < p.price
      return `<tr class="border-b border-dotted border-gray-200">
      <td colspan="4" class="pt-2 pb-0.5 text-[11px] font-medium text-black">${p.name}${hasDisc ? ` <span class="text-brand-green text-[9px] font-semibold">${p.discount.label}</span>` : ''}</td>
    </tr>
    <tr class="border-b border-dotted border-gray-200">
      <td class="pb-2 text-[11px] text-gray-600 text-center">${p.qty}</td>
      <td class="pb-2 text-[11px] text-gray-600 text-right">${ep.toFixed(2)}</td>
      <td class="pb-2 text-[11px] text-gray-600 text-right">${gross.toFixed(2)}</td>
      <td class="pb-2 text-[11px] font-semibold text-black text-right">${gross.toFixed(2)}</td>
    </tr>`
    })
    .join('')
}

const metaRow = (l, r) => `<div class="flex justify-between"><span>${l}</span><span>${r}</span></div>`

/**
 * @param {object} tx sale record
 * @param {object} opts { mode: 'success'|'reprint', cashTendered }
 */
export function buildReceiptHtml(tx, opts = {}) {
  const { mode = 'success', cashTendered = null } = opts
  const now = tx.at instanceof Date ? tx.at : new Date(tx.at)
  const dateStr = now.toLocaleDateString('en-PK', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const methodLabel = { qr: 'PayFast QR', cash: 'Cash', card: 'Card (POS)' }[tx.method] || tx.method
  const total = tx.total
  const taxAmount = tx.tax || 0

  let cashSection
  if (tx.method === 'cash' && cashTendered) {
    const change = cashTendered - total
    cashSection = `
      <div class="flex justify-between text-[11px] py-1"><span class="text-gray-600">${methodLabel}</span><span class="font-semibold text-black">${cashTendered.toFixed(2)}</span></div>
      <div class="flex justify-between text-[11px] py-1 border-b border-dashed border-gray-300 pb-2 mb-2"><span class="text-gray-600 font-medium">Bal. (Cash)</span><span class="font-bold text-black">${change.toFixed(2)}</span></div>`
  } else {
    cashSection = `<div class="flex justify-between text-[11px] py-1 border-b border-dashed border-gray-300 pb-2 mb-2"><span class="text-gray-600">${methodLabel}</span><span class="font-semibold text-black">${total.toFixed(2)}</span></div>`
  }

  const couponLine = tx.coupon && tx.coupon.discount > 0
    ? `<div class="flex justify-between text-[11px] py-0.5 text-brand-purple"><span>Coupon (${tx.coupon.code})</span><span>-${tx.coupon.discount.toFixed(2)}</span></div>` : ''
  const pointsLine = tx.loyalty && tx.loyalty.discount > 0
    ? `<div class="flex justify-between text-[11px] py-0.5 text-amber-600"><span>Points (${tx.loyalty.pointsUsed.toLocaleString()} pts)</span><span>-${tx.loyalty.discount.toFixed(2)}</span></div>` : ''

  let refundSection = ''
  if (mode === 'reprint' && (tx.refunded || tx.partialRefund)) {
    refundSection = `<div class="border border-red-200 bg-red-50 rounded-lg px-3 py-3 mb-2">
      <p class="text-[11px] font-bold text-brand-red mb-1.5">${tx.refunded ? '⚠ FULL REFUND' : '⚠ PARTIAL REFUND'}</p>
      ${(tx.returnedItems || []).map((r) => `<div class="flex justify-between text-[11px] py-0.5"><span class="text-brand-red">${r.name} ×${r.qty}</span><span class="text-brand-red font-medium">-Rs.${(r.refundedAmount || r.price * r.qty).toLocaleString()}</span></div>`).join('')}
      <div class="flex justify-between text-[11px] font-bold pt-1.5 mt-1.5 border-t border-red-200"><span class="text-brand-red">Refund Total</span><span class="text-brand-red">-Rs.${(tx.refundAmount || 0).toLocaleString()}</span></div>
      ${tx.refundReason ? `<p class="text-[10px] text-gray-500 mt-1">Reason: ${tx.refundReason}</p>` : ''}
    </div>`
  }

  return `
    <div class="text-center border-b border-dashed border-gray-300 pb-3 mb-3">
      ${logoBlock()}
      <p class="text-[14px] font-bold text-black tracking-wide">${STORE_CONFIG.name}</p>
      <p class="text-[10px] text-gray-500 mt-0.5">${STORE_CONFIG.address}</p>
      <p class="text-[10px] text-gray-500">Tel: ${STORE_CONFIG.phone}</p>
    </div>
    <div class="text-[10px] text-gray-600 space-y-0.5 border-b border-dashed border-gray-300 pb-2 mb-2">
      ${metaRow(`STRN:${STORE_CONFIG.strn}`, `NTN:${STORE_CONFIG.ntn}`)}
      ${metaRow('TRANSACTION:', `<span class="font-mono">${tx.id}</span>`)}
      ${metaRow('RECEIPT NO.:', `<span class="font-mono">${tx.id}</span>`)}
      ${metaRow('TERMINAL:', STORE_CONFIG.terminal)}
      ${metaRow('EMPLOYEE:', tx.staff || 'Staff')}
      ${metaRow(`DATE:${dateStr}`, `TIME:${timeStr}`)}
      ${metaRow('CUSTOMER NO.:', tx.customer ? (tx.customerUserId || '1') : '')}
      ${metaRow('CUST. NAME:', tx.customer || '')}
    </div>
    <div class="border-b border-dashed border-gray-300 pb-2 mb-2">
      <table class="w-full text-[10px]">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left font-semibold text-gray-500 pb-1 uppercase">Item Name</th>
            <th class="text-center font-semibold text-gray-500 pb-1 uppercase w-8">Qty</th>
            <th class="text-right font-semibold text-gray-500 pb-1 uppercase w-14">Price</th>
            <th class="text-right font-semibold text-gray-500 pb-1 uppercase w-16">Gross</th>
            <th class="text-right font-semibold text-gray-500 pb-1 uppercase w-16">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows(tx.products)}</tbody>
      </table>
    </div>
    <div class="border-b border-dashed border-gray-300 pb-2 mb-2 space-y-0.5">
      <div class="flex justify-between text-[11px]"><span class="text-gray-600">Discount</span><span class="font-semibold ${tx.totalDiscount ? 'text-brand-green' : 'text-black'}">${(tx.totalDiscount || 0).toFixed(2)}</span></div>
      ${couponLine}
      ${pointsLine}
      <div class="flex justify-between text-[12px] font-bold pt-1"><span class="text-black">Total</span><span class="${tx.refunded ? 'text-gray-400 line-through' : 'text-black'}">${total.toFixed(2)}</span></div>
      ${cashSection}
    </div>
    ${refundSection}
    <div class="border-b border-dashed border-gray-300 pb-2 mb-2">
      <p class="text-[10px] font-semibold text-gray-600 uppercase mb-1">Tax Detail</p>
      <div class="flex justify-between text-[11px]"><span class="text-gray-600">16% MRP</span><span class="font-medium text-black">${taxAmount.toFixed(2)}</span></div>
      <div class="flex justify-between text-[11px] mt-1 pt-1 border-t border-dotted border-gray-200"><span class="text-gray-600 font-medium">GST included in total:</span><span class="font-semibold text-black">${taxAmount.toFixed(2)}</span></div>
    </div>
    <div class="border-b border-dashed border-gray-300 pb-2 mb-2">
      <ul class="text-[9px] text-gray-500 space-y-0.5 list-disc list-inside leading-relaxed">
        ${STORE_CONFIG.policies.map((p) => `<li>${p}</li>`).join('')}
      </ul>
      <p class="text-[9px] text-gray-500 mt-1 font-medium">PRICES ARE INCLUSIVE OF TAXES WHERE APPLICABLE.</p>
    </div>
    <div class="text-center pt-1">
      <p class="text-[10px] text-gray-600 font-medium">FBR Invoice #</p>
      <p class="text-[9px] font-mono text-black mt-0.5">${tx.fbrInvoice}</p>
      <div class="flex items-center justify-center gap-4 mt-3">
        <div class="text-center">
          <div class="w-10 h-12 flex items-center justify-center"><div class="text-[8px] font-bold text-gray-600 border border-gray-400 px-1.5 py-1 rounded"><p class="leading-none">FBR</p></div></div>
          <p class="text-[7px] text-gray-400 mt-0.5 leading-tight">POS</p>
        </div>
        <div class="text-center">
          <div id="fbr-qr" class="w-24 h-24 bg-white rounded flex items-center justify-center border border-gray-200 p-1"></div>
          <p class="text-[7px] text-gray-400 mt-0.5">FBR Verification</p>
        </div>
      </div>
    </div>
    <div class="text-center mt-3 pt-2 border-t border-dashed border-gray-200">
      <p class="text-[10px] text-gray-500 font-medium">Thank you for shopping at ${STORE_CONFIG.name}!</p>
      <p class="text-[8px] text-gray-300 mt-1">Powered by Air Register</p>
    </div>`
}
