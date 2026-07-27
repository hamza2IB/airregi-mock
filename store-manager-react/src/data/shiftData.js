// Cashier shift data for the Store Manager portal (single store: Al Fatah — Main Branch).
// A shift tracks one cashier's session on a register: opening float, sales split by
// tender, and — once closed — the counted drawer cash and resulting variance.

export const SM_SHIFT_STORE = 'Al Fatah — Main Branch'
export const SM_SHIFT_MANAGER = 'Nadia Hasan'
export const SM_REGISTERS = ['R-01', 'R-02', 'R-03']

export const fmtRs = (n) => 'Rs.' + Math.round(n || 0).toLocaleString('en-PK')

// Only cash physically lands in the drawer; card/wallet settle electronically.
export const shiftExpected = (s) => s.openingFloat + s.sales.cash.amt - (s.payouts || 0)
export const shiftTotalSales = (s) => s.sales.cash.amt + s.sales.card.amt + s.sales.wallet.amt
export const shiftTxns = (s) => s.sales.cash.n + s.sales.card.n + s.sales.wallet.n
export const shiftVariance = (s) => (s.counted == null ? null : s.counted - shiftExpected(s))
export const varianceState = (diff) => (diff === 0 ? 'balanced' : diff < 0 ? 'short' : 'over')

// diff → { label, color, bg, icon } for badges/pills.
export function varianceBadge(diff) {
  if (diff === 0) return { label: 'Balanced', color: 'text-brand-green', bg: 'bg-brand-green/10', icon: 'checkmark-circle-outline' }
  if (diff < 0) return { label: `−${fmtRs(Math.abs(diff))}`, color: 'text-brand-red', bg: 'bg-brand-red/10', icon: 'arrow-down-circle-outline' }
  return { label: `+${fmtRs(diff)}`, color: 'text-brand-orange', bg: 'bg-brand-orange/10', icon: 'arrow-up-circle-outline' }
}

export const SM_SHIFT_PERIODS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
]

// Date fragments matched against the shift's closed date string.
export const SM_SHIFT_PERIOD_DATES = {
  all: null,
  today: 'Jul 23',
  yesterday: 'Jul 22',
  week: ['Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23'],
}

export const SM_SHIFT_NOTE_REASONS = [
  'Counting error — recount matched',
  'Change given incorrectly',
  'Cash payout not logged',
  'Suspected till error',
  'Other',
]

// ── Full transaction ledger per shift ────────────────────────────────────────
// The detail view shows every transaction the cashier rang up during the shift so
// the manager can reconcile the drawer. Transactions are generated deterministically
// from the shift's tender totals so the per-tender sums match "Sales by Tender"
// exactly (cash transactions add up to cash sales, etc.).

const WALLET_PROVIDERS = ['JazzCash', 'EasyPaisa', 'QR']

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashStr(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// Split `total` into `n` positive integer parts that sum exactly to `total`.
function splitAmount(total, n, rnd) {
  if (n <= 0) return []
  if (n === 1) return [total]
  const weights = Array.from({ length: n }, () => 0.4 + rnd())
  const wsum = weights.reduce((a, b) => a + b, 0)
  const parts = weights.map((w) => Math.max(1, Math.round((total * w) / wsum)))
  let diff = total - parts.reduce((a, b) => a + b, 0)
  // Distribute the rounding remainder across parts, keeping every part >= 1.
  let i = 0
  while (diff !== 0) {
    const idx = i % n
    if (diff > 0) { parts[idx] += 1; diff -= 1 }
    else if (parts[idx] > 1) { parts[idx] -= 1; diff += 1 }
    i += 1
  }
  return parts
}

// Parse the "HH:MM AM/PM" clock out of a "Mon DD, YYYY · HH:MM AM" string.
function clockToMinutes(dateStr) {
  const m = /·\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(dateStr || '')
  if (!m) return null
  let h = Number(m[1]) % 12
  if (/pm/i.test(m[3])) h += 12
  return h * 60 + Number(m[2])
}

function minutesToClock(mins) {
  mins = ((Math.round(mins) % 1440) + 1440) % 1440
  const h = Math.floor(mins / 60)
  const mm = mins % 60
  const ap = h >= 12 ? 'PM' : 'AM'
  let hh = h % 12
  if (hh === 0) hh = 12
  return `${hh}:${String(mm).padStart(2, '0')} ${ap}`
}

const _txnCache = {}

// Returns the full transaction list for a shift, newest first.
export function shiftTransactions(s) {
  if (_txnCache[s.id]) return _txnCache[s.id]
  const rnd = mulberry32(hashStr(s.id))
  const build = (tender, count) => {
    const amounts = splitAmount(s.sales[tender].amt, count, rnd)
    return amounts.map((amount) => ({
      tender,
      amount,
      pay: tender === 'cash' ? 'Cash' : tender === 'card' ? 'Card' : WALLET_PROVIDERS[Math.floor(rnd() * WALLET_PROVIDERS.length)],
      items: 1 + Math.floor(rnd() * 9),
    }))
  }
  const all = [...build('cash', s.sales.cash.n), ...build('card', s.sales.card.n), ...build('wallet', s.sales.wallet.n)]

  // Assign timestamps spread across the shift window (open → close, or open → +6.5h
  // for shifts still running), then order newest first.
  const startMin = clockToMinutes(s.opened) ?? 8 * 60
  const endMin = (s.closed && s.closed !== 'Now' ? clockToMinutes(s.closed) : null) ?? startMin + 390
  const span = Math.max(1, endMin - startMin)
  // Shuffle so tenders interleave rather than grouping by type.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  const seq = all.map((t, i) => ({
    ...t,
    id: 'POS-' + String(hashStr(s.id) % 9000 + 1000 + i).slice(-4),
    _min: startMin + (span * (i + 1)) / (all.length + 1),
  }))
  seq.sort((a, b) => b._min - a._min)
  const out = seq.map((t) => ({ id: t.id, time: minutesToClock(t._min), amount: t.amount, pay: t.pay, tender: t.tender, items: t.items }))
  _txnCache[s.id] = out
  return out
}

export const SM_SHIFTS = [
  // ── Closed today ────────────────────────────────────────────────────────────
  {
    id: 'SH-2026-0731', cashier: 'Sara Hussain', register: 'R-01', status: 'closed',
    opened: 'Jul 23, 2026 · 08:00 AM', closed: 'Jul 23, 2026 · 02:00 PM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 18400, n: 34 }, card: { amt: 14800, n: 20 }, wallet: { amt: 9600, n: 10 } },
    counted: 23400, closedBy: 'Nadia Hasan', note: null,
  }, // expected 23400 → balanced
  {
    id: 'SH-2026-0732', cashier: 'Ali Raza', register: 'R-02', status: 'closed',
    opened: 'Jul 23, 2026 · 08:15 AM', closed: 'Jul 23, 2026 · 02:10 PM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 12250, n: 26 }, card: { amt: 9800, n: 14 }, wallet: { amt: 4300, n: 6 } },
    counted: 17200, closedBy: 'Nadia Hasan', note: 'Counting error — recount matched',
  }, // expected 17250, counted 17200 → short 50

  {
    id: 'SH-2026-0729', cashier: 'Kamran Sheikh', register: 'R-03', status: 'closed',
    opened: 'Jul 23, 2026 · 06:00 AM', closed: 'Jul 23, 2026 · 08:05 AM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 9200, n: 18 }, card: { amt: 6100, n: 9 }, wallet: { amt: 2400, n: 4 } },
    counted: 14200, closedBy: 'Nadia Hasan', note: null,
  }, // expected 14200 → balanced

  // ── Closed yesterday ──────────────────────────────────────────────────────────
  {
    id: 'SH-2026-0724', cashier: 'Ayesha Malik', register: 'R-01', status: 'closed',
    opened: 'Jul 22, 2026 · 02:00 PM', closed: 'Jul 22, 2026 · 10:05 PM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 22600, n: 47 }, card: { amt: 18900, n: 28 }, wallet: { amt: 7400, n: 11 } },
    counted: 27250, closedBy: 'Nadia Hasan', note: 'Change given incorrectly',
  }, // expected 27600, counted 27250 → short 350
  {
    id: 'SH-2026-0723', cashier: 'Usman Khan', register: 'R-02', status: 'closed',
    opened: 'Jul 22, 2026 · 02:00 PM', closed: 'Jul 22, 2026 · 10:12 PM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 19800, n: 41 }, card: { amt: 15200, n: 22 }, wallet: { amt: 6100, n: 9 } },
    counted: 24950, closedBy: 'Nadia Hasan', note: 'Counting error — recount matched',
  }, // expected 24800, counted 24950 → over 150
  {
    id: 'SH-2026-0722', cashier: 'Sara Hussain', register: 'R-01', status: 'closed',
    opened: 'Jul 22, 2026 · 06:00 AM', closed: 'Jul 22, 2026 · 02:00 PM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 16400, n: 33 }, card: { amt: 12100, n: 18 }, wallet: { amt: 5200, n: 8 } },
    counted: 21400, closedBy: 'Nadia Hasan', note: null,
  }, // expected 21400 → balanced

  // ── Earlier this week ─────────────────────────────────────────────────────────
  {
    id: 'SH-2026-0718', cashier: 'Bilal Ahmed', register: 'R-03', status: 'closed',
    opened: 'Jul 20, 2026 · 02:00 PM', closed: 'Jul 20, 2026 · 10:08 PM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 21050, n: 44 }, card: { amt: 16800, n: 25 }, wallet: { amt: 6900, n: 10 } },
    counted: 25550, closedBy: 'Nadia Hasan', note: 'Suspected till error',
  }, // expected 26050, counted 25550 → short 500
  {
    id: 'SH-2026-0714', cashier: 'Nadia Khan', register: 'R-02', status: 'closed',
    opened: 'Jul 18, 2026 · 06:00 AM', closed: 'Jul 18, 2026 · 02:00 PM', openingFloat: 5000, payouts: 0,
    sales: { cash: { amt: 14300, n: 29 }, card: { amt: 9600, n: 15 }, wallet: { amt: 3800, n: 6 } },
    counted: 19300, closedBy: 'Nadia Hasan', note: null,
  }, // expected 19300 → balanced
]
