import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { PROVINCES, PROVINCE_CITIES, WEEK_DAYS } from '../../data/storesData'

const INP = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] text-[13px] text-navy-dark focus:outline-none focus:border-navy placeholder-gray-300'
const LBL = 'block text-[11px] text-gray-500 font-semibold mb-1.5'

function blankForm(store) {
  if (store) {
    return {
      type: store.type === 'Warehouse' ? 'warehouse' : 'retail',
      name: store.name || '',
      code: store.code || '',
      province: '',
      city: store.city || '',
      area: store.area || '',
      street: '',
      postal: '',
      lat: store.coords ? String(store.coords.lat) : '',
      lng: store.coords ? String(store.coords.lng) : '',
      phone: '',
      email: '',
    }
  }
  return {
    type: 'retail', name: '', code: 'RS-005', province: '', city: '',
    area: '', street: '', postal: '', lat: '', lng: '', phone: '', email: '',
  }
}

function StoreForm({ store, onCancel, onSave }) {
  const showToast = useToast()
  const [f, setF] = useState(() => blankForm(store))
  const [errors, setErrors] = useState({})
  const [gps, setGps] = useState(null) // 'ok' | 'error' | null
  const [gpsMsg, setGpsMsg] = useState('')
  const [detecting, setDetecting] = useState(false)
  const isEdit = !!store

  const set = (k, v) => setF((prev) => ({ ...prev, [k]: v }))

  const cities = PROVINCE_CITIES[f.province] || []
  const hasCoords = f.lat !== '' && f.lng !== '' && !isNaN(f.lat) && !isNaN(f.lng)

  const detect = () => {
    setGps(null)
    if (!navigator.geolocation) {
      setGpsMsg('Geolocation is not supported by your browser.')
      setGps('error')
      return
    }
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('lat', pos.coords.latitude.toFixed(6))
        set('lng', pos.coords.longitude.toFixed(6))
        setGps('ok')
        setDetecting(false)
      },
      () => {
        setGpsMsg('Unable to detect location. Please allow location access or enter coordinates manually.')
        setGps('error')
        setDetecting(false)
      }
    )
  }

  const validate = () => {
    const e = {}
    if (!f.name.trim()) e.name = true
    if (!f.area.trim()) e.area = true
    if (!f.street.trim()) e.street = true
    if (f.lat && (isNaN(f.lat) || +f.lat < -90 || +f.lat > 90)) e.lat = true
    if (f.lng && (isNaN(f.lng) || +f.lng < -180 || +f.lng > 180)) e.lng = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = () => {
    if (!validate()) return
    const coords = hasCoords ? { lat: +f.lat, lng: +f.lng } : null
    onSave(
      {
        name: f.name.trim(),
        code: f.code.trim(),
        type: f.type === 'warehouse' ? 'Warehouse' : 'Retail',
        city: f.city || '—',
        area: f.area.trim(),
        coords,
      },
      isEdit ? store.id : null
    )
    showToast(isEdit ? 'Store updated!' : 'Store added!', 'success')
  }

  return (
    <>
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="text-[16px] font-extrabold text-navy-dark">{isEdit ? 'Edit Store' : 'Add Store'}</h3>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Store type */}
        <div>
          <label className={LBL}>Store Type</label>
          <div className="flex gap-2">
            {['retail', 'warehouse'].map((t) => (
              <button
                key={t}
                onClick={() => set('type', t)}
                className={`flex-1 py-2.5 rounded-xl border-2 text-[12px] font-semibold capitalize transition ${
                  f.type === t ? 'border-navy bg-navy/5 text-navy' : 'border-border text-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Name + Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LBL}>Store Name <span className="text-brand-red">*</span></label>
            <input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Main Branch" className={`${INP} ${errors.name ? '!border-brand-red' : ''}`} />
            {errors.name && <span className="text-[10px] text-brand-red">Required</span>}
          </div>
          <div>
            <label className={LBL}>Store Code <span className="text-brand-red">*</span></label>
            <input value={f.code} onChange={(e) => set('code', e.target.value)} placeholder="RS-005" className={INP} />
          </div>
        </div>

        {/* Province + City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LBL}>Province</label>
            <select value={f.province} onChange={(e) => setF((p) => ({ ...p, province: e.target.value, city: '' }))} className={`${INP} cursor-pointer`}>
              <option value="">Select Province</option>
              {PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={LBL}>City</label>
            <select value={f.city} onChange={(e) => set('city', e.target.value)} className={`${INP} cursor-pointer`}>
              <option value="">Select City</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={LBL}>Area <span className="text-brand-red">*</span></label>
          <input value={f.area} onChange={(e) => set('area', e.target.value)} placeholder="e.g. DHA Phase 5" className={`${INP} ${errors.area ? '!border-brand-red' : ''}`} />
          {errors.area && <span className="text-[10px] text-brand-red">Required</span>}
        </div>

        <div>
          <label className={LBL}>Street Address <span className="text-brand-red">*</span></label>
          <input value={f.street} onChange={(e) => set('street', e.target.value)} placeholder="Street / Building number" className={`${INP} ${errors.street ? '!border-brand-red' : ''}`} />
          {errors.street && <span className="text-[10px] text-brand-red">Required</span>}
        </div>

        <div>
          <label className={LBL}>Postal Code</label>
          <input value={f.postal} onChange={(e) => set('postal', e.target.value)} placeholder="54000" className={INP} />
        </div>

        {/* Location coordinates */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] text-gray-500 font-semibold">
              Location Coordinates <span className="text-[10px] text-gray-400 font-normal">(used for map pin &amp; delivery radius)</span>
            </label>
            <button onClick={detect} disabled={detecting} className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-blue bg-brand-blue/[.08] border border-brand-blue/20 px-3 py-1.5 rounded-lg hover:bg-brand-blue/15 transition disabled:opacity-60">
              <Icon name={detecting ? 'sync-outline' : 'locate-outline'} className={detecting ? 'animate-spin' : ''} style={{ fontSize: '13px' }} />
              {detecting ? 'Detecting…' : 'Detect my location'}
            </button>
          </div>

          {gps === 'ok' && (
            <div className="flex items-center gap-2 bg-brand-green/[.08] border border-brand-green/20 rounded-xl px-3 py-2 mb-3">
              <Icon name="checkmark-circle" className="text-brand-green shrink-0" style={{ fontSize: '15px' }} />
              <p className="text-[11px] font-semibold text-brand-green flex-1">Location detected successfully</p>
              <button onClick={() => setGps(null)} className="text-brand-green/60 hover:text-brand-green">
                <Icon name="close-outline" style={{ fontSize: '14px' }} />
              </button>
            </div>
          )}
          {gps === 'error' && (
            <div className="flex items-center gap-2 bg-brand-red/[.08] border border-brand-red/20 rounded-xl px-3 py-2 mb-3">
              <Icon name="warning-outline" className="text-brand-red shrink-0" style={{ fontSize: '15px' }} />
              <p className="text-[11px] font-semibold text-brand-red">{gpsMsg}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LBL}>Latitude</label>
              <div className="relative">
                <Icon name="arrow-up-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '13px' }} />
                <input value={f.lat} onChange={(e) => set('lat', e.target.value)} type="number" step="any" min="-90" max="90" placeholder="e.g. 31.5204" className={`${INP} pl-8 ${errors.lat ? '!border-brand-red' : ''}`} />
              </div>
              {errors.lat && <span className="text-[10px] text-brand-red">Enter valid latitude (−90 to 90)</span>}
            </div>
            <div>
              <label className={LBL}>Longitude</label>
              <div className="relative">
                <Icon name="arrow-forward-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '13px' }} />
                <input value={f.lng} onChange={(e) => set('lng', e.target.value)} type="number" step="any" min="-180" max="180" placeholder="e.g. 74.3587" className={`${INP} pl-8 ${errors.lng ? '!border-brand-red' : ''}`} />
              </div>
              {errors.lng && <span className="text-[10px] text-brand-red">Enter valid longitude (−180 to 180)</span>}
            </div>
          </div>

          {hasCoords && (
            <div className="mt-3 h-28 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-border flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-gray-400">
                <Icon name="map-outline" style={{ fontSize: '28px' }} />
                <p className="text-[11px] mt-1">Map preview</p>
              </div>
              <div className="absolute flex flex-col items-center" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-100%)' }}>
                <Icon name="location" className="text-brand-red" style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              </div>
              <div className="absolute bottom-2 left-3 text-[10px] font-mono font-semibold text-gray-600 bg-white/80 px-2 py-0.5 rounded-md">
                {(+f.lat).toFixed(4)}, {(+f.lng).toFixed(4)}
              </div>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LBL}>Support Phone No</label>
            <input value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="042-XXXX-XXXX" className={INP} />
          </div>
          <div>
            <label className={LBL}>Support Email</label>
            <input value={f.email} onChange={(e) => set('email', e.target.value)} type="email" placeholder="store@alfatah.pk" className={INP} />
          </div>
        </div>

        {/* Operating hours */}
        <div>
          <label className={LBL}>Operating Hours</label>
          <div className="space-y-2">
            {WEEK_DAYS.map((d, i) => (
              <div key={d} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-gray-600 w-20 shrink-0">{d}</span>
                <input type="time" defaultValue={i < 6 ? '09:00' : '10:00'} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] focus:outline-none focus:border-navy" />
                <span className="text-[11px] text-gray-400">–</span>
                <input type="time" defaultValue={i < 6 ? '22:00' : '21:00'} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] focus:outline-none focus:border-navy" />
                <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-brand-green transition after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition peer-checked:after:translate-x-4"></div>
                  </div>
                  <span className="text-[10px] text-gray-500">Open</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex gap-3 sticky bottom-0 bg-white">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={save} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light">
          Save Store
        </button>
      </div>
    </>
  )
}

export default function StoreFormSlideover({ item, onClose, onSave }) {
  // Re-mount the form on each open so its internal state resets.
  const keyRef = useRef(0)
  useEffect(() => {
    if (item) keyRef.current += 1
  }, [item])

  return (
    <Slideover
      item={item}
      onClose={onClose}
      width={560}
      render={(it) => <StoreForm key={keyRef.current} store={it.store} onCancel={onClose} onSave={onSave} />}
    />
  )
}
