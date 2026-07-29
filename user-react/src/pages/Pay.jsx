import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import StoreLogo from '../components/StoreLogo'
import { BUSINESSES, money } from '../data/catalog'
import { useApp } from '../store'

const bizById = (id) => BUSINESSES.find((b) => b.id === id)

export default function Pay() {
  const { payments, payTxns, addPayTxn, openSettings, showToast } = useApp()
  const [view, setView] = useState('idle') // idle | scanning | pay | done
  const [store, setStore] = useState(null)
  const [amount, setAmount] = useState(0)
  const [methodId, setMethodId] = useState(payments[0]?.id || null)
  const [txn, setTxn] = useState(null)

  // Simulate the camera detecting a register QR after a short delay.
  useEffect(() => {
    if (view !== 'scanning') return
    const t = setTimeout(() => {
      const b = BUSINESSES[Math.floor(Math.random() * BUSINESSES.length)]
      setStore(b)
      setAmount(Math.round((Math.random() * 4500 + 500) / 10) * 10)
      setMethodId((m) => m || payments[0]?.id || null)
      setView('pay')
    }, 1900)
    return () => clearTimeout(t)
  }, [view]) // eslint-disable-line

  const method = payments.find((m) => m.id === methodId)

  const pay = () => {
    if (!method) { showToast('Add a payment method first'); return }
    const t = {
      id: 'TXN-' + (Math.floor(Math.random() * 9000) + 1000),
      bizId: store.id,
      amount,
      method: method.type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
    addPayTxn(t)
    setTxn(t)
    setView('done')
  }

  const reset = () => { setView('idle'); setStore(null); setTxn(null) }

  /* ── Scanning overlay (simulated camera) ── */
  if (view === 'scanning') {
    return (
      <div className="absolute inset-0 z-[210] bg-navy-dark flex flex-col">
        <div className="flex items-center justify-between px-4 pt-11 pb-3">
          <button onClick={reset} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center press"><Icon name="close-outline" className="text-white" style={{ fontSize: '20px' }} /></button>
          <p className="text-white font-bold text-[14px]">Scan to pay</p>
          <div className="w-9" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="relative w-full max-w-[260px] aspect-square rounded-3xl bg-black/30 border border-white/10 overflow-hidden">
            {/* corner markers */}
            {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((c, i) => (
              <div key={i} className={`absolute w-8 h-8 border-brand-green rounded-sm ${c}`} style={{ animation: 'pulseCorner 1.6s ease-in-out infinite' }} />
            ))}
            <div className="scan-line" />
            <div className="absolute inset-0 flex items-center justify-center opacity-30"><Icon name="qr-code-outline" className="text-white" style={{ fontSize: '90px' }} /></div>
          </div>
          <p className="text-white/70 text-[13px] mt-6 font-medium">Point at the register QR…</p>
          <p className="text-white/40 text-[11px] mt-1">Detecting automatically</p>
        </div>
      </div>
    )
  }

  /* ── Payment confirmation ── */
  if (view === 'pay' && store) {
    return (
      <div className="screen">
        <div className="sticky top-0 z-40 bg-white border-b border-border px-4 pt-11 pb-3 flex items-center gap-3">
          <button onClick={reset} className="w-9 h-9 rounded-xl bg-page border border-border flex items-center justify-center press shrink-0"><Icon name="arrow-back-outline" className="text-navy" style={{ fontSize: '17px' }} /></button>
          <div className="flex-1 min-w-0"><h1 className="text-[16px] font-extrabold text-navy-dark leading-tight">Confirm payment</h1><p className="text-[10.5px] text-gray-400 leading-tight">Review & pay the register</p></div>
        </div>
        <div className="p-4">
          <div className="bg-white rounded-2xl border border-border p-5 flex flex-col items-center text-center mb-4">
            <StoreLogo b={store} size={52} />
            <p className="text-[14px] font-bold text-navy-dark mt-2.5">{store.name}</p>
            <p className="text-[11px] text-gray-400">Register · In-store payment</p>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mt-4">Amount due</p>
            <p className="text-[34px] font-extrabold text-navy-dark tnum leading-none mt-1">{money(amount)}</p>
          </div>

          <p className="text-[13px] font-bold text-navy-dark mb-2.5">Pay with</p>
          {payments.length ? (
            <div className="space-y-2.5">
              {payments.map((m) => (
                <button key={m.id} onClick={() => setMethodId(m.id)} className={`press w-full text-left bg-white rounded-2xl border p-4 flex items-center gap-3 ${methodId === m.id ? 'border-navy ring-2 ring-navy/15' : 'border-border'}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${m.color}18` }}><Icon name={m.icon} style={{ fontSize: '20px', color: m.color }} /></div>
                  <div className="flex-1 min-w-0"><p className="text-[13px] font-bold text-navy-dark">{m.type}</p><p className="text-[11px] text-gray-400">{m.detail}</p></div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${methodId === m.id ? 'border-navy' : 'border-gray-300'}`}>{methodId === m.id && <div className="w-2.5 h-2.5 rounded-full bg-navy" />}</div>
                </button>
              ))}
            </div>
          ) : (
            <button onClick={() => openSettings('payments')} className="press w-full h-12 border-2 border-dashed border-border rounded-xl text-[13px] font-bold text-navy flex items-center justify-center gap-2"><Icon name="add-outline" style={{ fontSize: '18px' }} />Add a payment method</button>
          )}

          <button onClick={pay} className="press w-full mt-5 h-12 bg-navy text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2"><Icon name="lock-closed" style={{ fontSize: '16px' }} />Pay {money(amount)}</button>
          <p className="text-center text-[10.5px] text-gray-400 mt-2.5">Payment is processed securely by the store.</p>
        </div>
      </div>
    )
  }

  /* ── Success ── */
  if (view === 'done' && txn) {
    const b = bizById(txn.bizId)
    return (
      <div className="screen">
        <div className="flex flex-col items-center text-center px-6" style={{ paddingTop: '16vh' }}>
          <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center mb-5"><Icon name="checkmark-circle" style={{ fontSize: '56px', color: '#2dd36f' }} /></div>
          <h1 className="text-[22px] font-extrabold text-navy-dark">Payment successful</h1>
          <p className="text-[13px] text-gray-500 mt-2">You paid <b className="text-navy-dark">{money(txn.amount)}</b> to {b.name}.</p>
          <div className="bg-white rounded-2xl border border-border w-full mt-6 divide-y divide-border overflow-hidden text-left">
            <Row k="Reference" v={txn.id} mono />
            <Row k="Paid to" v={b.name} />
            <Row k="Method" v={txn.method} />
            <Row k="Amount" v={money(txn.amount)} />
            <Row k="Date" v={txn.date} />
          </div>
          <button onClick={reset} className="press w-full mt-6 h-12 bg-navy text-white rounded-xl text-[14px] font-bold">Done</button>
        </div>
      </div>
    )
  }

  /* ── Idle (default) ── */
  return (
    <div className="screen">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-[20px] font-extrabold text-navy-dark">Pay</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Scan a store QR to pay in seconds</p>
      </div>
      <div className="px-5">
        <div className="bg-gradient-to-br from-navy-dark to-navy rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 30% 20%,#fff,transparent 60%)' }}></div>
          <div className="relative z-10 w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5"><Icon name="qr-code-outline" className="text-white" style={{ fontSize: '52px' }} /></div>
          <p className="relative z-10 text-white font-bold text-[15px]">Scan &amp; Pay</p>
          <p className="relative z-10 text-white/50 text-[12px] mt-1 leading-relaxed">Point your camera at the register QR at checkout.</p>
          <button onClick={() => setView('scanning')} className="relative z-10 mt-5 bg-white text-navy text-[13px] font-bold px-6 py-3 rounded-xl press">Open scanner</button>
        </div>

        {/* Recent payments */}
        <div className="mt-7">
          <p className="text-[13px] font-bold text-navy-dark mb-3">Recent payments</p>
          {payTxns.length ? (
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              {payTxns.map((t, i) => {
                const b = bizById(t.bizId)
                return (
                  <div key={t.id} className={`flex items-center gap-3 px-4 py-3 ${i ? 'border-t border-border' : ''}`}>
                    {b ? <StoreLogo b={b} size={38} /> : <div className="w-[38px] h-[38px] rounded-2xl bg-page" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold text-navy-dark truncate">{b ? b.name : 'Store'}</p>
                      <p className="text-[10.5px] text-gray-400">{t.method} · {t.date}</p>
                    </div>
                    <span className="text-[13px] font-extrabold text-navy-dark tnum shrink-0">{money(t.amount)}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border py-10 text-center">
              <Icon name="qr-code-outline" className="text-gray-300" style={{ fontSize: '30px' }} />
              <p className="text-[12.5px] text-gray-400 mt-2">No payments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ k, v, mono }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[11.5px] text-gray-400 font-medium">{k}</span>
      <span className={`text-[12.5px] font-bold text-navy-dark ${mono ? 'font-mono' : ''}`}>{v}</span>
    </div>
  )
}
