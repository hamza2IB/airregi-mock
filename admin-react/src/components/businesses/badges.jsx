import { STATUS_BADGE, STATUS_LABEL, PKG_COLOR } from '../../data/businessData'

export function StatusBadge({ status }) {
  if (!STATUS_LABEL[status]) return null
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

export function PkgBadge({ pkg }) {
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${PKG_COLOR[pkg] || ''}`}>{pkg}</span>
  )
}

// Subscription cell — urgency-aware, ported from subCell().
export function SubCell({ b }) {
  if (b.status === 'pending') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse shrink-0"></div>
        <span className="text-[11px] text-brand-purple font-medium">Awaiting approval</span>
      </div>
    )
  }
  if (b.status === 'banned') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0"></div>
        <div>
          <p className="text-[11px] text-brand-red font-semibold">Subscription expired</p>
          <p className="text-[10px] text-gray-400">{b.subEnd}</p>
        </div>
      </div>
    )
  }
  if (b.status === 'suspended') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></div>
        <div>
          <p className="text-[11px] text-gray-500 font-medium">Expires {b.subEnd}</p>
          <p className="text-[10px] text-gray-400">{b.daysLeft}d remaining</p>
        </div>
      </div>
    )
  }
  // active — urgency-aware
  const isCritical = b.daysLeft <= 2
  const isExpiring = b.daysLeft <= 7
  const dotColor = isCritical ? 'bg-brand-red' : isExpiring ? 'bg-brand-orange' : 'bg-brand-green'
  const dateColor = isCritical
    ? 'text-brand-red font-semibold'
    : isExpiring
      ? 'text-brand-orange font-semibold'
      : 'text-gray-700 font-medium'
  const daysColor = isCritical
    ? 'text-brand-red font-bold'
    : isExpiring
      ? 'text-brand-orange font-semibold'
      : 'text-gray-400'
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}></div>
        <p className={`text-[11px] truncate ${dateColor}`}>Expires {b.subEnd}</p>
      </div>
      <p className={`text-[10px] pl-3 ${daysColor}`}>{b.daysLeft}d remaining</p>
    </div>
  )
}
