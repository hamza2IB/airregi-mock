import { useState } from 'react'
import { useToast } from '../components/Toast'
import { checkOrderStock, SM_ORD_FLOW } from '../data/dashboardData'

// Shared online-order action logic used by the Dashboard fulfilment queue and the
// Online Orders page. Operates on app-level shared state via patchOrder so status
// changes and tracked refunds are reflected everywhere (incl. the Refunds page).
export function useOrderActions({ patchOrder }) {
  const showToast = useToast()
  const [viewOrder, setViewOrder] = useState(null)
  const [rejectFor, setRejectFor] = useState(null)
  const [stockCheck, setStockCheck] = useState(null)

  // Accept runs a stock-availability check. All in stock → confirm immediately.
  // Any shortage → open the StockCheckModal for partial-accept / reject.
  const acceptOrder = (o) => {
    const checked = checkOrderStock(o)
    if (checked.every((l) => l.stockState === 'full')) {
      patchOrder(o.id, { status: 'confirmed', timeline: [...(o.timeline || []), { status: 'confirmed', time: 'Now' }] })
      setViewOrder(null)
      showToast(`${o.id} accepted. All items in stock. Customer notified.`, 'success')
    } else {
      setViewOrder(null)
      setStockCheck({ order: o, checked })
    }
  }

  // Partial accept: drop unavailable items, recompute totals, track a refund for
  // prepaid (Bank Transfer / JazzCash / EasyPaisa) orders.
  const confirmPartialAccept = ({ order: o, checked }) => {
    const removed = checked
      .filter((l) => l.fulfillable < l.qty)
      .map((l) => ({ name: l.name, variant: l.variant, sku: l.sku, removedQty: l.qty - l.fulfillable, unitPrice: l.price, amount: (l.qty - l.fulfillable) * l.price }))
    const refundAmount = removed.reduce((s, r) => s + r.amount, 0)
    const items = checked.filter((l) => l.fulfillable > 0).map((l) => ({ ...l, qty: l.fulfillable }))
    const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0)
    const total = subtotal + o.deliveryFee
    const isBankTransfer = o.payment !== 'Cash on Delivery' && o.payStatus === 'paid'

    const refunds = [...(o.refunds || [])]
    if (isBankTransfer && refundAmount > 0) {
      refunds.push({ amount: refundAmount, status: 'pending', reason: 'Partial order — items out of stock', items: removed, date: 'Now', refId: null })
    }

    patchOrder(o.id, {
      status: 'confirmed',
      partialFulfillment: true,
      removedItems: removed,
      items_detail: items,
      items: items.length,
      subtotal,
      total,
      refunds,
      timeline: [...(o.timeline || []), { status: 'confirmed', time: 'Now' }],
    })
    setStockCheck(null)
    if (isBankTransfer && refundAmount > 0) {
      showToast(`${o.id} partially accepted. Refund of Rs.${refundAmount.toLocaleString()} tracked for out-of-stock items.`, 'warning')
    } else {
      showToast(`${o.id} partially accepted — unavailable items removed. Customer notified.`, 'success')
    }
  }

  const advanceOrder = (o) => {
    const flow = SM_ORD_FLOW[o.status]
    if (!flow) return
    patchOrder(o.id, { status: flow.next, timeline: [...(o.timeline || []), { status: flow.next, time: 'Now' }] })
    setViewOrder(null)
    showToast(`${o.id} → ${flow.next}. Customer notified.`, 'success')
  }

  const rejectOpen = (o) => { setViewOrder(null); setStockCheck(null); setRejectFor(o) }

  const confirmReject = (o, reason) => {
    const isBankTransfer = o.payment !== 'Cash on Delivery' && o.payStatus === 'paid'
    const refunds = [...(o.refunds || [])]
    if (isBankTransfer) {
      refunds.push({ amount: o.total, status: 'pending', reason: `Order rejected — ${reason}`, items: o.items_detail.map((l) => ({ name: l.name, variant: l.variant, sku: l.sku, removedQty: l.qty, unitPrice: l.price, amount: l.qty * l.price })), date: 'Now', refId: null })
    }
    patchOrder(o.id, { status: 'cancelled', refunds, timeline: [...(o.timeline || []), { status: 'cancelled', time: 'Now' }] })
    setRejectFor(null)
    if (isBankTransfer) {
      showToast(`${o.id} rejected — "${reason}". Refund of Rs.${o.total.toLocaleString()} tracked.`, 'warning')
    } else {
      showToast(`${o.id} rejected — "${reason}". Customer notified.`, 'info')
    }
  }

  return {
    viewOrder, setViewOrder, rejectFor, setRejectFor, stockCheck, setStockCheck,
    acceptOrder, confirmPartialAccept, advanceOrder, rejectOpen, confirmReject,
  }
}
