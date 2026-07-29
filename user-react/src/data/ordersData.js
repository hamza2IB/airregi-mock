import { BUSINESSES, PID, unitPrice } from './catalog'

// Seed orders (mirrors the mock's stub data). Totals/biz fields are derived.
const SEED = [
  { id: 'EC-1038', bizId: 'khaadi', status: 'Shipped', date: 'Jul 27', lines: [{ pid: 'khaadi-0', qty: 1 }, { pid: 'khaadi-1', qty: 1 }] },
  { id: 'EC-1031', bizId: 'hyperstar', status: 'Packing', date: 'Jul 26', lines: [{ pid: 'hyperstar-1', qty: 1 }] },
  { id: 'EC-1042', bizId: 'alfatah', status: 'Delivered', date: 'Jul 24', lines: [{ pid: 'alfatah-7', qty: 1 }, { pid: 'alfatah-5', qty: 1 }, { pid: 'alfatah-3', qty: 1 }, { pid: 'alfatah-2', qty: 1 }, { pid: 'alfatah-0', qty: 1 }, { pid: 'alfatah-4', qty: 1 }] },
  { id: 'EC-1024', bizId: 'jalalsons', status: 'Delivered', date: 'Jul 12', lines: [{ pid: 'jalalsons-0', qty: 1 }, { pid: 'jalalsons-2', qty: 1 }, { pid: 'jalalsons-4', qty: 1 }, { pid: 'jalalsons-3', qty: 1 }] },
]

export function decorateOrder(o) {
  const b = BUSINESSES.find((x) => x.id === o.bizId)
  const biz = b ? b.name : o.bizId
  const color = b ? b.color : '#1a2d6b'
  const items = o.lines.reduce((s, l) => s + l.qty, 0)
  const total = o.lines.reduce((s, l) => s + (PID[l.pid] ? unitPrice(PID[l.pid].p) * l.qty : 0), 0)
  return { ...o, biz, color, items, total }
}

export const INITIAL_ORDERS = SEED.map(decorateOrder)

export const STATUS_STYLE = {
  Delivered: 'bg-brand-green/10 text-brand-green',
  Shipped: 'bg-brand-blue/10 text-brand-blue',
  Packing: 'bg-brand-orange/10 text-brand-orange',
  Confirmed: 'bg-brand-blue/10 text-brand-blue',
  Cancelled: 'bg-brand-red/10 text-brand-red',
}

export const TRACK_STEPS = [
  { key: 'Confirmed', icon: 'checkmark-circle-outline' },
  { key: 'Packing', icon: 'cube-outline' },
  { key: 'Shipped', icon: 'car-outline' },
  { key: 'Delivered', icon: 'home-outline' },
]

export const TRACK_LABEL = { Confirmed: 'Order confirmed', Packing: 'Being prepared', Shipped: 'On the way' }
