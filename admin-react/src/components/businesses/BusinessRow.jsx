import ActionButton from '../ActionButton'
import { bizAvatarColor } from '../../data/businessData'
import { StatusBadge, PkgBadge, SubCell } from './badges'

const GRID = { gridTemplateColumns: '2fr 1.4fr 0.8fr 0.8fr 0.5fr 0.5fr 0.6fr 1.3fr 1.4fr' }

function Actions({ b, onView, onSuspend, onReject, onReactivate, onVerify, onGoPayments }) {
  return (
    <div className="flex items-center gap-1.5">
      <ActionButton onClick={() => onView(b)} icon="eye-outline" label="View" />
      {b.status === 'active' && (
        <ActionButton onClick={() => onSuspend(b)} icon="pause-circle-outline" label="Suspend" tone="red" />
      )}
      {b.status === 'pending' && (
        <ActionButton onClick={() => onVerify(b)} icon="card-outline" label="Verify Payment" tone="green" />
      )}
      {b.status === 'suspended' && (
        <ActionButton onClick={() => onReactivate(b)} icon="play-circle-outline" label="Reactivate" tone="green" />
      )}
      {b.status === 'banned' && (
        <ActionButton onClick={onGoPayments} icon="card-outline" label="View Payment Queue" tone="orange" />
      )}
    </div>
  )
}

export default function BusinessRow(props) {
  const { b } = props
  const isPending = b.status === 'pending'
  return (
    <div className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition" style={GRID}>
      {/* Business */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
          style={{ background: bizAvatarColor(b.name) }}
        >
          {b.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-navy-dark truncate leading-tight">{b.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{b.city}</p>
        </div>
      </div>

      {/* Owner */}
      <div className="min-w-0">
        <p className="text-[12px] text-gray-700 font-medium truncate">{b.owner}</p>
        <p className="text-[10px] text-gray-400">Joined {b.joined}</p>
      </div>

      {/* Package */}
      <div>
        <PkgBadge pkg={b.pkg} />
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={b.status} />
      </div>

      {/* Stores */}
      <div className="text-[13px] font-semibold text-navy-dark">
        {isPending ? <span className="text-gray-300">—</span> : b.stores}
      </div>

      {/* Staff */}
      <div className="text-[13px] font-semibold text-navy-dark">
        {isPending ? <span className="text-gray-300">—</span> : b.staff}
      </div>

      {/* Products */}
      <div className="text-[13px] font-semibold text-navy-dark">
        {isPending ? <span className="text-gray-300">—</span> : b.products.toLocaleString()}
      </div>

      {/* Subscription */}
      <div>
        <SubCell b={b} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Actions {...props} />
      </div>
    </div>
  )
}
