import { useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'

const INPUT = 'w-full text-[12px] text-navy-dark bg-page border border-border rounded-xl px-3 py-2.5'

function SettingsCard({ icon, iconCls, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconCls}`}>
          <Icon name={icon} style={{ fontSize: '18px' }} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-navy-dark">{title}</p>
          <p className="text-[11px] text-gray-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-[40px] h-[22px] rounded-full transition-colors shrink-0 ml-3 ${checked ? 'bg-brand-green' : 'bg-gray-300'}`}
    >
      <span
        className="absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
      ></span>
    </button>
  )
}

function SaveButton({ label, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-10 text-[12px] font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition flex items-center justify-center gap-1.5 ${className}`}
    >
      <Icon name="checkmark-outline" style={{ fontSize: '15px' }} />
      {label}
    </button>
  )
}

function LoyaltyCard() {
  const showToast = useToast()
  const [enabled, setEnabled] = useState(true)
  const [earn, setEarn] = useState('100')
  const [redeem, setRedeem] = useState('1')

  const save = () => {
    if (!earn || !redeem || Number(earn) <= 0 || Number(redeem) <= 0) {
      showToast('Loyalty rates must be positive numbers.', 'error')
      return
    }
    showToast('Loyalty program settings saved.', 'success')
  }

  return (
    <SettingsCard
      icon="gift-outline"
      iconCls="bg-brand-purple/10 text-brand-purple"
      title="Loyalty Program"
      subtitle="Platform-wide coin earn & redeem rates"
    >
      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center justify-between bg-page rounded-xl border border-border px-4 py-3">
          <div>
            <p className="text-[12px] font-semibold text-navy-dark">Loyalty Program Enabled</p>
            <p className="text-[10.5px] text-gray-400">Applies to POS and ecommerce checkout across all businesses.</p>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Earn Rate</label>
            <div className="flex items-center gap-2 bg-page border border-border rounded-xl px-3 py-2.5">
              <span className="text-[11px] text-gray-400 shrink-0">Rs.</span>
              <input
                type="number"
                min="1"
                value={earn}
                onChange={(e) => setEarn(e.target.value)}
                className="w-full text-[13px] text-navy-dark bg-transparent border-none outline-none"
              />
              <span className="text-[11px] text-gray-400 shrink-0 whitespace-nowrap">spent = 1 coin</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Redeem Rate</label>
            <div className="flex items-center gap-2 bg-page border border-border rounded-xl px-3 py-2.5">
              <span className="text-[11px] text-gray-400 shrink-0">1 coin =</span>
              <span className="text-[11px] text-gray-400 shrink-0">Rs.</span>
              <input
                type="number"
                min="1"
                value={redeem}
                onChange={(e) => setRedeem(e.target.value)}
                className="w-full text-[13px] text-navy-dark bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3">
          <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Rate changes apply platform-wide immediately — this is a global rule, not per-business. Existing coin
            balances are never recalculated.
          </p>
        </div>

        <SaveButton label="Save Loyalty Settings" onClick={save} />
      </div>
    </SettingsCard>
  )
}

function BillingCard() {
  const showToast = useToast()
  const [reminders, setReminders] = useState(['7', '3', '1'])
  const [bank, setBank] = useState({
    name: 'Habib Bank Limited (HBL)',
    title: 'RetailOS Technologies Pvt. Ltd.',
    account: '0123-4567890-001',
    iban: 'PK36HABB0000123456789001',
  })

  const setReminder = (i, v) => setReminders((r) => r.map((x, idx) => (idx === i ? v : x)))
  const setBankField = (k, v) => setBank((b) => ({ ...b, [k]: v }))

  const save = () => {
    if (!bank.name.trim() || !bank.account.trim()) {
      showToast('Bank name and account number are required.', 'error')
      return
    }
    showToast('Billing settings saved.', 'success')
  }

  return (
    <SettingsCard
      icon="card-outline"
      iconCls="bg-brand-orange/10 text-brand-orange"
      title="Subscription & Billing"
      subtitle="Renewal reminders & manual payment details"
    >
      <div className="px-5 py-5 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Renewal Reminder Schedule</label>
          <p className="text-[10.5px] text-gray-400 mb-2">Days before expiry to email + banner-alert the business owner.</p>
          <div className="flex items-center gap-2">
            {reminders.map((val, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-[11px] text-gray-400">/</span>}
                <input
                  type="number"
                  min="1"
                  value={val}
                  onChange={(e) => setReminder(i, e.target.value)}
                  className="w-16 text-center text-[13px] text-navy-dark bg-page border border-border rounded-xl px-2 py-2"
                />
              </span>
            ))}
            <span className="text-[11px] text-gray-400 whitespace-nowrap">days before expiry</span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Bank Account for Manual Payments</label>
          <p className="text-[10.5px] text-gray-400 mb-2">Shown to business owners when submitting a payment reference.</p>
          <div className="grid grid-cols-2 gap-2.5">
            <input value={bank.name} onChange={(e) => setBankField('name', e.target.value)} placeholder="Bank name" className={INPUT} />
            <input value={bank.title} onChange={(e) => setBankField('title', e.target.value)} placeholder="Account title" className={INPUT} />
            <input value={bank.account} onChange={(e) => setBankField('account', e.target.value)} placeholder="Account number" className={`${INPUT} font-mono`} />
            <input value={bank.iban} onChange={(e) => setBankField('iban', e.target.value)} placeholder="IBAN" className={`${INPUT} font-mono`} />
          </div>
        </div>

        <SaveButton label="Save Billing Settings" onClick={save} />
      </div>
    </SettingsCard>
  )
}

function SupportCard() {
  const showToast = useToast()
  const [email, setEmail] = useState('support@retailos.io')
  const [phone, setPhone] = useState('+92-42-111-000-111')
  const [url, setUrl] = useState('https://help.retailos.io')

  const save = () => {
    if (!email || !email.includes('@')) {
      showToast('A valid support email is required.', 'error')
      return
    }
    showToast('Support contact settings saved.', 'success')
  }

  return (
    <SettingsCard
      icon="headset-outline"
      iconCls="bg-brand-green/10 text-brand-green"
      title="Support Contact"
      subtitle="Shown to businesses on suspension & help screens"
    >
      <div className="px-5 py-5 space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Support Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Support Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Help Center URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className={INPUT} />
        </div>

        <SaveButton label="Save Support Settings" onClick={save} className="mt-2" />
      </div>
    </SettingsCard>
  )
}

export default function PlatformSettings() {
  return (
    <div className="adm-content p-8 max-md:p-4">
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <LoyaltyCard />
        <BillingCard />
        <SupportCard />
      </div>
    </div>
  )
}
