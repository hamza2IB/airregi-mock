import { useState } from 'react'
import Icon from '../Icon'
import { revData, revFilterTabs } from '../../data/revenueData'

// Mirrors the MRR bar height/label/colour logic from applyRevData().
function buildBars(d) {
  const maxVal = Math.max(...d.bars)
  return d.bars.map((v, i) => {
    const pct = Math.round((v / maxVal) * 100)
    const isLast = i === d.bars.length - 1
    const label = v >= 100 ? (v / 100).toFixed(2).replace(/\.?0+$/, '') + 'M' : v + 'K'
    const barBg = isLast
      ? 'bg-brand-blue ring-2 ring-brand-blue/20'
      : pct >= 85
        ? 'bg-brand-blue/70'
        : pct >= 65
          ? 'bg-brand-blue/50'
          : 'bg-brand-blue/30'
    const textCls = isLast ? 'text-brand-blue font-bold' : 'text-gray-400'
    return { pct, label, barBg, textCls, month: d.months[i] }
  })
}

const pkgRows = [
  { id: 'ent', name: 'Enterprise', dot: 'bg-navy', bar: 'bg-navy' },
  { id: 'pro', name: 'Pro', dot: 'bg-brand-blue', bar: 'bg-brand-blue' },
  { id: 'str', name: 'Starter', dot: 'bg-brand-blue/40', bar: 'bg-brand-blue/40' },
]

export default function RevenueSection() {
  const [period, setPeriod] = useState('this_month')
  const d = revData[period]
  const bars = buildBars(d)

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold">Revenue</p>
        <div className="flex bg-white border border-border rounded-lg overflow-hidden">
          {revFilterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPeriod(tab.key)}
              className={
                period === tab.key
                  ? 'px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
                  : 'px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-gray-50 transition'
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gray-400 font-medium mb-4 -mt-1">{d.label}</p>

      {/* Hero revenue card */}
      <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white relative overflow-hidden mb-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
              Platform Subscription Revenue
            </p>
            <span className="text-[11px] font-medium text-brand-green bg-brand-green/20 px-2.5 py-0.5 rounded-full">
              {d.trend}
            </span>
          </div>
          <p className="text-[38px] font-extrabold leading-tight">{d.total}</p>
          <div className="flex items-center gap-8 mt-4 pt-4 border-t border-white/10 flex-wrap">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Active Subs</p>
              <p className="text-[20px] font-bold">{d.subs}</p>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">{d.newSubsLabel}</p>
              <p className="text-[20px] font-bold">{d.newSubs}</p>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">{d.renewalsLabel}</p>
              <p className="text-[20px] font-bold">{d.renewals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by package + MRR trend */}
      <div className="adm-2col grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
        {/* Revenue by package */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center">
              <Icon name="layers-outline" className="text-brand-purple text-lg" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-navy-dark">Revenue by Package</p>
              <p className="text-[11px] text-gray-400">Subscription tier breakdown</p>
            </div>
          </div>
          <div className="space-y-4">
            {pkgRows.map((row) => {
              const p = d.pkg[row.id]
              return (
                <div key={row.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${row.dot}`}></div>
                      <span className="text-[12px] font-semibold text-navy-dark">{row.name}</span>
                      <span className="text-[10px] text-gray-400">{p.biz} businesses</span>
                    </div>
                    <span className="text-[13px] font-bold text-navy-dark">{p.rev}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-lg overflow-hidden">
                    <div className={`h-3 rounded-lg ${row.bar}`} style={{ width: p.pct }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{p.note}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* MRR trend */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center">
              <Icon name="bar-chart-outline" className="text-brand-green text-lg" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-navy-dark">MRR Trend</p>
              <p className="text-[11px] text-gray-400">{d.mrrSubtitle}</p>
            </div>
          </div>
          <div className="flex items-end gap-[10px]" style={{ height: '130px' }}>
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <p className={`text-[8px] mb-1 ${b.textCls}`}>{b.label}</p>
                <div
                  className={`w-full rounded-t hover:opacity-80 transition ${b.barBg}`}
                  style={{ height: `${b.pct}%` }}
                ></div>
                <p className={`text-[9px] mt-1.5 ${b.textCls}`}>{b.month}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 bg-brand-green/10 px-3 py-1.5 rounded-lg">
              <Icon name="trending-up" className="text-brand-green text-sm" />
              <span className="text-[11px] font-semibold text-brand-green">{d.growth}</span>
            </div>
            <span className="text-[10px] text-gray-400">{d.growthNote}</span>
          </div>
        </div>
      </div>
    </>
  )
}
