import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300 pr-10'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'

const BAR_COLORS = ['bg-gray-200', 'bg-brand-red', 'bg-brand-orange', 'bg-brand-blue', 'bg-brand-green']
const LABELS = ['', 'Weak — add uppercase letters', 'Fair — add numbers', 'Good — add a symbol', 'Strong']
const LABEL_COLORS = ['text-gray-400', 'text-brand-red', 'text-brand-orange', 'text-brand-blue', 'text-brand-green']

function strengthScore(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

function PwField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input value={value} onChange={onChange} type={show ? 'text' : 'password'} placeholder={placeholder} className={INP} />
      <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy">
        <Icon name={show ? 'eye-off-outline' : 'eye-outline'} style={{ fontSize: '16px' }} />
      </button>
    </div>
  )
}

function Form({ onClose }) {
  const showToast = useToast()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState({})

  const score = strengthScore(next)
  const mismatch = confirm && next !== confirm

  const save = () => {
    const e = {}
    if (!current.trim()) e.current = true
    if (next.length < 8) e.new = true
    if (next !== confirm) e.confirm = true
    setErr(e)
    if (Object.keys(e).length) return
    onClose()
    showToast('Password updated successfully!', 'success')
  }

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <Icon name="lock-closed-outline" className="text-brand-orange" style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">Change Password</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Use a strong password with 8+ characters</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className={LBL}>Current Password <span className="text-brand-red">*</span></label>
          <PwField value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" />
          {err.current && <span className="text-[10px] text-brand-red">Current password is required</span>}
        </div>
        <div>
          <label className={LBL}>New Password <span className="text-brand-red">*</span></label>
          <PwField value={next} onChange={(e) => setNext(e.target.value)} placeholder="Min 8 characters" />
          <div className="mt-2 space-y-1.5">
            <div className="flex gap-1 h-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex-1 rounded-full transition-colors ${i <= score ? BAR_COLORS[score] : 'bg-gray-200'}`}></div>
              ))}
            </div>
            <p className={`text-[10px] ${LABEL_COLORS[score]}`}>{LABELS[score]}</p>
          </div>
          {err.new && <span className="text-[10px] text-brand-red">Password must be at least 8 characters</span>}
        </div>
        <div>
          <label className={LBL}>Confirm New Password <span className="text-brand-red">*</span></label>
          <PwField value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" />
          {(mismatch || err.confirm) && <span className="text-[10px] text-brand-red">Passwords do not match</span>}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <button onClick={save} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">Update Password</button>
      </div>
    </>
  )
}

export default function ChangePasswordSlideover({ open, onClose }) {
  const keyRef = useRef(0)
  useEffect(() => { if (open) keyRef.current += 1 }, [open])
  return <Slideover item={open ? { k: keyRef.current } : null} onClose={onClose} width={480} render={() => <Form key={keyRef.current} onClose={onClose} />} />
}
