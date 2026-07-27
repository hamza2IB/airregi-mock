// Stock transfers for the Store Manager portal (Al Fatah Main Branch).
// Schema mirrors the warehouse portal's TRANSFER_DATA so records line up across portals
// (matching ids, dates, items, units, status).
//   dir 'out' → requests THIS branch raised (party = who fulfils it)
//   dir 'in'  → requests OTHER branches raised on this branch to fulfil (party = requester)

import { SM_INV } from './inventoryData'

export const SM_STORE_NAME = 'Al Fatah Main Branch'
export const SM_MANAGER = 'Nadia Hasan'

// Branch / warehouse metadata — codes & avatar colours matching the warehouse portal.
export const STORE_META = {
  'Central Warehouse': { code: 'WH-CTL', color: '#0a1535' },
  'Al Fatah Main Branch': { code: 'RS-001', color: '#1a2d6b' },
  'Al Fatah DHA Branch': { code: 'RS-002', color: '#3366cc' },
  'Al Fatah Johar Town': { code: 'RS-003', color: '#7c4dff' },
  'Al Fatah Model Town': { code: 'RS-004', color: '#2dd36f' },
}
export const storeMeta = (name) => STORE_META[name] || { code: 'RS-???', color: '#94a3b8' }
export const storeInitial = (name) => name.charAt(0).toUpperCase()

export const SM_TR_STATUS = {
  pending: { cls: 'text-brand-purple bg-brand-purple/10', icon: 'hourglass-outline', label: 'Pending' },
  dispatched: { cls: 'text-brand-orange bg-brand-orange/10', icon: 'cube-outline', label: 'In Transit' },
  received: { cls: 'text-brand-green bg-brand-green/10', icon: 'checkmark-circle-outline', label: 'Received' },
  rejected: { cls: 'text-brand-red bg-brand-red/10', icon: 'close-circle-outline', label: 'Rejected' },
  cancelled: { cls: 'text-gray-500 bg-gray-100', icon: 'close-outline', label: 'Cancelled' },
}

// OUTGOING — replenishment requests this branch raised on the Central Warehouse.
export const SM_TRANSFERS = [
  {
    id: 'TR-2026-051', dir: 'out', store: 'Al Fatah Main Branch', fulfilledBy: 'Central Warehouse', date: 'Jul 19, 2026', items: 6, units: 144,
    status: 'pending', urgent: true, requestedBy: 'Nadia Hasan', approvedBy: null, rejectedBy: null, rejectReason: null,
    lines: [
      { sku: 'GRO-RICE-5KG', product: 'Basmati Rice — 5 kg bag', qty: 30 },
      { sku: 'GRO-OIL-5L', product: 'Cooking Oil — 5 L bottle', qty: 24 },
      { sku: 'BEV-TEA-950', product: 'Lipton Yellow Label Tea — 950 g', qty: 20 },
      { sku: 'DAI-MILK-1L', product: 'Olpers Milk — 1 L pack', qty: 30 },
      { sku: 'BEV-WATER-6PK', product: 'Nestlé Pure Life Water — 1.5 L × 6 pack', qty: 20 },
      { sku: 'SNK-LAYS-LG', product: 'Lays Potato Chips — Large (Masala)', qty: 20 },
    ],
  },
  {
    id: 'TR-2026-048', dir: 'out', store: 'Al Fatah Main Branch', fulfilledBy: 'Central Warehouse', date: 'Jul 16, 2026', items: 8, units: 210,
    status: 'dispatched', urgent: false, requestedBy: 'Nadia Hasan', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null,
    dispatchedOn: 'Jul 17, 2026',
    lines: [
      { sku: 'GRO-SUGAR-1KG', product: 'Refined Sugar — 1 kg pack', qty: 40 },
      { sku: 'GRO-ATTA-10KG', product: 'Wheat Flour (Atta) — 10 kg bag', qty: 25 },
      { sku: 'SPC-BIRYANI-75', product: 'Shan Biryani Masala — 75 g box', qty: 30 },
      { sku: 'HHD-SURF-1KG', product: 'Surf Excel Detergent — 1 kg pack', qty: 20 },
      { sku: 'PC-COLGATE-150', product: 'Colgate Toothpaste — 150 g', qty: 25 },
      { sku: 'BEV-COKE-1.5L', product: 'Coca-Cola — 1.5 L bottle', qty: 30 },
      { sku: 'BEV-NESCAFE-100', product: 'Nescafé Classic — 100 g jar', qty: 20 },
      { sku: 'HHD-DISH-1L', product: 'Max Dishwash Liquid — 1 L bottle', qty: 20 },
    ],
  },
  {
    id: 'TR-2026-047', dir: 'out', store: 'Al Fatah Main Branch', fulfilledBy: 'Central Warehouse', date: 'Jul 15, 2026', items: 3, units: 60,
    status: 'dispatched', urgent: true, requestedBy: 'Nadia Hasan', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null,
    dispatchedOn: 'Jul 16, 2026',
    lines: [
      { sku: 'DAI-EGGS-12', product: 'Farm Eggs — Dozen', qty: 20 },
      { sku: 'GRO-OIL-5L', product: 'Cooking Oil — 5 L bottle', qty: 20 },
      { sku: 'GRO-RICE-5KG', product: 'Basmati Rice — 5 kg bag', qty: 20 },
    ],
  },
  {
    id: 'TR-2026-044', dir: 'out', store: 'Al Fatah Main Branch', fulfilledBy: 'Central Warehouse', date: 'Jul 8, 2026', items: 4, units: 96,
    status: 'received', urgent: false, requestedBy: 'Nadia Hasan', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null,
    dispatchedOn: 'Jul 9, 2026', receivedOn: 'Jul 11, 2026',
    lines: [
      { sku: 'GRO-SUGAR-1KG', product: 'Refined Sugar — 1 kg pack', qty: 30 },
      { sku: 'DAI-MILK-1L', product: 'Olpers Milk — 1 L pack', qty: 26 },
      { sku: 'BEV-COKE-1.5L', product: 'Coca-Cola — 1.5 L bottle', qty: 20 },
      { sku: 'SNK-LAYS-LG', product: 'Lays Potato Chips — Large (Masala)', qty: 20 },
    ],
  },
  {
    id: 'TR-2026-040', dir: 'out', store: 'Al Fatah Main Branch', fulfilledBy: 'Central Warehouse', date: 'Jul 3, 2026', items: 2, units: 48,
    status: 'rejected', urgent: false, requestedBy: 'Nadia Hasan', approvedBy: null, rejectedBy: 'Zain Khan',
    rejectReason: 'Insufficient stock available',
    lines: [
      { sku: 'BEV-WATER-6PK', product: 'Nestlé Pure Life Water — 1.5 L × 6 pack', qty: 24 },
      { sku: 'BEV-TEA-950', product: 'Lipton Yellow Label Tea — 950 g', qty: 24 },
    ],
  },
]

// INBOUND — requests OTHER branches raised on this branch to fulfil (send stock).
export const SM_INBOUND = [
  {
    id: 'TR-2026-052', dir: 'in', store: 'Al Fatah Johar Town', fulfilledBy: 'Al Fatah Main Branch', date: 'Jul 22, 2026',
    items: 2, units: 40, status: 'pending', urgent: true, requestedBy: 'Usman Ali', approvedBy: null, rejectedBy: null, rejectReason: null,
    lines: [
      { sku: 'BEV-COKE-1.5L', product: 'Coca-Cola — 1.5 L bottle', qty: 24 },
      { sku: 'SNK-LAYS-LG', product: 'Lays Potato Chips — Large (Masala)', qty: 16 },
    ],
  },
  {
    id: 'TR-2026-050', dir: 'in', store: 'Al Fatah DHA Branch', fulfilledBy: 'Al Fatah Main Branch', date: 'Jul 21, 2026',
    items: 3, units: 70, status: 'pending', urgent: false, requestedBy: 'Sara Ahmed', approvedBy: null, rejectedBy: null, rejectReason: null,
    lines: [
      { sku: 'GRO-SUGAR-1KG', product: 'Refined Sugar — 1 kg pack', qty: 30 },
      { sku: 'SPC-BIRYANI-75', product: 'Shan Biryani Masala — 75 g box', qty: 20 },
      { sku: 'BEV-NESCAFE-100', product: 'Nescafé Classic — 100 g jar', qty: 20 },
    ],
  },
  {
    id: 'TR-2026-046', dir: 'in', store: 'Al Fatah Model Town', fulfilledBy: 'Al Fatah Main Branch', date: 'Jul 18, 2026',
    items: 2, units: 44, status: 'dispatched', urgent: false, requestedBy: 'Bilal Siddiqui', approvedBy: 'Nadia Hasan', rejectedBy: null, rejectReason: null, dispatchedOn: 'Jul 19, 2026',
    lines: [
      { sku: 'GRO-ATTA-10KG', product: 'Wheat Flour (Atta) — 10 kg bag', qty: 24 },
      { sku: 'HHD-SURF-1KG', product: 'Surf Excel Detergent — 1 kg pack', qty: 20 },
    ],
  },
  {
    id: 'TR-2026-042', dir: 'in', store: 'Al Fatah DHA Branch', fulfilledBy: 'Al Fatah Main Branch', date: 'Jul 5, 2026',
    items: 1, units: 30, status: 'received', urgent: false, requestedBy: 'Sara Ahmed', approvedBy: 'Nadia Hasan', rejectedBy: null, rejectReason: null, dispatchedOn: 'Jul 6, 2026', receivedOn: 'Jul 8, 2026',
    lines: [
      { sku: 'DAI-MILK-1L', product: 'Olpers Milk — 1 L pack', qty: 30 },
    ],
  },
]

// The counterpart branch/warehouse shown in a row: fulfiller for outgoing, requester for inbound.
export const trParty = (t) => (t.dir === 'out' ? t.fulfilledBy || 'Central Warehouse' : t.store)

// On-hand stock at THIS branch for the SKUs used across transfers — drives the
// Approve & Dispatch modal's per-line availability. SNK-LAYS-LG is short on purpose
// so approving TR-2026-052 demonstrates the partial-fulfilment flow.
export const SM_TR_STOCK = {
  'GRO-RICE-5KG': 60,
  'GRO-OIL-5L': 40,
  'BEV-TEA-950': 55,
  'DAI-MILK-1L': 80,
  'BEV-WATER-6PK': 45,
  'SNK-LAYS-LG': 10,
  'GRO-SUGAR-1KG': 90,
  'GRO-ATTA-10KG': 40,
  'SPC-BIRYANI-75': 50,
  'HHD-SURF-1KG': 30,
  'PC-COLGATE-150': 35,
  'BEV-COKE-1.5L': 60,
  'BEV-NESCAFE-100': 30,
  'HHD-DISH-1L': 25,
  'DAI-EGGS-12': 48,
}

// Available units at this branch for a SKU.
export const trAvail = (sku) => SM_TR_STOCK[sku] ?? 0
// A transfer's line items (all our records carry explicit lines).
export const trLines = (t) => t.lines || []

export const TRANSFER_REJECT_REASONS = [
  { value: 'insufficient_stock', label: 'Insufficient stock available' },
  { value: 'wrong_items', label: 'Wrong items requested' },
  { value: 'duplicate_request', label: 'Duplicate request' },
  { value: 'out_of_season', label: 'Items out of season / discontinued' },
  { value: 'other', label: 'Other' },
]

// ── New Stock Request: who can fulfil, and how much stock each source holds ──
// The Central Warehouse stocks everything; branches carry only a subset. Used to show
// whether a chosen source can actually cover a request before it's sent.
export const SM_FULFILLERS = ['Central Warehouse', 'Al Fatah DHA Branch', 'Al Fatah Johar Town', 'Al Fatah Model Town']

export const SM_SOURCE_STOCK = {
  'Central Warehouse': Object.fromEntries(SM_INV.map((i) => [i.sku, 300])),
  'Al Fatah DHA Branch': { 'GRO-RICE-5KG': 40, 'GRO-SUGAR-1KG': 60, 'DAI-MILK-1L': 25, 'BEV-COKE-1.5L': 50, 'SNK-LAYS-LG': 30, 'PC-COLGATE-150': 20 },
  'Al Fatah Johar Town': { 'GRO-OIL-5L': 24, 'BEV-WATER-6PK': 40, 'BEV-TEA-950': 35, 'PC-COLGATE-150': 50, 'BEV-COKE-1.5L': 12, 'BEV-NESCAFE-100': 18 },
  'Al Fatah Model Town': { 'GRO-ATTA-10KG': 30, 'SPC-BIRYANI-75': 45, 'HHD-SURF-1KG': 25, 'HHD-DISH-1L': 20, 'DAI-EGGS-12': 60 },
}

export const smSourceStock = (source, sku) => (SM_SOURCE_STOCK[source] || {})[sku] || 0

// How much of a request (its lines) a given source can cover.
export function smSourceCoverage(source, lines) {
  let itemsFull = 0, unitsCovered = 0, unitsReq = 0
  ;(lines || []).forEach((l) => {
    const av = smSourceStock(source, l.sku)
    unitsReq += l.qty
    unitsCovered += Math.min(l.qty, av)
    if (av >= l.qty) itemsFull++
  })
  return { itemsFull, itemsTotal: (lines || []).length, unitsCovered, unitsReq }
}

// Continues the warehouse TR sequence (its latest seeded id is TR-2026-053).
let smReqSeq = 53
export const nextTransferId = () => 'TR-2026-' + String(++smReqSeq).padStart(3, '0')

// Merged recent activity across both directions, newest first — used by the dashboard.
export const SM_RECENT_TRANSFERS = [...SM_TRANSFERS, ...SM_INBOUND]
  .map((t) => ({ ...t, ts: Date.parse(t.date) }))
  .sort((a, b) => b.ts - a.ts || b.id.localeCompare(a.id))

// Counts across all transfers (both directions).
const ALL_TRANSFERS = [...SM_TRANSFERS, ...SM_INBOUND]
export const SM_TR_PENDING = ALL_TRANSFERS.filter((t) => t.status === 'pending').length
export const SM_TR_DISPATCHED = ALL_TRANSFERS.filter((t) => t.status === 'dispatched').length
