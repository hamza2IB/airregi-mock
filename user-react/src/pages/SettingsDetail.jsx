import { useState } from 'react'
import Icon from '../components/Icon'
import ProductCard, { EmptyState } from '../components/ProductCard'
import { PID } from '../data/catalog'
import { PM_TYPES, BANKS } from '../data/payMeta'
import { useApp } from '../store'

const TITLES = {
  profile: ['Personal information', 'Your account details'],
  addresses: ['Delivery addresses', 'Where we ship your orders'],
  'address-form': ['Address', ''],
  payments: ['Payment methods', 'Saved wallets & accounts'],
  'payment-form': ['Add payment method', ''],
  wishlist: ['Wishlist', 'Products you saved'],
  myissues: ['My requests', 'Problems, returns & cancellations you raised'],
  help: ['Help center', 'Answers to common questions'],
  contact: ['Contact us', "We're here to help"],
  terms: ['Terms & privacy', 'Policies & legal'],
}

const MYISSUE_TYPE = {
  report: { label: 'Problem report', icon: 'alert-circle-outline', color: '#ff9800' },
  return: { label: 'Return / Refund', icon: 'arrow-undo-outline', color: '#7c4dff' },
  cancellation: { label: 'Cancellation', icon: 'close-circle-outline', color: '#eb445a' },
}
const MYISSUE_STATUS = {
  open: { label: 'Submitted', cls: 'bg-brand-orange/10 text-brand-orange' },
  in_progress: { label: 'In review', cls: 'bg-brand-blue/10 text-brand-blue' },
  resolved: { label: 'Resolved', cls: 'bg-brand-green/10 text-brand-green' },
}

export default function SettingsDetail() {
  const app = useApp()
  const { route, back, user } = app
  const [view, setView] = useState(route.settingsKey)
  const [editId, setEditId] = useState(null)
  const title = TITLES[view] || ['Settings', '']

  const goBack = () => {
    if (view === 'address-form') return setView('addresses')
    if (view === 'payment-form') return setView('payments')
    back()
  }

  return (
    <div className="screen">
      <div className="sticky top-0 z-40 bg-white border-b border-border px-4 pt-11 pb-3 flex items-center gap-3">
        <button onClick={goBack} className="w-9 h-9 rounded-xl bg-page border border-border flex items-center justify-center press shrink-0"><Icon name="chevron-back-outline" className="text-navy" style={{ fontSize: '17px' }} /></button>
        <div className="flex-1 min-w-0"><h1 className="text-[16px] font-extrabold text-navy-dark leading-tight truncate">{title[0]}</h1>{title[1] && <p className="text-[10.5px] text-gray-400 leading-tight truncate">{title[1]}</p>}</div>
      </div>
      <div className="p-4">
        {view === 'profile' && <Profile app={app} onDone={back} />}
        {view === 'addresses' && <Addresses app={app} onAdd={() => { setEditId(null); setView('address-form') }} onEdit={(id) => { setEditId(id); setView('address-form') }} />}
        {view === 'address-form' && <AddressForm app={app} editId={editId} onDone={() => setView('addresses')} />}
        {view === 'payments' && <Payments app={app} onAdd={() => setView('payment-form')} />}
        {view === 'payment-form' && <PaymentForm app={app} onDone={() => setView('payments')} />}
        {view === 'wishlist' && <Wishlist app={app} />}
        {view === 'myissues' && <MyIssues app={app} />}
        {view === 'help' && <Help />}
        {view === 'contact' && <Contact app={app} />}
        {view === 'terms' && <Terms />}
      </div>
    </div>
  )
}

/* ── Personal information ── */
function Profile({ app, onDone }) {
  const { user, setUser, showToast } = app
  const [f, setF] = useState({ ...user })
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const save = () => { setUser(f); showToast('Profile updated'); onDone() }
  return (
    <>
      <div className="flex flex-col items-center mb-5">
        <div className="w-20 h-20 rounded-full bg-navy text-white flex items-center justify-center font-extrabold text-[24px]">{initials(f.name || 'U')}</div>
        <button onClick={() => showToast('Photo upload — coming soon')} className="mt-2 text-[12px] font-semibold text-brand-blue press">Change photo</button>
      </div>
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3.5">
        <div><label className="slbl">Full name</label><input className="sinp" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><label className="slbl">Email</label><input type="email" className="sinp" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div><label className="slbl">Phone</label><input className="sinp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="slbl">Gender</label>
            <select className="sinp" value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}>{['Female', 'Male', 'Prefer not to say'].map((g) => <option key={g}>{g}</option>)}</select>
          </div>
          <div><label className="slbl">Date of birth</label><input type="date" className="sinp" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} /></div>
        </div>
      </div>
      <button onClick={save} className="press w-full mt-4 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2"><Icon name="checkmark-outline" style={{ fontSize: '17px' }} />Save changes</button>
    </>
  )
}

/* ── Addresses ── */
function Addresses({ app, onAdd, onEdit }) {
  const { addresses, setDefaultAddress, deleteAddress } = app
  return (
    <>
      <div className="space-y-3">
        {addresses.length ? addresses.map((a) => (
          <div key={a.id} className={`bg-white rounded-2xl border p-4 ${a.def ? 'border-navy' : 'border-border'}`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-page flex items-center justify-center shrink-0"><Icon name={a.label === 'Office' ? 'business-outline' : 'home-outline'} className="text-navy" style={{ fontSize: '18px' }} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="text-[13px] font-bold text-navy-dark">{a.label}</p>{a.def && <span className="text-[9px] font-bold bg-navy text-white px-2 py-0.5 rounded-full">Default</span>}</div>
                <p className="text-[12px] text-gray-600 mt-0.5 leading-snug">{a.line}, {a.city}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{a.name} · {a.phone}</p>
                <div className="flex items-center gap-3 mt-2.5">
                  {!a.def && <button onClick={() => setDefaultAddress(a.id)} className="text-[11.5px] font-semibold text-brand-blue press">Set default</button>}
                  <button onClick={() => onEdit(a.id)} className="text-[11.5px] font-semibold text-gray-500 press">Edit</button>
                  <button onClick={() => deleteAddress(a.id)} className="text-[11.5px] font-semibold text-brand-red press">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )) : <EmptyState msg="No addresses yet" />}
      </div>
      <button onClick={onAdd} className="press w-full mt-4 h-12 border-2 border-dashed border-border rounded-xl text-[13px] font-bold text-navy flex items-center justify-center gap-2"><Icon name="add-outline" style={{ fontSize: '18px' }} />Add new address</button>
    </>
  )
}

function AddressForm({ app, editId, onDone }) {
  const { addresses, saveAddress, user, showToast } = app
  const existing = addresses.find((a) => a.id === editId)
  const [f, setF] = useState(existing || { label: 'Home', name: user.name, phone: user.phone, line: '', city: 'Lahore' })
  const save = () => {
    if (!f.line.trim()) return showToast('Please enter an address')
    saveAddress({ label: f.label, name: f.name.trim() || user.name, phone: f.phone.trim() || user.phone, line: f.line.trim(), city: f.city.trim() || 'Lahore' }, editId)
    showToast(editId ? 'Address saved' : 'Address added')
    onDone()
  }
  return (
    <>
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3.5">
        <div><label className="slbl">Label</label>
          <div className="flex gap-2">{['Home', 'Office', 'Other'].map((l) => <button key={l} onClick={() => setF({ ...f, label: l })} className={`press flex-1 py-2 rounded-lg text-[12px] font-semibold border ${f.label === l ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-border'}`}>{l}</button>)}</div>
        </div>
        <div><label className="slbl">Full name</label><input className="sinp" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><label className="slbl">Phone</label><input className="sinp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        <div><label className="slbl">Address</label><textarea rows="2" className="sinp resize-none" placeholder="House / street / area" value={f.line} onChange={(e) => setF({ ...f, line: e.target.value })} /></div>
        <div><label className="slbl">City</label><input className="sinp" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
      </div>
      <button onClick={save} className="press w-full mt-4 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2"><Icon name="checkmark-outline" style={{ fontSize: '17px' }} />{editId ? 'Save address' : 'Add address'}</button>
    </>
  )
}

/* ── Payments ── */
function Payments({ app, onAdd }) {
  const { payments, removePayment } = app
  return (
    <>
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-3">
        <Icon name="shield-checkmark-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">Used to pay for online orders. Cash on Delivery is always available at checkout.</p>
      </div>
      <div className="space-y-2.5">
        {payments.length ? payments.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-border p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${m.color}18` }}><Icon name={m.icon} style={{ fontSize: '20px', color: m.color }} /></div>
            <div className="flex-1 min-w-0"><p className="text-[13px] font-bold text-navy-dark">{m.type}</p><p className="text-[11px] text-gray-400">{m.detail}</p></div>
            <button onClick={() => removePayment(m.id)} className="text-gray-300 hover:text-brand-red press"><Icon name="trash-outline" style={{ fontSize: '16px' }} /></button>
          </div>
        )) : <EmptyState msg="No saved methods" />}
      </div>
      <button onClick={onAdd} className="press w-full mt-4 h-12 border-2 border-dashed border-border rounded-xl text-[13px] font-bold text-navy flex items-center justify-center gap-2"><Icon name="add-outline" style={{ fontSize: '18px' }} />Add payment method</button>
    </>
  )
}

function PaymentForm({ app, onDone }) {
  const { addPayment, user, showToast } = app
  const [type, setType] = useState('JazzCash')
  const [f, setF] = useState({ mobile: '', acct: '', bank: BANKS[0] })
  const cfg = PM_TYPES[type]
  const save = () => {
    let detail
    if (cfg.field === 'mobile') {
      const m = f.mobile.replace(/\D/g, '')
      if (m.length < 11) return showToast('Enter a valid 11-digit mobile number')
      detail = 'Wallet · ' + m.slice(0, 4) + '•••' + m.slice(-4)
    } else {
      const acct = f.acct.replace(/\s/g, '')
      if (acct.replace(/\D/g, '').length < 4) return showToast('Enter a valid account number')
      detail = f.bank + ' ••••' + acct.slice(-4)
    }
    addPayment({ type, detail, icon: cfg.icon, color: cfg.color })
    showToast(type + ' added')
    onDone()
  }
  return (
    <>
      <div className="mb-3"><label className="slbl">Payment type</label>
        <div className="flex gap-2">{Object.keys(PM_TYPES).map((t) => (
          <button key={t} onClick={() => setType(t)} className={`press flex-1 rounded-xl border p-2.5 flex flex-col items-center gap-1.5 ${type === t ? 'border-navy bg-navy/5' : 'border-border bg-white'}`}>
            <Icon name={PM_TYPES[t].icon} style={{ fontSize: '20px', color: PM_TYPES[t].color }} /><span className={`text-[10.5px] font-semibold ${type === t ? 'text-navy-dark' : 'text-gray-500'}`}>{t}</span>
          </button>
        ))}</div>
      </div>
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3.5">
        {cfg.field === 'mobile' ? (
          <>
            <div><label className="slbl">Mobile number</label><input className="sinp" inputMode="numeric" placeholder="03XX XXXXXXX" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} /></div>
            <div><label className="slbl">Account title <span className="text-gray-300 font-normal">(optional)</span></label><input className="sinp" defaultValue={user.name} /></div>
          </>
        ) : (
          <>
            <div><label className="slbl">Bank</label><select className="sinp" value={f.bank} onChange={(e) => setF({ ...f, bank: e.target.value })}>{BANKS.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div><label className="slbl">Account number / IBAN</label><input className="sinp" inputMode="numeric" placeholder="PK00 XXXX XXXX XXXX" value={f.acct} onChange={(e) => setF({ ...f, acct: e.target.value })} /></div>
          </>
        )}
      </div>
      <div className="flex items-start gap-2 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mt-3">
        <Icon name="lock-closed-outline" style={{ fontSize: '13px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">Your details are stored securely and only used to pay for online orders.</p>
      </div>
      <button onClick={save} className="press w-full mt-4 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2"><Icon name="checkmark-outline" style={{ fontSize: '17px' }} />Add method</button>
    </>
  )
}

/* ── Wishlist ── */
function Wishlist({ app }) {
  const { wishlist } = app
  const items = wishlist.map((pid) => PID[pid]).filter(Boolean)
  if (!items.length) return <EmptyState msg="Your wishlist is empty — tap the heart on any product" />
  return <div className="grid grid-cols-2 gap-3">{items.map(({ p, b }) => <ProductCard key={p.pid} p={p} b={b} />)}</div>
}

/* ── My requests ── */
function MyIssues({ app }) {
  const { myissues } = app
  if (!myissues.length) return <EmptyState msg="You haven’t raised any requests yet" />
  return (
    <div className="space-y-2.5">
      {myissues.map((r) => {
        const t = MYISSUE_TYPE[r.type], s = MYISSUE_STATUS[r.status]
        return (
          <div key={r.id} className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: t.color }}><Icon name={t.icon} style={{ fontSize: '14px' }} />{t.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
            </div>
            <p className="text-[13px] font-bold text-navy-dark">{r.reason}</p>
            {r.note && <p className="text-[12px] text-gray-500 leading-relaxed mt-1">{r.note}</p>}
            <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border">
              <span className="text-[10.5px] font-semibold text-gray-500 truncate">{r.biz}</span>
              <span className="text-[10.5px] text-gray-300">·</span>
              <span className="text-[10.5px] font-mono text-gray-400">{r.orderId}</span>
              <span className="text-[10.5px] text-gray-300 ml-auto">{r.date}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Help center ── */
const FAQS = [
  ['How do I track my order?', 'Open the Orders tab to see live status for every order, from confirmed through to delivered.'],
  ['What payment methods can I use?', 'You can pay online via JazzCash, EasyPaisa or bank transfer, or choose Cash on Delivery at checkout.'],
  ['How do returns work?', 'Contact the store from your order within 3 days of delivery to request a return or refund.'],
  ['When is delivery free?', 'Delivery is free on orders over Rs.5,000. Otherwise a flat Rs.199 fee applies.'],
  ['How do I change my delivery address?', 'Go to Settings → Delivery addresses to add, edit, or set a default address.'],
]
function Help() {
  const [open, setOpen] = useState(-1)
  return (
    <div className="space-y-2.5">
      {FAQS.map((f, i) => (
        <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="press w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <span className="flex-1 text-[12.5px] font-semibold text-navy-dark">{f[0]}</span>
            <Icon name={open === i ? 'chevron-up' : 'chevron-down'} className="text-gray-400 shrink-0" style={{ fontSize: '15px' }} />
          </button>
          {open === i && <p className="px-4 pb-3.5 -mt-1 text-[12px] text-gray-500 leading-relaxed">{f[1]}</p>}
        </div>
      ))}
    </div>
  )
}

/* ── Contact ── */
function Contact({ app }) {
  const { showToast } = app
  const rows = [['call-outline', 'Call us', '+92 42 111 000 111'], ['mail-outline', 'Email', 'support@retailos.io'], ['logo-whatsapp', 'WhatsApp', '+92 300 1110000']]
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      {rows.map((r, i) => (
        <button key={r[1]} onClick={() => showToast(`${r[1]} — ${r[2]}`)} className={`press w-full flex items-center gap-3 px-4 py-3.5 text-left ${i ? 'border-t border-border' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-page flex items-center justify-center shrink-0"><Icon name={r[0]} className="text-navy" style={{ fontSize: '18px' }} /></div>
          <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-navy-dark">{r[1]}</p><p className="text-[11px] text-gray-400">{r[2]}</p></div>
          <Icon name="chevron-forward" className="text-gray-300" style={{ fontSize: '15px' }} />
        </button>
      ))}
    </div>
  )
}

/* ── Terms ── */
function Terms() {
  const Sec = ({ t, b }) => <div className="bg-white rounded-2xl border border-border p-4"><p className="text-[13px] font-bold text-navy-dark mb-1.5">{t}</p><p className="text-[12px] text-gray-500 leading-relaxed">{b}</p></div>
  return (
    <>
      <div className="space-y-3">
        <Sec t="Terms of Service" b="By using RetailOS Shop you agree to purchase from independent stores listed on the platform. Each store is responsible for its own products, pricing and fulfilment." />
        <Sec t="Privacy Policy" b="We collect only the information needed to process your orders and improve your experience. Your data is never sold to third parties." />
        <Sec t="Refund Policy" b="Refunds for online orders are handled by the selling store and are typically processed within 5–7 business days of approval." />
      </div>
      <p className="text-center text-[10px] text-gray-300 mt-4">Last updated: Jul 2026</p>
    </>
  )
}
