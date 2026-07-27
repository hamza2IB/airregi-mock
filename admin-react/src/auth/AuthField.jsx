import { useState } from 'react'
import Icon from '../components/Icon'

export default function AuthField({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  hint,
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[11px] font-semibold text-gray-500">{label}</label>
        {hint}
      </div>
      <div
        className="flex items-center gap-2 bg-page border rounded-xl px-3"
        style={{ borderColor: error ? '#eb445a' : '#e8ecf1' }}
      >
        {icon && <Icon name={icon} style={{ fontSize: '16px', color: '#94a3b8', flexShrink: 0 }} />}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent text-[13px] text-navy-dark placeholder-gray-300 border-none outline-none py-2.5"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-gray-400 hover:text-navy transition shrink-0"
            tabIndex={-1}
          >
            <Icon name={show ? 'eye-off-outline' : 'eye-outline'} style={{ fontSize: '16px' }} />
          </button>
        )}
      </div>
      {error && <p className="text-[10.5px] text-brand-red mt-1">{error}</p>}
    </div>
  )
}
