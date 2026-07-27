import { useEffect, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { STAFF_ROLES, initials } from '../../data/storeDetailData'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'

function Form({ staff, onCancel, onSave }) {
  const [name, setName] = useState(staff.name || '')
  const [phone, setPhone] = useState(staff.phone || '')
  const [email, setEmail] = useState(staff.email || '')
  const [role, setRole] = useState(staff.role || '')
  const [err, setErr] = useState({})

  // Re-seed when a different staff member is opened.
  useEffect(() => {
    setName(staff.name || '')
    setPhone(staff.phone || '')
    setEmail(staff.email || '')
    setRole(staff.role || '')
    setErr({})
  }, [staff])

  const submit = () => {
    const e = {}
    if (!name.trim()) e.name = true
    if (!phone.trim()) e.phone = true
    if (!role) e.role = true
    setErr(e)
    if (Object.keys(e).length) return
    onSave(staff.id, { name: name.trim(), phone: phone.trim(), email: email.trim(), role })
  }

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-[11px] shrink-0">{initials(name || staff.name)}</div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-extrabold text-navy-dark truncate">Edit Staff Member</h3>
            <p className="text-[11px] text-gray-400 truncate">{staff.name}</p>
          </div>
        </div>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6 space-y-4">
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
            {STAFF_ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
          {err.role && <span className="text-[10px] text-brand-red">Role is required</span>}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border flex gap-3 sticky bottom-0 bg-white">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light">Save Changes</button>
      </div>
    </>
  )
}

export default function EditStaffSlideover({ staff, onClose, onSave }) {
  return (
    <Slideover
      item={staff}
      onClose={onClose}
      width={480}
      render={(s) => <Form staff={s} onCancel={onClose} onSave={onSave} />}
    />
  )
}
