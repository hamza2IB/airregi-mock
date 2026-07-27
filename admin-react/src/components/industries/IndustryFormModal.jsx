import { useEffect, useState } from 'react'
import Icon from '../Icon'

export default function IndustryFormModal({ open, ind, onClose, onSave }) {
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    if (open) {
      setName(ind ? ind.name : '')
      setActive(ind ? ind.status === 'active' : true)
      setNameError(false)
    }
  }, [open, ind])

  if (!open) return null

  const isEdit = !!ind

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError(true)
      return
    }
    onSave({ name: trimmed, status: active ? 'active' : 'inactive' }, ind?.id ?? null)
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,21,53,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
              <Icon name="briefcase-outline" className="text-navy" style={{ fontSize: '20px' }} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-navy-dark">{isEdit ? 'Edit Industry' : 'Add Industry'}</p>
              <p className="text-[11px] text-gray-400">Shown to businesses during registration.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
          >
            <Icon name="close-outline" style={{ fontSize: '18px' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
              Industry Name <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError(false)
              }}
              placeholder="e.g. Grocery & Food"
              className="w-full text-[13px] text-navy-dark bg-page border border-border rounded-xl px-3 py-2.5 placeholder-gray-300"
              style={{ outline: 'none', borderColor: nameError ? '#eb445a' : undefined }}
            />
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between bg-page rounded-xl border border-border px-4 py-3">
            <div>
              <p className="text-[12px] font-semibold text-navy-dark">Industry Active</p>
              <p className="text-[10.5px] text-gray-400">Inactive industries are hidden from registration but not deleted.</p>
            </div>
            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              className={`relative w-[40px] h-[22px] rounded-full transition-colors shrink-0 ml-3 ${active ? 'bg-brand-green' : 'bg-gray-300'}`}
            >
              <span
                className="absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform"
                style={{ transform: active ? 'translateX(18px)' : 'translateX(0)' }}
              ></span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60">
          <button
            onClick={onClose}
            className="flex-1 h-10 text-[12px] font-semibold text-gray-500 bg-white border border-border rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-10 text-[12px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5"
          >
            <Icon name="checkmark-outline" style={{ fontSize: '15px' }} />
            {isEdit ? 'Save Changes' : 'Add Industry'}
          </button>
        </div>
      </div>
    </div>
  )
}
