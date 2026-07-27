import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import ActionButton from '../components/ActionButton'
import RenewalSlideover from '../components/subscription/RenewalSlideover'
import ChangePlanSlideover from '../components/subscription/ChangePlanSlideover'
import PaymentDetailSlideover from '../components/subscription/PaymentDetailSlideover'
import { SUBSCRIPTION, PLAN_USAGE, FEATURES_INCLUDED, PAYMENT_BADGE } from '../data/subscriptionData'

const PAY_COLS = '1fr 0.8fr 0.6fr 0.8fr 1.4fr 0.7fr 0.5fr'

export default function Subscription({ payments, setPayments }) {
  const navigate = useNavigate()
  const [renewal, setRenewal] = useState(null) // { mode:'renew' } | { mode:'plan-change', plan, billing }
  const [changePlanOpen, setChangePlanOpen] = useState(false)
  const [viewPayment, setViewPayment] = useState(null)

  const submitPayment = (payload) => {
    setPayments((prev) => [payload, ...prev])
    setRenewal(null)
  }

  const confirmPlanChange = (plan, billing) => {
    setChangePlanOpen(false)
    // brief delay so the change-plan drawer finishes sliding out first
    setTimeout(() => setRenewal({ mode: 'plan-change', plan, billing }), 350)
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">Current Plan</p>
              <p className="text-[32px] font-extrabold leading-tight">{SUBSCRIPTION.planName}</p>
              <p className="text-[15px] text-white/70 mt-0.5">{SUBSCRIPTION.price}</p>
            </div>
            <span className="text-[11px] font-bold bg-brand-green/25 text-brand-green px-3 py-1.5 rounded-full">Active</span>
          </div>
          <div className="flex items-center gap-8 mt-5 pt-5 border-t border-white/10 flex-wrap">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Started</p>
              <p className="text-[14px] font-semibold">{SUBSCRIPTION.started}</p>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Expires</p>
              <p className="text-[14px] font-semibold">{SUBSCRIPTION.expires}</p>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div className="flex-1 min-w-[180px]">
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Days Remaining</p>
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-semibold">{SUBSCRIPTION.daysRemaining} days</p>
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-green rounded-full" style={{ width: `${SUBSCRIPTION.daysPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan usage + Actions */}
      <div className="grid grid-cols-2 gap-5 mb-6 max-md:grid-cols-1">
        {/* Plan usage */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] font-semibold text-navy-dark">Plan Usage</p>
            <span className="text-[10px] font-bold bg-brand-blue text-white px-2.5 py-0.5 rounded-full">Pro Plan</span>
          </div>
          <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">For growing multi-location businesses. Rs.60,000/mo · Rs.648,000/yr</p>
          <div className="space-y-4">
            {PLAN_USAGE.map((u) => (
              <div key={u.label}>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Icon name={u.icon} style={{ fontSize: '12px', color: '#94a3b8' }} />
                    <span className="text-[12px] text-gray-500">{u.label}</span>
                  </div>
                  <span className="text-[12px] font-semibold">{u.used.toLocaleString()} / {u.limit.toLocaleString()}</span>
                </div>
                <div className="prog-bar"><div className={`prog-bar-fill ${u.bar}`} style={{ width: `${u.pct}%` }}></div></div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2">Features Included</p>
            <div className="space-y-1">
              {FEATURES_INCLUDED.map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <Icon name="checkmark-circle" style={{ fontSize: '13px', color: '#2dd36f', flexShrink: 0 }} />
                  <span className="text-[11px] text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
          <p className="text-[14px] font-semibold text-navy-dark mb-1">Actions</p>

          <button onClick={() => setRenewal({ mode: 'renew' })} className="flex items-center gap-3 bg-navy text-white px-4 py-3.5 rounded-xl text-[13px] font-semibold hover:bg-navy-light transition text-left group">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition">
              <Icon name="refresh-outline" style={{ fontSize: '18px' }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight">Renew Subscription</p>
              <p className="text-[11px] text-white/60 mt-0.5 font-normal">Submit bank transfer for next cycle</p>
            </div>
          </button>

          <button onClick={() => setChangePlanOpen(true)} className="flex items-center gap-3 bg-white border border-border text-navy-dark px-4 py-3.5 rounded-xl text-[13px] font-semibold hover:bg-gray-50 hover:border-navy/20 transition text-left group">
            <div className="w-9 h-9 rounded-lg bg-navy/[.08] flex items-center justify-center shrink-0 group-hover:bg-navy/[.12] transition">
              <Icon name="swap-horizontal-outline" className="text-navy" style={{ fontSize: '18px' }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight">Change Plan</p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-normal">Upgrade or downgrade your plan</p>
            </div>
          </button>

          <button onClick={() => navigate('/subscription/payments')} className="flex items-center gap-3 bg-white border border-border text-navy-dark px-4 py-3.5 rounded-xl text-[13px] font-semibold hover:bg-gray-50 hover:border-navy/20 transition text-left group">
            <div className="w-9 h-9 rounded-lg bg-brand-blue/[.08] flex items-center justify-center shrink-0 group-hover:bg-brand-blue/[.12] transition">
              <Icon name="receipt-outline" className="text-brand-blue" style={{ fontSize: '18px' }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight">Payment History</p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-normal">View all past subscription payments</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-[14px] font-semibold text-navy-dark">Recent Payments</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Last 5 subscription payments</p>
          </div>
          <button onClick={() => navigate('/subscription/payments')} className="text-[12px] font-semibold text-brand-blue hover:underline">View All Payments →</button>
        </div>
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[720px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: PAY_COLS }}>
              <div>Date</div><div>Amount</div><div>Plan</div><div>Bank</div><div>Ref #</div>
              <div className="text-center">Status</div><div className="text-right">Receipt</div>
            </div>
            <div className="divide-y divide-gray-100">
              {payments.slice(0, 5).map((p, i) => (
                <div key={i} className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition" style={{ gridTemplateColumns: PAY_COLS }}>
                  <div>
                    <p className="text-[11px] font-medium text-gray-700">{p.date}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.time}</p>
                  </div>
                  <p className="text-[13px] font-extrabold text-navy-dark">{p.amount}</p>
                  <span className="text-[10px] font-bold bg-navy/10 text-navy px-2 py-0.5 rounded-full w-fit">{p.plan}</span>
                  <p className="text-[12px] font-medium text-gray-600">{p.bank}</p>
                  <p className="text-[11px] font-mono text-gray-400 truncate">{p.ref}</p>
                  <div className="text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${PAYMENT_BADGE[p.status]}`}>{p.status}</span>
                    {p.note && <p className="text-[9px] text-brand-red mt-0.5">{p.note}</p>}
                  </div>
                  <div className="flex items-center justify-end">
                    <ActionButton icon="eye-outline" label="View" onClick={() => setViewPayment(p)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slideovers */}
      <RenewalSlideover item={renewal} onClose={() => setRenewal(null)} onSubmit={submitPayment} />
      <ChangePlanSlideover open={changePlanOpen} onClose={() => setChangePlanOpen(false)} onConfirm={confirmPlanChange} />
      <PaymentDetailSlideover payment={viewPayment} onClose={() => setViewPayment(null)} onSubmitNew={() => { setViewPayment(null); setRenewal({ mode: 'renew' }) }} />
    </div>
  )
}
