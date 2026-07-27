import { useState } from 'react'
import { useToast } from '../components/Toast'
import { SM_MANAGER } from '../data/transferData'

// Shared Stock Transfer action logic used by both the Dashboard and Stock Transfers page.
// Operates on app-level shared state via the passed setters so status changes and stock
// effects are reflected everywhere.
//   patchTransfer(id, patch) — update a transfer record
//   adjustStock(sku, delta)  — add/remove branch on-hand units
//   addMovements(moves[])    — prepend stock-history movements
export function useTransferActions({ patchTransfer, adjustStock, addMovements }) {
  const showToast = useToast()
  const [viewTransfer, setViewTransfer] = useState(null)
  const [dispatchFor, setDispatchFor] = useState(null)
  const [rejectTransferFor, setRejectTransferFor] = useState(null)

  const approveTransfer = (t) => { setViewTransfer(null); setDispatchFor(t) }
  const rejectTransferOpen = (t) => { setViewTransfer(null); setRejectTransferFor(t) }

  // Approve & dispatch an inbound request: deduct branch stock for each dispatched line,
  // log outbound movements, mark in transit (tracking partials).
  const confirmDispatch = (t, lines, total, reqTotal) => {
    const moves = []
    lines.forEach((l) => {
      if (!l.dispatched) return
      adjustStock?.(l.sku, -l.dispatched)
      moves.push({ sku: l.sku, type: 'transfer', qty: -l.dispatched, note: `Dispatched to ${t.store} (${t.id}${l.dispatched < l.qty ? ', partial' : ''})`, by: SM_MANAGER, date: 'Now' })
    })
    addMovements?.(moves)
    const partial = total < reqTotal
    patchTransfer(t.id, { status: 'dispatched', approvedBy: SM_MANAGER, dispatchedOn: 'Now', partial, requestedUnits: reqTotal, units: total, lines })
    setDispatchFor(null)
    showToast(partial ? `${t.id} partially dispatched — ${total} of ${reqTotal} units sent to ${t.store}.` : `${t.id} approved — ${total} units dispatched to ${t.store}.`, partial ? 'warning' : 'success')
  }

  const confirmRejectTransfer = (t, label, note) => {
    patchTransfer(t.id, { status: 'rejected', rejectedBy: SM_MANAGER, rejectReason: label + (note ? ` — ${note}` : '') })
    setRejectTransferFor(null)
    showToast(`${t.id} rejected — "${label}". ${t.store} notified.`, 'info')
  }

  // Confirm an outbound request shipment arrived: add received units to branch stock + log.
  const confirmReceipt = (t) => {
    const lines = t.lines || []
    lines.forEach((l) => adjustStock?.(l.sku, l.qty))
    addMovements?.(lines.map((l) => ({ sku: l.sku, type: 'received', qty: l.qty, note: `Transfer from ${t.fulfilledBy || 'warehouse'} (${t.id})`, by: SM_MANAGER, date: 'Now' })))
    patchTransfer(t.id, { status: 'received', receivedOn: 'Now' })
    setViewTransfer(null)
    showToast(`${t.id} received — ${t.units} units added to branch stock.`, 'success')
  }

  const cancelTransfer = (t) => {
    patchTransfer(t.id, { status: 'cancelled' })
    setViewTransfer(null)
    showToast(`${t.id} cancelled. ${t.fulfilledBy || 'The fulfiller'} notified.`, 'info')
  }

  return {
    viewTransfer, setViewTransfer,
    dispatchFor, setDispatchFor,
    rejectTransferFor, setRejectTransferFor,
    approveTransfer, rejectTransferOpen, confirmDispatch, confirmRejectTransfer, confirmReceipt, cancelTransfer,
  }
}
