import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { CP_PLANS, CP_USAGE, CP_CURRENT_ID } from '../../data/subscriptionData'

const COLOR_CLS = {
  'brand-green': { wrap: 'bg-brand-green/10', text: 'text-brand-green' },
  'brand-blue': { wrap: 'bg-brand-blue/10', text: 'text-brand-blue' },
  navy: { wrap: 'bg-navy/10', text: 'text-navy' },
}

function downgradeBlockers(plan) {
  const b = []
  if (typeof plan.storeLimit === 'number' && CP_USAGE.stores > plan.storeLimit)
    b.push(`You have ${CP_USAGE.stores} stores, but ${plan.name} allows only ${plan.storeLimit}`)
  if (typeof plan.productLimit === 'number' && CP_USAGE.products > plan.productLimit)
    b.push(`You have ${CP_USAGE.products} products, but ${plan.name} allows only ${plan.productLimit}`)
  return b
}

function Content({ onClose, onConfirm }) {
  const [billing, setBilling] = useState('monthly')
  const [selectedId, setSelectedId] = useState(CP_CURRENT_ID)
  const currentIdx = CP_PLANS.findIndex((p) => p.id === CP_CURRENT_ID)
  const current = CP_PLANS[currentIdx]
  const selected = CP_PLANS.find((p) => p.id === selectedId)
  const blockers = selectedId !== CP_CURRENT_ID ? downgradeBlockers(selected) : []
  const showConfirm = selectedId !== CP_CURRENT_ID && blockers.length === 0

  const yearlyPlan = CP_PLANS.find((p) => p.id === selectedId) || CP_PLANS[1]
  const savePct = Math.round((1 - yearlyPlan.prices.yearly / (yearlyPlan.prices.monthly * 12)) * 100)

  const btCls = (c) =>
    c === billing
      ? 'flex-1 py-2 rounded-lg text-[12px] font-semibold transition bg-white shadow-sm text-navy-dark'
      : 'flex-1 py-2 rounded-lg text-[12px] font-semibold transition text-gray-500'

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
            <Icon name="swap-horizontal-outline" className="text-navy" style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">Change Plan</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Currently on <strong className="text-navy-dark">{current.name} Plan</strong> · Rs.{current.prices.monthly.toLocaleString()}/mo</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* Billing toggle */}
      <div className="px-6 pt-5 pb-3">
        <div className="bg-gray-100 rounded-xl p-1 flex">
          <button onClick={() => setBilling('monthly')} className={btCls('monthly')}>Monthly</button>
          <button onClick={() => setBilling('yearly')} className={btCls('yearly')}>
            Yearly {savePct > 0 && <span className="text-brand-green text-[10px] font-bold">-{savePct}%</span>}
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="px-6 pb-3 space-y-3">
        {CP_PLANS.map((plan, i) => {
          const price = plan.prices[billing]
          const isCurr = plan.id === CP_CURRENT_ID
          const isSel = plan.id === selectedId
          const isUp = i > currentIdx
          const isDown = i < currentIdx
          const metrics = [
            { label: 'Stores', val: plan.storeLimit },
            { label: 'Products', val: plan.productLimit },
            { label: 'Users', val: plan.userLimit },
          ]
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedId(plan.id)}
              className={`bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-150 ${isSel ? 'border-brand-purple shadow-lg shadow-brand-purple/10' : 'border-border hover:border-brand-purple/30'}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl ${COLOR_CLS[plan.color].wrap} flex items-center justify-center`}>
                      <Icon name={plan.icon} className={COLOR_CLS[plan.color].text} style={{ fontSize: '18px' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-[14px] font-bold text-navy-dark">{plan.name}</p>
                        {isCurr && <span className="text-[9px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">Current</span>}
                        {isUp && <span className="text-[9px] font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">Upgrade</span>}
                        {isDown && <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Downgrade</span>}
                      </div>
                      <p className="text-[11px] text-gray-400">Rs.{price.toLocaleString()} / {billing === 'yearly' ? 'yr' : 'mo'}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSel ? 'border-brand-purple bg-brand-purple' : 'border-gray-300'}`}>
                    {isSel && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
                <div className={`grid grid-cols-3 gap-2 mb-3 ${isSel ? '' : 'opacity-60'}`}>
                  {metrics.map((m) => (
                    <div key={m.label} className="bg-gray-50 rounded-lg px-2 py-1.5 text-center">
                      <p className="text-[11px] font-bold text-navy-dark">{m.val}</p>
                      <p className="text-[9px] text-gray-400">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className={`space-y-1 ${isSel ? '' : 'opacity-60'}`}>
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <Icon name="checkmark-outline" className={`${COLOR_CLS[plan.color].text} shrink-0`} style={{ fontSize: '13px' }} />
                      <span className="text-[11px] text-gray-600">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Downgrade blocker */}
      {blockers.length > 0 && (
        <div className="mx-6 mb-4 bg-brand-red/5 border border-brand-red/20 rounded-xl px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Icon name="alert-circle-outline" className="text-brand-red shrink-0 mt-0.5" style={{ fontSize: '16px' }} />
            <div>
              <p className="text-[12px] font-semibold text-brand-red mb-1">Can't switch to this plan yet</p>
              <ul className="text-[11px] text-gray-600 space-y-0.5 list-disc pl-4">
                {blockers.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Confirm bar */}
      {showConfirm && (
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4">
          <button onClick={() => onConfirm(selected, billing)} className="w-full py-3 bg-brand-purple text-white rounded-xl text-[13px] font-semibold hover:bg-brand-purple/90 transition flex items-center justify-center gap-2">
            <Icon name="checkmark-circle-outline" style={{ fontSize: '16px' }} />
            <span>Switch to {selected.name} · Rs.{selected.prices[billing].toLocaleString()}/{billing === 'yearly' ? 'year' : 'month'}</span>
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-2">You'll be asked to submit a bank transfer for this plan change</p>
        </div>
      )}
    </>
  )
}

export default function ChangePlanSlideover({ open, onClose, onConfirm }) {
  const keyRef = useRef(0)
  useEffect(() => {
    if (open) keyRef.current += 1
  }, [open])
  return (
    <Slideover
      item={open ? { open: true } : null}
      onClose={onClose}
      width={520}
      render={() => <Content key={keyRef.current} onClose={onClose} onConfirm={onConfirm} />}
    />
  )
}
