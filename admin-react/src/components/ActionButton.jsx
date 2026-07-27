import Icon from './Icon'

// Shared row-action button used across every admin-react list/table so all action
// buttons share an identical structure (icon + label). Only the semantic colour
// (tone) changes — neutral for view/edit, and green/orange/red for
// activate/deactivate/destructive actions.
const TONES = {
  neutral: 'border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50',
  primary: 'border-navy/20 bg-navy/[0.04] text-navy hover:bg-navy/10',
  green: 'border-brand-green/20 bg-brand-green/5 text-brand-green hover:bg-brand-green/10',
  orange: 'border-brand-orange/20 bg-brand-orange/5 text-brand-orange hover:bg-brand-orange/10',
  red: 'border-brand-red/20 bg-brand-red/5 text-brand-red hover:bg-brand-red/10',
}

export default function ActionButton({ icon, label, onClick, tone = 'neutral', title, className = '' }) {
  return (
    <button
      onClick={onClick}
      title={title || label}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition whitespace-nowrap shrink-0 ${TONES[tone] || TONES.neutral} ${className}`}
    >
      <Icon name={icon} style={{ fontSize: '12px', flexShrink: 0 }} />
      {label}
    </button>
  )
}
