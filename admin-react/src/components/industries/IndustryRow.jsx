import Icon from '../Icon'

const GRID = { gridTemplateColumns: '2.5fr 1fr 1fr 1fr' }

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
        <button
          onClick={() => onEdit(ind)}
          title="Edit"
          className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition"
        >
          <Icon name="create-outline" style={{ fontSize: '14px' }} />
        </button>
        <button
          onClick={() => onToggle(ind)}
          title={ind.status === 'active' ? 'Deactivate' : 'Activate'}
          className={`w-7 h-7 rounded-lg border transition flex items-center justify-center ${
            ind.status === 'active'
              ? 'border-brand-orange/20 bg-brand-orange/5 text-brand-orange hover:bg-brand-orange/10'
              : 'border-brand-green/20 bg-brand-green/5 text-brand-green hover:bg-brand-green/10'
          }`}
        >
          <Icon name={ind.status === 'active' ? 'eye-off-outline' : 'eye-outline'} style={{ fontSize: '14px' }} />
        </button>
        <button
          onClick={() => onDelete(ind)}
          title="Delete"
          className="w-7 h-7 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
        >
          <Icon name="trash-outline" style={{ fontSize: '14px' }} />
        </button>
      </div>
    </div>
  )
}
