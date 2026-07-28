// Customer issues raised from the shopping app against orders this warehouse fulfils.
export const WM_ISSUES = [
  { id: 'ISS-2044', orderId: 'ORD-2026-1051', customer: 'Bilal Ahmed', phone: '0301-9988776', type: 'report', reason: 'Wrong item shipped', note: 'Ordered a 5kg flour bag but received a 2kg one. Packing slip shows the right item.', date: 'Jul 24, 2026 09:40', status: 'open' },
  { id: 'ISS-2042', orderId: 'ORD-2026-1047', customer: 'Ayesha Malik', phone: '0345-1122334', type: 'return', reason: 'Damaged in transit', note: 'Carton was crushed on arrival and two bottles were broken.', date: 'Jul 23, 2026 15:25', status: 'open' },
  { id: 'ISS-2039', orderId: 'ORD-2026-1044', customer: 'Hamza Sheikh', phone: '0333-7654321', type: 'cancellation', reason: 'Order not dispatched yet', note: 'Placed 3 days ago and still shows processing. Please cancel if it has not shipped.', date: 'Jul 23, 2026 08:10', status: 'in_progress' },
  { id: 'ISS-2036', orderId: 'ORD-2026-1040', customer: 'Fatima Noor', phone: '0321-3344556', type: 'report', reason: 'Short shipment', note: 'Invoice lists 6 units but only 4 were in the box.', date: 'Jul 22, 2026 13:50', status: 'resolved' },
]

export const ISS_STATUS = {
  open: { label: 'Open', cls: 'text-brand-orange bg-brand-orange/10' },
  in_progress: { label: 'In Progress', cls: 'text-brand-blue bg-brand-blue/10' },
  resolved: { label: 'Resolved', cls: 'text-brand-green bg-brand-green/10' },
}
