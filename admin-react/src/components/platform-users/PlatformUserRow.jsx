import ActionButton from '../ActionButton'
import { bizAvatarColor } from '../../data/businessData'
import { PU_ROLE_LABEL, PU_ROLE_COLOR } from '../../data/platformUsers'

const GRID = { gridTemplateColumns: '1.8fr 1fr 1.6fr 0.8fr 0.9fr 1.5fr' }

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
        <ActionButton onClick={() => onView(u)} icon="eye-outline" label="View" />
        {u.status === 'active' ? (
          <ActionButton onClick={() => onSuspend(u)} icon="pause-circle-outline" label="Suspend" tone="red" />
        ) : (
          <ActionButton onClick={() => onReactivate(u)} icon="play-circle-outline" label="Reactivate" tone="green" />
        )}
      </div>
    </div>
  )
}
