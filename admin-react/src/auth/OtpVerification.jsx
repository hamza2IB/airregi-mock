import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'

const LENGTH = 6
const RESEND_SECONDS = 30

export default function OtpVerification({ email, onBack, onVerified }) {
  const showToast = useToast()
  const [digits, setDigits] = useState(Array(LENGTH).fill(''))
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const inputsRef = useRef([])

  // Resend countdown.
  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const setDigit = (i, val) => {
    setDigits((prev) => {
      const next = [...prev]
      next[i] = val
      return next
    })
  }

  const handleChange = (i, raw) => {
    const val = raw.replace(/\D/g, '')
    if (error) setError('')
    if (!val) {
      setDigit(i, '')
      return
    }
    // If multiple chars (e.g., fast typing), take the last.
    const ch = val[val.length - 1]
    setDigit(i, ch)
    if (i < LENGTH - 1) inputsRef.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < LENGTH - 1) inputsRef.current[i + 1]?.focus()
  }

  const handlePaste = (e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, LENGTH)
    if (!text) return
    e.preventDefault()
    const next = Array(LENGTH).fill('')
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setDigits(next)
    const focusIdx = Math.min(text.length, LENGTH - 1)
    inputsRef.current[focusIdx]?.focus()
  }

  const code = digits.join('')

  const verify = (e) => {
    e.preventDefault()
    if (code.length < LENGTH) {
      setError('Enter the full 6-digit code.')
      return
    }
    // Mock verification — any 6-digit code is accepted.
    showToast('Code verified.', 'success')
    onVerified()
  }

  const resend = () => {
    if (seconds > 0) return
    setSeconds(RESEND_SECONDS)
    setDigits(Array(LENGTH).fill(''))
    setError('')
    inputsRef.current[0]?.focus()
    showToast('A new code has been sent.', 'success')
  }

  return (
    <form onSubmit={verify}>
      <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-5">
        <Icon name="mail-open-outline" className="text-brand-blue" style={{ fontSize: '26px' }} />
      </div>
      <h2 className="text-[22px] font-extrabold text-navy-dark tracking-tight" style={{ letterSpacing: '-0.4px' }}>
        Enter verification code
      </h2>
      <p className="text-[12.5px] text-gray-400 mt-1 mb-6 leading-relaxed">
        We sent a 6-digit code to <strong className="text-navy-dark">{email}</strong>. Enter it below to continue.
      </p>

      {/* OTP boxes */}
      <div className="flex items-center gap-2 justify-between" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-[20px] font-bold text-navy-dark bg-page border rounded-xl outline-none transition focus:border-navy focus:bg-white"
            style={{ borderColor: error ? '#eb445a' : '#e8ecf1' }}
          />
        ))}
      </div>
      {error && <p className="text-[10.5px] text-brand-red mt-2">{error}</p>}

      <button
        type="submit"
        className="w-full h-11 text-[13px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5 mt-5"
      >
        Verify Code
        <Icon name="arrow-forward-outline" style={{ fontSize: '16px' }} />
      </button>

      {/* Resend */}
      <div className="text-center mt-4">
        {seconds > 0 ? (
          <p className="text-[12px] text-gray-400">
            Didn't get the code? Resend in <span className="font-semibold text-navy-dark">{seconds}s</span>
          </p>
        ) : (
          <button type="button" onClick={resend} className="text-[12px] font-semibold text-brand-blue hover:underline">
            Resend code
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-blue hover:underline mt-4 mx-auto"
      >
        <Icon name="arrow-back-outline" style={{ fontSize: '14px' }} /> Change email
      </button>
    </form>
  )
}
