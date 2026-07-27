import Icon from '../Icon'
import ActionButton from '../ActionButton'

const GRID = { gridTemplateColumns: '2.5fr 1fr 1fr 1.8fr' }

export default function IndustryRow({ ind, count, onEdit, onToggle, onDelete }) {
  const inactive = ind.status === 'inactive'
  return (
    <div
      className={`grid items-center px-5 py-3.5 hover:bg-gray-50/60 transition ${inactive ? 'opacity-60' : ''}`}
      style={GRID}
    >
      {/* Name */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-navy/[.08] flex items-center justify-center shrink-0">
          <Icon name="briefcase-outline" className="text-navy" style={{ fontSize: '15px' }} />
        </div>
        <p className="text-[13px] font-semibold text-navy-dark truncate">{ind.name}</p>
      </div>

      {/* Status */}
      <div>
        {ind.status === 'active' ? (
          <span className="text-[9.5px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
            Active
          </span>
        ) : (
          <span className="text-[9.5px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>
        )}
      </div>

      {/* Business count */}
      <div className="text-[12.5px] text-gray-500 font-medium">{count}</div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <ActionButton onClick={() => onEdit(ind)} icon="create-outline" label="Edit" />
        {ind.status === 'active' ? (
          <ActionButton onClick={() => onToggle(ind)} icon="eye-off-outline" label="Deactivate" tone="orange" />
        ) : (
          <ActionButton onClick={() => onToggle(ind)} icon="eye-outline" label="Activate" tone="green" />
        )}
        <ActionButton onClick={() => onDelete(ind)} icon="trash-outline" label="Delete" tone="red" />
      </div>
    </div>
  )
}
