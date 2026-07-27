import { useRef, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import {
  INITIAL_PROFILE,
  INDUSTRY_OPTIONS,
  ORG_TYPE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  SOCIAL_FIELDS,
} from '../data/companyProfile'

const FIELD = 'w-full bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-navy placeholder-gray-300'

function SectionHeader({ icon, iconCls, title, desc }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconCls}`}>
        <Icon name={icon} style={{ fontSize: '16px' }} />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-navy-dark">{title}</p>
        {desc && <p className="text-[10px] text-gray-400">{desc}</p>}
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, required, mono, type = 'text', placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] text-gray-500 font-semibold mb-1.5">
        {label}
        {required && <span className="text-brand-red ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${FIELD} px-4 h-[42px] ${mono ? 'font-mono' : ''}`}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] text-gray-500 font-semibold mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD} px-4 h-[42px] cursor-pointer`}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

function TextAreaField({ label, value, onChange, rows = 4, maxLen = 400 }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] text-gray-500 font-semibold">{label}</label>
        <span className="text-[9px] text-gray-400">{value.length}/{maxLen}</span>
      </div>
      <textarea
        rows={rows}
        maxLength={maxLen}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} px-4 py-3 resize-none`}
      />
    </div>
  )
}

// ── Edit mode ──
function EditView({ draft, setField, onImage, removeImage }) {
  return (
    <div className="grid grid-cols-3 gap-6 items-start max-md:grid-cols-1">
      {/* Col 1: Visuals + Legal */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div
            className="relative h-32"
            style={
              draft.bannerUrl
                ? { backgroundImage: `url('${draft.bannerUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: 'linear-gradient(135deg,#1a2d6b,#2dd36f)' }
            }
          >
            <div className="absolute top-2.5 right-2.5 flex gap-1.5">
              <label className="w-8 h-8 rounded-lg flex items-center justify-center text-white cursor-pointer" style={{ background: 'rgba(0,0,0,0.35)' }} title="Change banner">
                <Icon name="camera-outline" style={{ fontSize: '15px' }} />
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onImage(e, 'bannerUrl')} />
              </label>
              {draft.bannerUrl && (
                <button onClick={() => removeImage('bannerUrl')} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'rgba(0,0,0,0.35)' }} title="Remove banner">
                  <Icon name="trash-outline" style={{ fontSize: '14px' }} />
                </button>
              )}
            </div>
            {/* Logo */}
            <div className="absolute left-4 -bottom-7">
              <div className={`relative w-14 h-14 rounded-2xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center ${draft.logoUrl ? '' : 'bg-brand-green'}`}>
                {draft.logoUrl ? (
                  <img src={draft.logoUrl} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-[18px]">{(draft.displayName || 'C').charAt(0)}</span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-navy border-2 border-white flex items-center justify-center cursor-pointer" title="Change logo">
                <Icon name="camera-outline" style={{ fontSize: '10px', color: 'white' }} />
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onImage(e, 'logoUrl')} />
              </label>
            </div>
          </div>
          <div className="pt-9 px-4 pb-4">
            <p className="text-[10px] text-gray-400">JPEG / PNG / WebP up to 5 MB. Displayed on your marketplace storefront.</p>
            {draft.logoUrl && (
              <button onClick={() => removeImage('logoUrl')} className="mt-2 text-[10.5px] font-semibold text-brand-red bg-brand-red/5 px-2.5 py-1 rounded-lg">
                Remove Logo
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <SectionHeader icon="document-text-outline" iconCls="bg-brand-purple/10 text-brand-purple" title="Legal & Registration" />
          <TextField label="Registration Number" value={draft.regNumber} onChange={(v) => setField('regNumber', v)} />
          <TextField label="NTN" value={draft.ntn} onChange={(v) => setField('ntn', v)} mono />
          <TextField label="Head Office Address" value={draft.headOffice} onChange={(v) => setField('headOffice', v)} />
        </div>
      </div>

      {/* Col 2: Business Identity */}
      <div className="bg-white rounded-2xl border border-border p-5 h-full">
        <SectionHeader icon="business-outline" iconCls="bg-brand-blue/10 text-brand-blue" title="Business Identity" desc="Public details shown on the marketplace" />
        <TextField label="Legal Name" value={draft.legalName} onChange={(v) => setField('legalName', v)} />
        <TextField label="Display Name" value={draft.displayName} onChange={(v) => setField('displayName', v)} required />
        <TextField label="Tagline" value={draft.tagline} onChange={(v) => setField('tagline', v)} placeholder="A short line customers see on your storefront" />
        <SelectField label="Industry" value={draft.industry} onChange={(v) => setField('industry', v)} options={INDUSTRY_OPTIONS} />
        <SelectField label="Organization Type" value={draft.orgType} onChange={(v) => setField('orgType', v)} options={ORG_TYPE_OPTIONS} />
        <SelectField label="Company Size" value={draft.companySize} onChange={(v) => setField('companySize', v)} options={COMPANY_SIZE_OPTIONS} />
        <TextAreaField label="Description" value={draft.description} onChange={(v) => setField('description', v)} rows={4} maxLen={400} />
      </div>

      {/* Col 3: Contact + Social */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-border p-5">
          <SectionHeader icon="call-outline" iconCls="bg-brand-green/10 text-brand-green" title="Support Contact" />
          <TextField label="Support Email" value={draft.supportEmail} onChange={(v) => setField('supportEmail', v)} type="email" required />
          <TextField label="Support Phone" value={draft.supportPhone} onChange={(v) => setField('supportPhone', v)} type="tel" />
          <TextField label="Website" value={draft.website} onChange={(v) => setField('website', v)} type="url" placeholder="https://" />
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <SectionHeader icon="share-social-outline" iconCls="bg-brand-orange/10 text-brand-orange" title="Social Media Links" />
          <div className="space-y-3">
            {SOCIAL_FIELDS.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.color + '18' }}>
                  <Icon name={s.icon} style={{ fontSize: '15px', color: s.color }} />
                </div>
                <input
                  type="url"
                  value={draft[s.key]}
                  onChange={(e) => setField(s.key, e.target.value)}
                  placeholder={s.ph}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 h-[38px] text-[12px] focus:outline-none focus:border-navy placeholder-gray-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Preview mode ──
function PreviewView({ draft }) {
  const socials = SOCIAL_FIELDS.filter((s) => draft[s.key])
  const contactRows = [
    { icon: 'mail-outline', value: draft.supportEmail },
    { icon: 'call-outline', value: draft.supportPhone },
    { icon: 'globe-outline', value: draft.website ? draft.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '' },
    { icon: 'location-outline', value: draft.headOffice },
  ].filter((r) => r.value)

  return (
    <>
      <p className="text-[11px] text-gray-400 text-center mb-6 flex items-center justify-center gap-1.5">
        <Icon name="eye-outline" />
        How customers see your storefront on the marketplace
      </p>

      <div className="max-w-[400px] mx-auto bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
        <div
          className="h-[100px] relative"
          style={
            draft.bannerUrl
              ? { backgroundImage: `url('${draft.bannerUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: 'linear-gradient(135deg,#2dd36f 0%,#0a4a3a 100%)' }
          }
        ></div>

        <div className="relative px-5 pb-0">
          <div className={`absolute -top-7 left-5 w-14 h-14 rounded-xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center ${draft.logoUrl ? '' : 'bg-brand-green'}`}>
            {draft.logoUrl ? (
              <img src={draft.logoUrl} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-[18px]">{(draft.displayName || 'C').charAt(0)}</span>
            )}
          </div>
        </div>

        <div className="px-5 pt-9 pb-5">
          <p className="text-[17px] font-extrabold text-navy-dark leading-tight">{draft.displayName || 'Your Business'}</p>
          {draft.tagline && <p className="text-[12px] text-gray-400 mt-0.5">{draft.tagline}</p>}
          {draft.industry && (
            <div className="mt-2">
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{draft.industry}</span>
            </div>
          )}
          {draft.description && <p className="text-[12px] text-gray-600 leading-relaxed mt-3">{draft.description}</p>}

          {socials.length > 0 && (
            <div className="flex items-center gap-2.5 mt-4">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={draft[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-75"
                  style={{ background: s.color + '20' }}
                >
                  <Icon name={s.icon} style={{ fontSize: '16px', color: s.color }} />
                </a>
              ))}
            </div>
          )}

          <div className="border-t border-border mt-4 pt-4">
            <p className="text-[11px] font-semibold text-navy-dark mb-2.5">Contact</p>
            <div className="space-y-2">
              {contactRows.map((r) => (
                <div key={r.icon} className="flex items-center gap-2.5">
                  <Icon name={r.icon} className="text-gray-400 shrink-0" style={{ fontSize: '14px' }} />
                  <span className="text-[12px] text-gray-600 truncate">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CompanyProfile() {
  const showToast = useToast()
  const [mode, setMode] = useState('edit')
  const [draft, setDraft] = useState(() => ({ ...INITIAL_PROFILE }))
  const publishedRef = useRef(JSON.stringify(INITIAL_PROFILE))
  const [dismissed, setDismissed] = useState(false)

  const dirty = JSON.stringify(draft) !== publishedRef.current
  const showBanner = dirty && !dismissed

  const setField = (key, val) => {
    setDismissed(false)
    setDraft((d) => ({ ...d, [key]: val }))
  }

  const onImage = (e, field) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setField(field, reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = (field) => setField(field, '')

  const saveDraft = () => showToast('Draft saved — not yet visible to customers', 'info')

  const publish = () => {
    if (!draft.displayName.trim()) {
      showToast('Display name cannot be empty', 'error')
      return
    }
    if (!draft.supportEmail.includes('@')) {
      showToast('Enter a valid support email', 'error')
      return
    }
    publishedRef.current = JSON.stringify(draft)
    setDismissed(false)
    // Force re-render so `dirty` recomputes against the new published snapshot.
    setDraft((d) => ({ ...d }))
    showToast('Company profile published — live on the marketplace!', 'success')
  }

  const toggleBtn = (m, label) => (
    <button
      onClick={() => setMode(m)}
      className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition ${mode === m ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy-dark'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Draft banner */}
      {showBanner && (
        <div className="flex items-center gap-3 bg-brand-orange/10 border border-brand-orange/30 rounded-xl px-4 py-3 mb-5">
          <Icon name="alert-circle-outline" className="text-brand-orange text-lg shrink-0" />
          <p className="text-[12px] font-semibold text-brand-orange flex-1">
            You have unpublished changes — customers still see the last published profile.
          </p>
          <button onClick={() => setDismissed(true)} className="text-brand-orange/60 hover:text-brand-orange">
            <Icon name="close-outline" style={{ fontSize: '16px' }} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[18px] font-extrabold text-navy-dark">Company Profile</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {mode === 'preview' ? 'How customers see you on the marketplace' : 'Changes save as draft until published'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-xl p-1">
          {toggleBtn('edit', 'Edit')}
          {toggleBtn('preview', 'Preview')}
        </div>
      </div>

      {/* Body */}
      {mode === 'edit' ? (
        <EditView draft={draft} setField={setField} onImage={onImage} removeImage={removeImage} />
      ) : (
        <PreviewView draft={draft} />
      )}

      {/* Footer (edit only) */}
      {mode === 'edit' && (
        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border">
          <button onClick={saveDraft} className="px-6 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">
            Save as Draft
          </button>
          <button onClick={publish} className="px-6 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">
            Publish
          </button>
        </div>
      )}
    </div>
  )
}
