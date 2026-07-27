import { PKG_COLOR } from '../../data/businessData'

const GRID = { gridTemplateColumns: '1.8fr 0.9fr 0.9fr 1fr 1.2fr 1fr 0.9fr' }

function TypeBadge({ type }) {
  return type === 'renewal' ? (
    <span className="text-[10px] font-medium text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">Renewal</span>
  ) : (
    <span className="text-[10px] font-medium text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">New Reg</span>
  )
}

function StatusBadge({ status }) {
  return status === 'verified' ? (
    <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">Verified</span>
  ) : (
    <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">Rejected</span>
  )
}

export default function PaymentHistoryRow({ p }) {
  return (
    <div className="grid items-center px-5 py-3 hover:bg-gray-50/60 transition" style={GRID}>
      <p className="text-[12.5px] font-semibold text-navy-dark truncate">{p.bizName}</p>
      <div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${PKG_COLOR[p.pkg]}`}>{p.pkg}</span>
      </div>
      <div>
        <TypeBadge type={p.type} />
      </div>
      <p className="text-[12px] font-semibold text-navy-dark">Rs.{p.amount.toLocaleString()}</p>
      <div className="min-w-0">
        <p className="text-[11.5px] text-gray-700 font-medium truncate">{p.bank}</p>
        <p className="text-[10px] text-gray-400 font-mono truncate">{p.ref}</p>
      </div>
      <p className="text-[11.5px] text-gray-500">{p.date}</p>
      <div>
        <StatusBadge status={p.status} />
      </div>
    </div>
  )
}
