import { useState } from 'react'
import Icon from '../components/Icon'
import AuthField from './AuthField'
import { useToast } from '../components/Toast'

const RULES = [
  { key: 'len', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'num', label: 'Contains a number', test: (p) => /\d/.test(p) },
  { key: 'case', label: 'Upper & lowercase letters', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
]

export default function ResetPassword({ onDone, onBack }) {
  const showToast = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const rulesState = RULES.map((r) => ({ ...r, ok: r.test(password) }))
  const allValid = rulesState.every((r) => r.ok)

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!allValid) next.password = 'Password does not meet the requirements below.'
    if (confirm !== password) next.confirm = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length) return
    setDone(true)
    showToast('Password reset successfully.', 'success')
  }

  if (done) {
    return (
      <div>
        <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-5">
          <Icon name="checkmark-circle" className="text-brand-green" style={{ fontSize: '28px' }} />
        </div>
        <h2 className="text-[22px] font-extrabold text-navy-dark tracking-tight" style={{ letterSpacing: '-0.4px' }}>
          Password reset complete
        </h2>
        <p className="text-[12.5px] text-gray-400 mt-1 mb-6 leading-relaxed">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <button
          onClick={onDone}
          className="w-full h-11 text-[13px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5"
        >
          Back to Sign In
          <Icon name="arrow-forward-outline" style={{ fontSize: '16px' }} />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-5">
        <Icon name="lock-closed-outline" className="text-brand-purple" style={{ fontSize: '24px' }} />
      </div>
      <h2 className="text-[22px] font-extrabold text-navy-dark tracking-tight" style={{ letterSpacing: '-0.4px' }}>
        Set a new password
      </h2>
      <p className="text-[12.5px] text-gray-400 mt-1 mb-6 leading-relaxed">
        Choose a strong password you haven't used before.
      </p>

      <div className="space-y-4">
        <AuthField
          label="New Password"
          icon="lock-closed-outline"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((x) => ({ ...x, password: undefined }))
          }}
          placeholder="Enter new password"
          autoComplete="new-password"
          error={errors.password}
        />

        {/* Requirements checklist */}
        <div className="grid grid-cols-1 gap-1.5 -mt-1">
          {rulesState.map((r) => (
            <div key={r.key} className="flex items-center gap-1.5">
              <Icon
                name={r.ok ? 'checkmark-circle' : 'ellipse-outline'}
                style={{ fontSize: '13px', color: r.ok ? '#2dd36f' : '#cbd5e1', flexShrink: 0 }}
              />
              <span className={`text-[11px] ${r.ok ? 'text-gray-600' : 'text-gray-400'}`}>{r.label}</span>
            </div>
          ))}
        </div>

        <AuthField
          label="Confirm Password"
          icon="lock-closed-outline"
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value)
            if (errors.confirm) setErrors((x) => ({ ...x, confirm: undefined }))
          }}
          placeholder="Re-enter new password"
          autoComplete="new-password"
          error={errors.confirm}
        />

        <button
          type="submit"
          className="w-full h-11 text-[13px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5"
        >
          Reset Password
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-blue hover:underline mt-6 mx-auto"
      >
        <Icon name="arrow-back-outline" style={{ fontSize: '14px' }} /> Back to sign in
      </button>
    </form>
  )
}
