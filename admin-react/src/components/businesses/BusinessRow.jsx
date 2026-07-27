import Icon from '../Icon'
import { bizAvatarColor } from '../../data/businessData'
import { StatusBadge, PkgBadge, SubCell } from './badges'

const GRID = { gridTemplateColumns: '2fr 1.4fr 0.8fr 0.8fr 0.5fr 0.5fr 0.6fr 1.3fr 1.4fr' }

function ActionButton({ onClick, icon, label, style }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition ${style}`}
    >
      <Icon name={icon} style={{ fontSize: '12px', flexShrink: 0 }} />
      {label}
    </button>
  )
}

function Actions({ b, onView, onSuspend, onReject, onReactivate, onGoPayments }) {
  const view = (
    <ActionButton
      onClick={() => onView(b)}
      icon="eye-outline"
      label="View"
      style="border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50"
    />
  )

  return (
    <div className="flex items-center gap-1.5">
      {view}
      {b.status === 'active' && (
        <ActionButton
          onClick={() => onSuspend(b)}
          icon="pause-circle-outline"
          label="Suspend"
          style="border-brand-red/20 bg-brand-red/5 text-brand-red hover:bg-brand-red/10"
        />
      )}
      {b.status === 'pending' && (
        <ActionButton
          onClick={() => onReject(b)}
          icon="ban-outline"
          label="Reject"
          style="border-brand-red/20 bg-brand-red/5 text-brand-red hover:bg-brand-red/10"
        />
      )}
      {b.status === 'suspended' && (
        <ActionButton
          onClick={() => onReactivate(b)}
          icon="play-circle-outline"
          label="Reactivate"
          style="border-brand-green/20 bg-brand-green/5 text-brand-green hover:bg-brand-green/10"
        />
      )}
      {b.status === 'banned' && (
        <ActionButton
          onClick={onGoPayments}
          icon="card-outline"
          label="View Payment Queue"
          style="border-brand-orange/20 bg-brand-orange/5 text-brand-orange hover:bg-brand-orange/10"
        />
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
