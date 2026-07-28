// Customer issues raised from the shopping app against this store's orders.
export const SM_ISSUES = [
  { id: 'ISS-2043', orderId: 'ORD-2026-1043', customer: 'Kamran Yousuf', phone: '0345-2223311', type: 'cancellation', reason: 'Delivery taking too long', note: '', date: 'Jul 23, 2026 12:15', status: 'open' },
  { id: 'ISS-2041', orderId: 'ORD-2026-1039', customer: 'Sara Hussain', phone: '0333-5551234', type: 'report', reason: 'Item damaged', note: 'One jar arrived cracked and leaking. Photos attached in chat.', date: 'Jul 23, 2026 10:05', status: 'open' },
  { id: 'ISS-2038', orderId: 'ORD-2026-1038', customer: 'Usman Farooq', phone: '0312-7778888', type: 'return', reason: 'Not as described', note: 'The colour looks different from what was shown on the app.', date: 'Jul 22, 2026 19:20', status: 'in_progress' },
  { id: 'ISS-2037', orderId: 'ORD-2026-1037', customer: 'Nadia Siddiqui', phone: '0321-4445566', type: 'report', reason: 'Item missing from order', note: 'Paid for 3 items but only received 2 in the bag.', date: 'Jul 22, 2026 16:40', status: 'resolved' },
]

export const ISS_STATUS = {
  open: { label: 'Open', cls: 'text-brand-orange bg-brand-orange/10' },
  in_progress: { label: 'In Progress', cls: 'text-brand-blue bg-brand-blue/10' },
  resolved: { label: 'Resolved', cls: 'text-brand-green bg-brand-green/10' },
}
