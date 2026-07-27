import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'

const ROLES = ['store_manager', 'cashier', 'store_staff', 'warehouse_manager']
const STORES = ['Al Fatah Main Branch', 'Al Fatah DHA Branch', 'Al Fatah Johar Town', 'Central Warehouse']
const STATUSES = ['active', 'invited', 'inactive']

function Form({ user, onCancel, onSubmit }) {
  const showToast = useToast()
  const editing = !!user
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [email, setEmail] = useState(user?.email || '')
  const [role, setRole] = useState(user?.role || '')
  const [store, setStore] = useState(user?.store || '')
  const [status, setStatus] = useState(user?.status || 'active')
  const [err, setErr] = useState({})

  const submit = () => {
    const e = {}
    if (!name.trim()) e.name = true
    if (!phone.trim()) e.phone = true
    if (!role) e.role = true
    if (!store) e.store = true
    setErr(e)
    if (Object.keys(e).length) return
    const payload = { name: name.trim(), phone: phone.trim(), email: email.trim(), role, store }
    if (editing) payload.status = status
    onSubmit(payload, editing ? user.id : null)
    showToast(editing ? `${name.trim()} updated` : `Invite sent to ${name.trim()}!`, 'success')
  }

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="text-[16px] font-extrabold text-navy-dark">{editing ? 'Edit User' : 'Invite User'}</h3>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className={LBL}>Full Name <span className="text-brand-red">*</span></label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={`${INP} ${err.name ? '!border-brand-red' : ''}`} />
          {err.name && <span className="text-[10px] text-brand-red">Required</span>}
        </div>
        <div>
          <label className={LBL}>Phone Number <span className="text-brand-red">*</span> <span className="text-[10px] text-gray-400 font-normal">(primary identifier)</span></label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="0321-XXXXXXX" className={`${INP} ${err.phone ? '!border-brand-red' : ''}`} />
          {err.phone && <span className="text-[10px] text-brand-red">Required</span>}
        </div>
        <div>
          <label className={LBL}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="user@alfatah.pk" className={INP} />
        </div>
        <div>
          <label className={LBL}>Role <span className="text-brand-red">*</span></label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={`${INP} cursor-pointer ${err.role ? '!border-brand-red' : ''}`}>
            <option value="">Select Role</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          {err.role && <span className="text-[10px] text-brand-red">Required</span>}
        </div>
        <div>
          <label className={LBL}>Store / Location <span className="text-brand-red">*</span></label>
          <select value={store} onChange={(e) => setStore(e.target.value)} className={`${INP} cursor-pointer ${err.store ? '!border-brand-red' : ''}`}>
            <option value="">Select Store</option>
            {STORES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {err.store && <span className="text-[10px] text-brand-red">Required</span>}
        </div>
        {editing && (
          <div>
            <label className={LBL}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${INP} cursor-pointer capitalize`}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-border flex gap-3 sticky bottom-0 bg-white">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light">{editing ? 'Save Changes' : 'Send Invite'}</button>
      </div>
    </>
  )
}

// `item` = null | { user } where user is null for invite, an object for edit.
export default function UserFormSlideover({ item, onClose, onSubmit }) {
  const keyRef = useRef(0)
  useEffect(() => {
    if (item) keyRef.current += 1
  }, [item])
  return (
    <Slideover
      item={item}
      onClose={onClose}
      width={480}
      render={(it) => <Form key={keyRef.current} user={it.user} onCancel={onClose} onSubmit={onSubmit} />}
    />
  )
}
