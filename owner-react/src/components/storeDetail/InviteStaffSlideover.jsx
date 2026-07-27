import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'

function Form({ onCancel, onInvite }) {
  const showToast = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [err, setErr] = useState({})

  const submit = () => {
    const e = {}
    if (!name.trim()) e.name = true
    if (!phone.trim()) e.phone = true
    if (!role) e.role = true
    setErr(e)
    if (Object.keys(e).length) return
    onInvite({ name: name.trim(), phone: phone.trim(), email: email.trim(), role })
    showToast(`Invite sent to ${name.trim()}`, 'success')
  }

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="text-[16px] font-extrabold text-navy-dark">Invite Staff Member</h3>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start gap-2 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3">
          <Icon name="information-circle-outline" className="text-brand-blue shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-600">Staff will receive an invite via SMS/WhatsApp. They log in with their phone number.</p>
        </div>

        <div>
          <label className={LBL}>Full Name <span className="text-brand-red">*</span></label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sana Ahmed" className={`${INP} ${err.name ? '!border-brand-red' : ''}`} />
          {err.name && <span className="text-[10px] text-brand-red">Name is required</span>}
        </div>
        <div>
          <label className={LBL}>Phone Number <span className="text-brand-red">*</span></label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="0321-XXXXXXX" className={`${INP} ${err.phone ? '!border-brand-red' : ''}`} />
          {err.phone && <span className="text-[10px] text-brand-red">Phone is required</span>}
        </div>
        <div>
          <label className={LBL}>Email <span className="text-[10px] text-gray-400 font-normal">(optional)</span></label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="staff@alfatah.pk" className={INP} />
        </div>
        <div>
          <label className={LBL}>Role <span className="text-brand-red">*</span></label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={`${INP} cursor-pointer ${err.role ? '!border-brand-red' : ''}`}>
            <option value="">Select Role</option>
            <option>store_manager</option>
            <option>cashier</option>
            <option>store_staff</option>
          </select>
          {err.role && <span className="text-[10px] text-brand-red">Role is required</span>}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border flex gap-3 sticky bottom-0 bg-white">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light">Send Invite</button>
      </div>
    </>
  )
}

export default function InviteStaffSlideover({ open, onClose, onInvite }) {
  const keyRef = useRef(0)
  useEffect(() => {
    if (open) keyRef.current += 1
  }, [open])
  return (
    <Slideover
      item={open ? { k: keyRef.current } : null}
      onClose={onClose}
      width={480}
      render={() => <Form key={keyRef.current} onCancel={onClose} onInvite={onInvite} />}
    />
  )
}
