import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { OWNER_PROFILE } from '../../data/settingsContent'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'

function Form({ onClose }) {
  const showToast = useToast()
  const [name, setName] = useState(OWNER_PROFILE.name)
  const [phone, setPhone] = useState(OWNER_PROFILE.phone)
  const [err, setErr] = useState(false)

  const save = () => {
    if (!name.trim()) { setErr(true); return }
    onClose()
    showToast('Profile updated successfully!', 'success')
  }

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
            <Icon name="person-outline" className="text-navy" style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">Edit Profile</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Update your display name and phone</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4 bg-gray-50 border border-border rounded-2xl px-5 py-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[20px] font-extrabold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#3366cc,#1a2d6b)' }}>{OWNER_PROFILE.initials}</div>
          <div>
            <p className="text-[13px] font-semibold text-navy-dark">{OWNER_PROFILE.name}</p>
            <p className="text-[11px] text-gray-400">{OWNER_PROFILE.email}</p>
          </div>
        </div>
        <div>
          <label className={LBL}>Full Name <span className="text-brand-red">*</span></label>
          <input value={name} onChange={(e) => { setName(e.target.value); setErr(false) }} placeholder="Your full name" className={`${INP} ${err ? '!border-brand-red' : ''}`} />
          {err && <span className="text-[10px] text-brand-red">Name is required</span>}
        </div>
        <div>
          <label className={LBL}>Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="0321-XXXXXXX" className={INP} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <button onClick={save} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">Save Changes</button>
      </div>
    </>
  )
}

export default function EditProfileSlideover({ open, onClose }) {
  const keyRef = useRef(0)
  useEffect(() => { if (open) keyRef.current += 1 }, [open])
  return <Slideover item={open ? { k: keyRef.current } : null} onClose={onClose} width={480} render={() => <Form key={keyRef.current} onClose={onClose} />} />
}
