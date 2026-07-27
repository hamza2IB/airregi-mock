import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { OWNER_PROFILE } from '../../data/settingsContent'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'

function Form({ onClose }) {
  const showToast = useToast()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim() !== OWNER_PROFILE.email

  const sendCode = () => {
    setStep(2)
    showToast('Verification code sent!', 'success')
  }
  const confirm = () => {
    onClose()
    showToast('Email updated successfully!', 'success')
  }

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <Icon name="mail-outline" className="text-brand-blue" style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">Change Email</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">A verification code will be sent to your new email</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      {step === 1 ? (
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3">
            <Icon name="information-circle-outline" className="text-brand-blue shrink-0 mt-0.5" style={{ fontSize: '17px' }} />
            <p className="text-[11px] text-gray-600">Current email: <span className="font-semibold text-navy-dark">{OWNER_PROFILE.email}</span></p>
          </div>
          <div>
            <label className={LBL}>New Email Address <span className="text-brand-red">*</span></label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="new@email.com" className={INP} />
          </div>
          <button onClick={sendCode} disabled={!emailValid} className="w-full py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition disabled:opacity-40 disabled:cursor-not-allowed">
            Send Verification Code
          </button>
        </div>
      ) : (
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 bg-brand-green/5 border border-brand-green/20 rounded-xl px-4 py-3">
            <Icon name="checkmark-circle-outline" className="text-brand-green shrink-0 mt-0.5" style={{ fontSize: '17px' }} />
            <p className="text-[11px] text-gray-600">Code sent to <span className="font-semibold text-navy-dark">{email}</span></p>
          </div>
          <div>
            <label className={LBL}>Verification Code <span className="text-brand-red">*</span></label>
            <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} maxLength={6} placeholder="– – – – – –" className={`${INP} text-center tracking-[0.3em] font-mono !text-[18px]`} />
          </div>
          <p className="text-[11px] text-gray-400">Didn't receive it?{' '}
            <button onClick={() => showToast('Code resent!', 'success')} className="text-brand-blue font-semibold hover:underline">Resend Code</button>
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Back</button>
            <button onClick={confirm} disabled={code.length !== 6} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition disabled:opacity-40 disabled:cursor-not-allowed">Confirm Change</button>
          </div>
        </div>
      )}
    </>
  )
}

export default function ChangeEmailSlideover({ open, onClose }) {
  const keyRef = useRef(0)
  useEffect(() => { if (open) keyRef.current += 1 }, [open])
  return <Slideover item={open ? { k: keyRef.current } : null} onClose={onClose} width={480} render={() => <Form key={keyRef.current} onClose={onClose} />} />
}
