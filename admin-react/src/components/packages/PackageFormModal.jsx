import { useEffect, useState } from 'react'
import Icon from '../Icon'
import { PKG_FEATURE_LIST } from '../../data/packageData'

const LIMIT_FIELDS = [
  { key: 'maxStores', label: 'Max Stores', placeholder: 'e.g. 10' },
  { key: 'maxWarehouses', label: 'Max Warehouses', placeholder: 'e.g. 3' },
  { key: 'maxUsers', label: 'Max Users', placeholder: 'e.g. 50' },
  { key: 'maxProducts', label: 'Max Products', placeholder: 'e.g. 5000' },
]

// Convert a stored limit (number | null) into form state.
function limitToField(v) {
  if (v === null || v === undefined) return { value: '', unlimited: v === null }
  return { value: String(v), unlimited: false }
}

function buildInitialState(pkg) {
  return {
    name: pkg?.name ?? '',
    description: pkg?.description ?? '',
    monthly: pkg ? String(pkg.monthly) : '',
    yearly: pkg && pkg.yearly ? String(pkg.yearly) : '',
    limits: {
      maxStores: pkg ? limitToField(pkg.maxStores) : { value: '', unlimited: false },
      maxWarehouses: pkg ? limitToField(pkg.maxWarehouses) : { value: '', unlimited: false },
      maxUsers: pkg ? limitToField(pkg.maxUsers) : { value: '', unlimited: false },
      maxProducts: pkg ? limitToField(pkg.maxProducts) : { value: '', unlimited: false },
    },
    features: pkg ? [...pkg.features] : ['ecommerce'],
    enabled: pkg ? pkg.enabled : true,
  }
}

export default function PackageFormModal({ open, pkg, onClose, onSave }) {
  const [form, setForm] = useState(buildInitialState(pkg))
  const [errors, setErrors] = useState({ name: false, monthly: false })

  useEffect(() => {
    if (open) {
      setForm(buildInitialState(pkg))
      setErrors({ name: false, monthly: false })
    }
  }, [open, pkg])

  if (!open) return null

  const isEdit = !!pkg
  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const setLimit = (key, patch) =>
    setForm((f) => ({ ...f, limits: { ...f.limits, [key]: { ...f.limits[key], ...patch } } }))
  const toggleFeature = (key) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(key) ? f.features.filter((k) => k !== key) : [...f.features, key],
    }))

  const handleSave = () => {
    const name = form.name.trim()
    const monthly = form.monthly.trim()
    const nextErrors = { name: !name, monthly: !monthly || isNaN(Number(monthly)) }
    setErrors(nextErrors)
    if (nextErrors.name || nextErrors.monthly) return

    const toNum = (v) => (v === '' ? null : parseInt(v, 10))
    const limitVal = (key) => (form.limits[key].unlimited ? null : toNum(form.limits[key].value.trim()))

    const payload = {
      name,
      description: form.description.trim(),
      monthly: parseInt(monthly, 10),
      yearly: toNum(form.yearly.trim()) || parseInt(monthly, 10) * 12,
      maxStores: limitVal('maxStores'),
      maxWarehouses: limitVal('maxWarehouses'),
      maxUsers: limitVal('maxUsers'),
      maxProducts: limitVal('maxProducts'),
      features: form.features,
      enabled: form.enabled,
    }
    onSave(payload, pkg?.id ?? null)
  }

  const inputCls =
    'w-full text-[13px] text-navy-dark bg-page border border-border rounded-xl px-3 py-2.5 placeholder-gray-300'

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,21,53,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
              <Icon name="layers-outline" className="text-navy" style={{ fontSize: '20px' }} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-navy-dark">{isEdit ? 'Edit Package' : 'Create Package'}</p>
              <p className="text-[11px] text-gray-400">Define pricing tier and platform limits.</p>
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
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
              Package Name <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setField('name', e.target.value)
                if (errors.name) setErrors((x) => ({ ...x, name: false }))
              }}
              placeholder="e.g. Enterprise"
              className={inputCls}
              style={{ outline: 'none', borderColor: errors.name ? '#eb445a' : undefined }}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Short one-line description shown on registration page"
              className="w-full text-[12px] text-navy-dark bg-page border border-border rounded-xl px-3 py-2.5 resize-none placeholder-gray-300"
              style={{ outline: 'none' }}
            ></textarea>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                Monthly Price (Rs.) <span className="text-brand-red">*</span>
              </label>
              <input
                type="number"
                value={form.monthly}
                onChange={(e) => {
                  setField('monthly', e.target.value)
                  if (errors.monthly) setErrors((x) => ({ ...x, monthly: false }))
                }}
                placeholder="60000"
                className={inputCls}
                style={{ outline: 'none', borderColor: errors.monthly ? '#eb445a' : undefined }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Yearly Price (Rs.)</label>
              <input
                type="number"
                value={form.yearly}
                onChange={(e) => setField('yearly', e.target.value)}
                placeholder="648000"
                className={inputCls}
                style={{ outline: 'none' }}
              />
            </div>
          </div>

          {/* Limits */}
          <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 mt-5">Platform Limits</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {LIMIT_FIELDS.map((lf) => {
              const state = form.limits[lf.key]
              return (
                <div key={lf.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-gray-500">{lf.label}</label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded accent-navy"
                        checked={state.unlimited}
                        onChange={(e) => setLimit(lf.key, { unlimited: e.target.checked, value: e.target.checked ? '' : state.value })}
                      />
                      <span className="text-[10px] text-gray-400">Unlimited</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    value={state.value}
                    disabled={state.unlimited}
                    onChange={(e) => setLimit(lf.key, { value: e.target.value })}
                    placeholder={lf.placeholder}
                    className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
                    style={{ outline: 'none' }}
                  />
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-gray-400 mb-4">Check "Unlimited" to remove a cap on that resource.</p>

          {/* Feature flags */}
          <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 mt-5">Feature Flags</p>
          <div className="space-y-2 mb-4">
            {PKG_FEATURE_LIST.map((f) => (
              <label key={f.key} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-navy"
                  checked={form.features.includes(f.key)}
                  onChange={() => toggleFeature(f.key)}
                />
                <span className="text-[12px] text-gray-600">{f.label}</span>
              </label>
            ))}
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between bg-page rounded-xl border border-border px-4 py-3 mt-5">
            <div>
              <p className="text-[12px] font-semibold text-navy-dark">Package Enabled</p>
              <p className="text-[10.5px] text-gray-400">
                Disabled packages are hidden from the registration page but existing subscribers are unaffected.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setField('enabled', !form.enabled)}
              className={`relative w-[40px] h-[22px] rounded-full transition-colors shrink-0 ml-3 ${form.enabled ? 'bg-brand-green' : 'bg-gray-300'}`}
            >
              <span
                className="absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform"
                style={{ transform: form.enabled ? 'translateX(18px)' : 'translateX(0)' }}
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
            {isEdit ? 'Save Changes' : 'Create Package'}
          </button>
        </div>
      </div>
    </div>
  )
}
