import { useState } from 'react'
import Icon from '../components/Icon'
import AuthField from './AuthField'
import { useToast } from '../components/Toast'

export default function Login({ onForgot, onAuthenticated }) {
  const showToast = useToast()
  const [email, setEmail] = useState('admin@retailos.io')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!email.trim() || !email.includes('@')) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    // Mock authentication.
    setTimeout(() => {
      setSubmitting(false)
      showToast('Welcome back, Super Admin.', 'success')
      onAuthenticated()
    }, 600)
  }

  return (
    <form onSubmit={submit}>
      <h2 className="text-[22px] font-extrabold text-navy-dark tracking-tight" style={{ letterSpacing: '-0.4px' }}>
        Sign in to your account
      </h2>
      <p className="text-[12.5px] text-gray-400 mt-1 mb-6">Enter your credentials to access the admin portal.</p>

      <div className="space-y-4">
        <AuthField
          label="Email Address"
          icon="mail-outline"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((x) => ({ ...x, email: undefined }))
          }}
          placeholder="you@company.com"
          autoComplete="username"
          error={errors.email}
        />
        <AuthField
          label="Password"
          icon="lock-closed-outline"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((x) => ({ ...x, password: undefined }))
          }}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
          hint={
            <button
              type="button"
              onClick={onForgot}
              className="text-[11px] font-semibold text-brand-blue hover:underline"
            >
              Forgot password?
            </button>
          }
        />

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded accent-navy"
          />
          <span className="text-[12px] text-gray-500">Keep me signed in for 30 days</span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 text-[13px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5 disabled:opacity-70"
        >
          {submitting ? (
            'Signing in…'
          ) : (
            <>
              Sign In
              <Icon name="arrow-forward-outline" style={{ fontSize: '16px' }} />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2.5 mt-6 px-4 py-3 rounded-xl bg-brand-blue/5 border border-brand-blue/15">
        <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0 }} />
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Demo build — any password works. Use <strong className="text-navy-dark">Forgot password?</strong> to preview
          the reset flow.
        </p>
      </div>
    </form>
  )
}
