import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { BANKS } from '../../data/subscriptionData'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmtDisplayDate(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return iso
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function fmtDisplayTime(t) {
  if (!t) return '12:00 PM'
  const [hStr, m] = t.split(':')
  const h = parseInt(hStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m} ${ampm}`
}

function Form({ mode, plan, billing, onCancel, onSubmit }) {
  const showToast = useToast()
  const isPlanChange = mode === 'plan-change'
  const defaultAmount = isPlanChange ? String(plan.prices[billing]) : '60000'
  const [bank, setBank] = useState('')
  const [amount, setAmount] = useState(defaultAmount)
  const [ref, setRef] = useState('')
  const [date, setDate] = useState('2026-07-20')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [err, setErr] = useState({})

  const submit = () => {
    const e = {}
    if (!bank) e.bank = true
    if (!amount.trim()) e.amount = true
    if (!ref.trim()) e.ref = true
    if (!date.trim()) e.date = true
    setErr(e)
    if (Object.keys(e).length) return
    onSubmit({
      date: fmtDisplayDate(date),
      time: fmtDisplayTime(time),
      amount: 'Rs.' + parseInt(amount, 10).toLocaleString(),
      plan: isPlanChange ? plan.name : 'Pro',
      bank,
      ref: ref.trim(),
      status: 'pending',
    })
    showToast(isPlanChange ? 'Plan change payment submitted — pending verification' : 'Payment submitted — pending verification', 'success')
  }

  const amountDue = isPlanChange ? `Rs.${plan.prices[billing].toLocaleString()}` : 'Rs.60,000'

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
            <Icon name="card-outline" className="text-navy" style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">{isPlanChange ? 'Confirm Plan Change' : 'Submit Payment'}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Subscription renewal · {isPlanChange ? `${plan.name} Plan` : 'Pro Plan'}</p>
          </div>
        </div>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Plan-change summary pill */}
        {isPlanChange && (
          <div className="flex items-center justify-between bg-brand-purple/5 border border-brand-purple/20 rounded-xl px-4 py-3">
            <div>
              <p className="text-[12px] font-semibold text-brand-purple">Switch to {plan.name} Plan</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{billing === 'yearly' ? 'Yearly billing' : 'Monthly billing'}</p>
            </div>
            <span className="text-[16px] font-extrabold text-navy-dark">Rs.{plan.prices[billing].toLocaleString()}</span>
          </div>
        )}

        {/* How it works */}
        <div className="flex items-start gap-3 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3.5">
          <Icon name="information-circle-outline" className="text-brand-blue shrink-0 mt-0.5" style={{ fontSize: '18px' }} />
          <div>
            <p className="text-[12px] font-semibold text-navy-dark">How it works</p>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Transfer the subscription fee to the bank account below, then fill in the transfer details. Admin will verify within 24 hours and activate your subscription.</p>
          </div>
        </div>

        {/* Bank details */}
        <div className="bg-navy-dark rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-3">Transfer To</p>
          <div className="space-y-2.5 text-[13px] relative z-10">
            <div className="flex items-center justify-between"><span className="text-white/60">Bank</span><span className="font-semibold">HBL · Gulberg Branch</span></div>
            <div className="flex items-center justify-between"><span className="text-white/60">Account Title</span><span className="font-semibold">RetailOS Pvt. Ltd.</span></div>
            <div className="flex items-center justify-between"><span className="text-white/60">Account #</span><span className="font-semibold font-mono tracking-wider">0123-4567-8901</span></div>
            <div className="border-t border-white/15 pt-2.5 flex items-center justify-between"><span className="text-white/60">Amount Due</span><span className="text-[18px] font-extrabold text-brand-green">{amountDue}</span></div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-[11px] text-gray-400 font-medium">Enter your transfer details</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LBL}>Your Bank <span className="text-brand-red">*</span></label>
            <select value={bank} onChange={(e) => setBank(e.target.value)} className={`${INP} cursor-pointer ${err.bank ? '!border-brand-red' : ''}`}>
              <option value="">Select bank</option>
              {BANKS.map((b) => <option key={b}>{b}</option>)}
            </select>
            {err.bank && <span className="text-[10px] text-brand-red">Required</span>}
          </div>
          <div>
            <label className={LBL}>Transfer Amount <span className="text-brand-red">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-gray-400">Rs.</span>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="60000" className={`${INP} pl-9 ${err.amount ? '!border-brand-red' : ''}`} />
            </div>
            {err.amount && <span className="text-[10px] text-brand-red">Required</span>}
          </div>
        </div>

        <div>
          <label className={LBL}>Reference / Transaction # <span className="text-brand-red">*</span></label>
          <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. TXN-20260720-XXXX" className={`${INP} ${err.ref ? '!border-brand-red' : ''}`} />
          {err.ref && <span className="text-[10px] text-brand-red">Required</span>}
        </div>

        <div>
          <label className={LBL}>Transfer Date <span className="text-brand-red">*</span></label>
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className={`${INP} ${err.date ? '!border-brand-red' : ''}`} />
          {err.date && <span className="text-[10px] text-brand-red">Required</span>}
        </div>

        <div>
          <label className={LBL}>Transfer Time <span className="text-[10px] text-gray-400 font-normal">(optional)</span></label>
          <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className={INP} />
        </div>

        <div>
          <label className={LBL}>Notes <span className="text-[10px] text-gray-400 font-normal">(optional)</span></label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any additional details for admin…" className={`${INP} !h-auto py-2.5 resize-none`}></textarea>
        </div>

        <div>
          <label className={LBL}>Upload Receipt <span className="text-[10px] text-gray-400 font-normal">(optional · speeds up verification)</span></label>
          <div onClick={() => showToast('File upload coming soon', 'info')} className="h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-50 hover:border-navy/30 transition">
            <Icon name="cloud-upload-outline" style={{ fontSize: '22px', color: '#94a3b8' }} />
            <span className="text-[11px] text-gray-400">Click to upload PDF or image</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-brand-orange/5 border border-brand-orange/20 rounded-xl px-4 py-3">
          <Icon name="time-outline" className="text-brand-orange shrink-0 mt-0.5" style={{ fontSize: '16px' }} />
          <p className="text-[11px] text-gray-600">Your payment will show as <span className="font-semibold text-brand-orange">Pending</span> until admin verifies it. This usually takes up to 24 hours.</p>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-2">
          <Icon name="checkmark-circle-outline" style={{ fontSize: '16px' }} /> Submit Payment
        </button>
      </div>
    </>
  )
}

// `item` = null | { mode:'renew' } | { mode:'plan-change', plan, billing }
export default function RenewalSlideover({ item, onClose, onSubmit }) {
  const keyRef = useRef(0)
  useEffect(() => {
    if (item) keyRef.current += 1
  }, [item])
  return (
    <Slideover
      item={item}
      onClose={onClose}
      width={520}
      render={(it) => <Form key={keyRef.current} mode={it.mode} plan={it.plan} billing={it.billing} onCancel={onClose} onSubmit={onSubmit} />}
    />
  )
}
