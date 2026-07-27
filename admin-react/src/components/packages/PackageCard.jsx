import Icon from '../Icon'
import { PKG_FEATURE_LIST, pkgFmtLimit, pkgFmtPrice, pkgSavings } from '../../data/packageData'

function LimitRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-1.5">
        <Icon name={icon} style={{ fontSize: '12px', color: '#94a3b8', flexShrink: 0 }} />
        <span className="text-[11px] text-gray-500">{label}</span>
      </div>
      <span className="text-[11px] font-semibold text-navy-dark">{pkgFmtLimit(value)}</span>
    </div>
  )
}

export default function PackageCard({ p, onEdit, onToggle }) {
  const features = PKG_FEATURE_LIST.filter((f) => p.features.includes(f.key))

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden flex flex-col ${p.enabled ? 'border-border' : 'border-gray-100 opacity-70'}`}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-border"
        style={{ background: `linear-gradient(135deg,${p.accent}10,${p.accent}03)` }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.colorClass}`}>{p.name}</span>
          {p.enabled ? (
            <span className="text-[9.5px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
              Enabled
            </span>
          ) : (
            <span className="text-[9.5px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Disabled</span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 leading-snug">{p.description}</p>
      </div>

      {/* Pricing */}
      <div className="px-5 py-4">
        <p className="text-[26px] font-extrabold text-navy-dark leading-none">
          {pkgFmtPrice(p.monthly)}
          <span className="text-[12px] text-gray-400 font-medium">/mo</span>
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {pkgFmtPrice(p.yearly)}/year{' '}
          <span className="text-brand-green font-semibold">(save {pkgSavings(p.monthly, p.yearly)}%)</span>
        </p>
      </div>

      {/* Limits */}
      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Platform Limits</p>
        <LimitRow icon="storefront-outline" label="Max Stores" value={p.maxStores} />
        <LimitRow icon="business-outline" label="Max Warehouses" value={p.maxWarehouses} />
        <LimitRow icon="people-outline" label="Max Users" value={p.maxUsers} />
        <LimitRow icon="cube-outline" label="Max Products" value={p.maxProducts} />
      </div>

      {/* Features */}
      <div className="px-5 py-3 border-t border-gray-100 flex-1">
        <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Features</p>
        {features.map((f) => (
          <div key={f.key} className="flex items-center gap-1.5 py-1">
            <Icon name="checkmark-circle" style={{ fontSize: '13px', color: '#2dd36f', flexShrink: 0 }} />
            <span className="text-[11px] text-gray-600">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Active subs */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
        <span className="text-[11px] text-gray-500">Active Subscribers</span>
        <span className="text-[13px] font-bold text-navy-dark">{p.activeSubs}</span>
      </div>

      {/* Actions */}
      <div className="px-5 py-3.5 border-t border-border flex items-center gap-2">
        <button
          onClick={() => onEdit(p)}
          className="flex-1 h-9 text-[11px] font-semibold text-navy bg-navy/5 border border-navy/15 rounded-xl hover:bg-navy/10 transition flex items-center justify-center gap-1.5"
        >
          <Icon name="create-outline" style={{ fontSize: '14px' }} />
          Edit
        </button>
        <button
          onClick={() => onToggle(p)}
          className={`flex-1 h-9 text-[11px] font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            p.enabled
              ? 'text-brand-orange bg-brand-orange/5 border border-brand-orange/20 hover:bg-brand-orange/10'
              : 'text-brand-green bg-brand-green/5 border border-brand-green/20 hover:bg-brand-green/10'
          }`}
        >
          <Icon name={p.enabled ? 'eye-off-outline' : 'eye-outline'} style={{ fontSize: '14px' }} />
          {p.enabled ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  )
}
