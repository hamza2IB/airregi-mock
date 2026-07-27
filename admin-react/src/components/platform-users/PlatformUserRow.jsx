import Icon from '../Icon'
import { bizAvatarColor } from '../../data/businessData'
import { PU_ROLE_LABEL, PU_ROLE_COLOR } from '../../data/platformUsers'

const GRID = { gridTemplateColumns: '1.8fr 1fr 1.6fr 0.8fr 0.9fr 1.2fr' }

export function PuStatusBadge({ status }) {
  return status === 'active' ? (
    <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">Active</span>
  ) : (
    <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">Suspended</span>
  )
}

export default function PlatformUserRow({ u, onView, onSuspend, onReactivate }) {
  return (
    <div className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition" style={GRID}>
      {/* User */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
          style={{ background: bizAvatarColor(u.name) }}
        >
          {u.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-navy-dark truncate leading-tight">{u.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{u.email}</p>
        </div>
      </div>

      {/* Role */}
      <div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PU_ROLE_COLOR[u.role]}`}>
          {PU_ROLE_LABEL[u.role]}
        </span>
      </div>

      {/* Business / location */}
      <div className="min-w-0">
        <p className="text-[12px] text-gray-700 font-medium truncate">{u.bizName}</p>
        <p className="text-[10px] text-gray-400 truncate">{u.location}</p>
      </div>

      {/* Status */}
      <div>
        <PuStatusBadge status={u.status} />
      </div>

      {/* Joined */}
      <div className="text-[11.5px] text-gray-500">{u.joined}</div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onView(u)}
          title="View"
          className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition"
        >
          <Icon name="eye-outline" style={{ fontSize: '14px' }} />
        </button>
        {u.status === 'active' ? (
          <button
            onClick={() => onSuspend(u)}
            title="Suspend"
            className="w-7 h-7 rounded-lg border border-brand-red/20 bg-brand-red/5 text-brand-red hover:bg-brand-red/10 flex items-center justify-center transition"
          >
            <Icon name="pause-circle-outline" style={{ fontSize: '14px' }} />
          </button>
        ) : (
          <button
            onClick={() => onReactivate(u)}
            title="Reactivate"
            className="w-7 h-7 rounded-lg border border-brand-green/20 bg-brand-green/5 text-brand-green hover:bg-brand-green/10 flex items-center justify-center transition"
          >
            <Icon name="play-circle-outline" style={{ fontSize: '14px' }} />
          </button>
        )}
      </div>
    </div>
  )
}
