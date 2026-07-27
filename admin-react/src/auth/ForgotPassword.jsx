import { useState } from 'react'
import Icon from '../components/Icon'
import AuthField from './AuthField'
import { useToast } from '../components/Toast'

export default function ForgotPassword({ initialEmail = '', onBack, onCodeSent }) {
  const showToast = useToast()
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      showToast('Verification code sent.', 'success')
      onCodeSent(email.trim())
    }, 600)
  }

  return (
    <form onSubmit={submit}>
      <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-5">
        <Icon name="key-outline" className="text-brand-blue" style={{ fontSize: '26px' }} />
      </div>
      <h2 className="text-[22px] font-extrabold text-navy-dark tracking-tight" style={{ letterSpacing: '-0.4px' }}>
        Forgot your password?
      </h2>
      <p className="text-[12.5px] text-gray-400 mt-1 mb-6 leading-relaxed">
        Enter the email linked to your account and we'll send you a 6-digit verification code.
      </p>

      <div className="space-y-4">
        <AuthField
          label="Email Address"
          icon="mail-outline"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          placeholder="you@company.com"
          autoComplete="username"
          error={error}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 text-[13px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5 disabled:opacity-70"
        >
          {submitting ? 'Sending…' : 'Send Verification Code'}
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
