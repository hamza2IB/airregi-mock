import Icon from '../Icon'
import { bizAvatarColor } from '../../data/businessData'
import { PU_ROLE_LABEL, PU_ROLE_COLOR } from '../../data/platformUsers'
import { PuStatusBadge } from './PlatformUserRow'

export default function PuViewModal({ user, onClose, onSuspend, onReactivate }) {
  if (!user) return null
  const u = user

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,21,53,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[14px] font-extrabold text-white shrink-0"
              style={{ background: bizAvatarColor(u.name) }}
            >
              {u.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-navy-dark truncate">{u.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition shrink-0"
          >
            <Icon name="close-outline" style={{ fontSize: '18px' }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Role</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PU_ROLE_COLOR[u.role]}`}>
              {PU_ROLE_LABEL[u.role]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Status</span>
            <PuStatusBadge status={u.status} />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-[11px] text-gray-400">Business</span>
            <span className="text-[12px] font-semibold text-navy-dark text-right">{u.bizName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Location</span>
            <span className="text-[12px] font-semibold text-navy-dark text-right">{u.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Joined</span>
            <span className="text-[12px] font-semibold text-navy-dark">{u.joined}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60">
          <button
            onClick={onClose}
            className="flex-1 h-9 text-[12px] font-semibold text-gray-500 bg-white border border-border rounded-xl hover:bg-gray-50 transition"
          >
            Close
          </button>
          <div className="flex-1">
            {u.status === 'active' ? (
              <button
                onClick={() => onSuspend(u)}
                className="w-full h-9 text-[12px] font-semibold text-brand-red bg-brand-red/5 border border-brand-red/20 rounded-xl hover:bg-brand-red/10 transition flex items-center justify-center gap-1.5"
              >
                <Icon name="pause-circle-outline" style={{ fontSize: '15px' }} />
                Suspend
              </button>
            ) : (
              <button
                onClick={() => onReactivate(u)}
                className="w-full h-9 text-[12px] font-semibold text-brand-green bg-brand-green/5 border border-brand-green/20 rounded-xl hover:bg-brand-green/10 transition flex items-center justify-center gap-1.5"
              >
                <Icon name="play-circle-outline" style={{ fontSize: '15px' }} />
                Reactivate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
