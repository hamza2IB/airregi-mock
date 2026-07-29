import { useEffect, useState } from 'react'
import { useStore } from './store.jsx'
import { FAQ_ITEMS } from '../shared/catalog.js'

const TICKETS_KEY = 'airRegister.supportTickets.staff'
const loadTickets = () => { try { return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]') } catch { return [] } }
const saveTickets = (t) => { try { localStorage.setItem(TICKETS_KEY, JSON.stringify(t)) } catch { /* ignore */ } }

export default function HelpScreen() {
  const { staff, setScreen } = useStore()
  const [tab, setTab] = useState('faq')
  const [tickets, setTickets] = useState(loadTickets())
  const [toast, setToast] = useState('')

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }
  const createTicket = (type, category, subject, message) => {
    const id = 'TKT-' + Date.now().toString(36).toUpperCase().slice(-6)
    const t = { id, type, category, subject, message, status: 'open', createdAt: new Date().toISOString(), staff: staff ? staff.name : 'Staff', staffId: staff ? staff.id : null }
    const next = [t, ...tickets]
    setTickets(next); saveTickets(next); showToast(`Ticket ${id} created`); setTab('tickets')
  }

  const tabBtn = (id, icon, label) => {
    const active = tab === id
    return (
      <button onClick={() => setTab(id)} className={`tap-btn px-5 py-3.5 text-[15px] border-b-2 flex items-center gap-2 ${active ? 'font-semibold text-navy border-navy' : 'font-medium text-gray-500 border-transparent'}`}>
        <ion-icon name={icon} style={{ fontSize: '18px' }}></ion-icon> {label}
        {id === 'tickets' && tickets.length > 0 && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-navy text-white font-bold">{tickets.length}</span>}
      </button>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-navy text-white px-5 py-3.5 flex items-center justify-between shrink-0">
        <button onClick={() => setScreen('main')} className="tap-btn px-4 py-2.5 bg-white/10 rounded-lg text-[15px] hover:bg-white/20 flex items-center gap-2 min-h-[48px]">
          <ion-icon name="arrow-back-outline" style={{ fontSize: '22px' }}></ion-icon> Back
        </button>
        <div className="flex items-center gap-2">
          <ion-icon name="help-circle-outline" style={{ fontSize: '22px' }} class="text-white/60"></ion-icon>
          <span className="text-[16px] font-semibold">Help & Support</span>
        </div>
        <span className="w-[90px]" />
      </div>
      <div className="bg-white border-b border-gray-200 px-6 shrink-0">
        <div className="max-w-4xl mx-auto flex gap-1">
          {tabBtn('faq', 'help-circle-outline', 'FAQ')}
          {tabBtn('contact', 'chatbubble-ellipses-outline', 'Contact Us')}
          {tabBtn('report', 'warning-outline', 'Report a Problem')}
          {tabBtn('tickets', 'file-tray-full-outline', 'My Tickets')}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-page">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {tab === 'faq' && <Faq onContact={() => setTab('contact')} />}
          {tab === 'contact' && <ContactForm onSubmit={createTicket} onTickets={() => setTab('tickets')} />}
          {tab === 'report' && <ReportForm staff={staff} onSubmit={createTicket} />}
          {tab === 'tickets' && <Tickets tickets={tickets} onContact={() => setTab('contact')} onReport={() => setTab('report')} />}
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-navy text-white text-[14px] font-semibold px-6 py-3.5 rounded-xl shadow-2xl z-[95] flex items-center gap-2">
          <ion-icon name="checkmark-circle" style={{ fontSize: '20px' }} class="text-brand-green"></ion-icon> {toast}
        </div>
      )}
    </div>
  )
}

function Faq({ onContact }) {
  const [open, setOpen] = useState(null)
  return (
    <div>
      <h2 className="text-[20px] font-bold text-black mb-1">Frequently Asked Questions</h2>
      <p className="text-[14px] text-gray-500 mb-5">Answers to common register operations</p>
      <div className="space-y-3">
        {FAQ_ITEMS.map((f, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="tap-btn w-full flex items-center justify-between gap-3 px-5 py-4 text-left min-h-[56px]">
              <span className="text-[15px] font-semibold text-black">{f.q}</span>
              <ion-icon name={open === i ? 'chevron-up-outline' : 'chevron-down-outline'} class="text-gray-400 text-lg shrink-0"></ion-icon>
            </button>
            {open === i && <div className="px-5 pb-4 -mt-1"><p className="text-[14px] text-gray-600 leading-relaxed">{f.a}</p></div>}
          </div>
        ))}
      </div>
      <div className="mt-6 bg-navy/5 border border-navy/10 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-black">Still need help?</p>
          <p className="text-[13px] text-gray-500 mt-0.5">Send us a message and we'll get back to you in-app.</p>
        </div>
        <button onClick={onContact} className="tap-btn px-5 py-3 bg-navy text-white text-[14px] font-semibold rounded-xl flex items-center gap-2">
          <ion-icon name="chatbubble-ellipses-outline" style={{ fontSize: '18px' }}></ion-icon> Contact Us
        </button>
      </div>
    </div>
  )
}

function ContactForm({ onSubmit, onTickets }) {
  const [topic, setTopic] = useState('POS Operations')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const valid = subject.trim().length >= 3 && message.trim().length >= 10
  return (
    <div>
      <h2 className="text-[20px] font-bold text-black mb-1">Contact Us</h2>
      <p className="text-[14px] text-gray-500 mb-5">Send an inquiry to the support team. Replies appear in My Tickets.</p>
      <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-xl">
        <div className="mb-4">
          <label className="block text-[14px] text-gray-500 mb-2 font-medium">Topic</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 h-[52px] text-[15px] focus:outline-none focus:border-navy">
            {['POS Operations', 'Payments & Refunds', 'Loyalty & Coupons', 'Receipt / FBR', 'Account', 'Other'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-[14px] text-gray-500 mb-2 font-medium">Subject *</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100} placeholder="Brief summary (min 3 chars)"
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 h-[52px] text-[15px] focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20" />
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-2"><label className="text-[14px] text-gray-500 font-medium">Message *</label><span className="text-[12px] text-gray-400">{message.length}/1000</span></div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={1000} placeholder="Describe your question (min 10 chars)..."
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 resize-none" />
        </div>
        <button disabled={!valid} onClick={() => { onSubmit('inquiry', topic, subject.trim(), message.trim()); setSubject(''); setMessage('') }}
          className="tap-btn w-full h-[52px] bg-navy text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400">
          <ion-icon name="send-outline" style={{ fontSize: '18px' }}></ion-icon> Send Inquiry
        </button>
        <button onClick={onTickets} className="tap-btn w-full mt-3 h-[44px] text-[13px] font-medium text-gray-500 hover:text-navy flex items-center justify-center gap-1.5">
          <ion-icon name="file-tray-full-outline" style={{ fontSize: '16px' }}></ion-icon> View my support tickets
        </button>
      </div>
    </div>
  )
}

function ReportForm({ staff, onSubmit }) {
  const [category, setCategory] = useState(null)
  const [message, setMessage] = useState('')
  const cats = ['Payment issue', 'Printer / Receipt', 'Barcode scanner', 'Wrong price / product', 'App crash / freeze', 'Other']
  const valid = category && message.trim().length >= 10
  return (
    <div>
      <h2 className="text-[20px] font-bold text-black mb-1">Report a Problem</h2>
      <p className="text-[14px] text-gray-500 mb-5">Something not working? Let us know.</p>
      <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-xl">
        <p className="text-[14px] text-gray-500 mb-2 font-medium">Category *</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {cats.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`tap-btn px-4 py-3 text-[13px] border-2 rounded-xl text-left min-h-[48px] font-medium ${category === c ? 'border-navy bg-navy/5' : 'border-gray-200'}`}>{c}</button>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-2"><label className="text-[14px] text-gray-500 font-medium">Description *</label><span className="text-[12px] text-gray-400">{message.length}/1000</span></div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={1000} placeholder="What happened? What did you expect? (min 10 chars)"
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 resize-none" />
        </div>
        <div className="mb-4 bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-2">
          <ion-icon name="information-circle-outline" class="text-gray-400 text-lg shrink-0 mt-0.5"></ion-icon>
          <p className="text-[12px] text-gray-500 leading-relaxed">Diagnostics auto-attached: App v3.0 · Register 1 · Staff ID {staff ? staff.id : '—'}</p>
        </div>
        <button disabled={!valid} onClick={() => { onSubmit('report', category, category, message.trim()); setCategory(null); setMessage('') }}
          className="tap-btn w-full h-[52px] bg-brand-red text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400">
          <ion-icon name="send-outline" style={{ fontSize: '18px' }}></ion-icon> Submit Report
        </button>
      </div>
    </div>
  )
}

function Tickets({ tickets, onContact, onReport }) {
  const statusColors = { open: 'bg-green-50 text-brand-green', replied: 'bg-purple-50 text-brand-purple', closed: 'bg-gray-100 text-gray-500' }
  return (
    <div>
      <h2 className="text-[20px] font-bold text-black mb-1">My Support Tickets</h2>
      <p className="text-[14px] text-gray-500 mb-5">Inquiries and reports you've submitted</p>
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ion-icon name="file-tray-outline" class="text-6xl text-gray-300"></ion-icon>
          <p className="text-[16px] text-gray-500 mt-3 font-medium">No tickets yet</p>
          <p className="text-[13px] text-gray-400 mt-1 mb-5">Your inquiries and problem reports will appear here</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onContact} className="tap-btn px-5 py-2.5 text-[13px] font-semibold text-navy border border-navy/30 rounded-xl hover:bg-navy/5">Contact Us</button>
            <button onClick={onReport} className="tap-btn px-5 py-2.5 text-[13px] font-semibold text-brand-red border border-red-200 rounded-xl hover:bg-red-50">Report a Problem</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[13px] font-bold text-black font-mono">{t.id}</span>
                {t.type === 'report'
                  ? <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-brand-red font-semibold">Report</span>
                  : <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue font-semibold">Inquiry</span>}
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusColors[t.status] || statusColors.open} font-semibold`}>{(t.status || 'open').charAt(0).toUpperCase() + (t.status || 'open').slice(1)}</span>
                <span className="text-[12px] text-gray-400 ml-auto">{new Date(t.createdAt).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-[15px] font-semibold text-black">{t.subject}</p>
              <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{t.message}</p>
              <p className="text-[12px] text-gray-400 mt-2">{t.category} · by {t.staff || 'Staff'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
