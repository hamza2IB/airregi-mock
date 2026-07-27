import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import ActionButton from '../components/ActionButton'
import { useToast } from '../components/Toast'
import TransactionDetailSlideover from '../components/dashboard/TransactionDetailSlideover'
import ShiftDetailSlideover from '../components/dashboard/ShiftDetailSlideover'
import {
  DASH_DATA,
  DASH_PERIODS,
  STORE_PERF,
  PAYMENT_METHODS,
  SHIFTS_DATA,
  TXN_DATA,
  PAY_COLORS,
} from '../data/dashboardData'

const fmt = (n) => 'Rs.' + n.toLocaleString()

function storeSquare(store) {
  const bg = store === 'Main Branch' ? '#1a2d6b' : store === 'DHA Branch' ? '#3366cc' : '#7c4dff'
  const label =
    store.split(' ').filter((w) => !['Al', 'Fatah', 'Branch'].includes(w)).map((w) => w[0]).join('').substring(0, 2) ||
    store.substring(0, 2).toUpperCase()
  return { bg, label }
}

function KpiCard({ icon, iconBg, iconColor, badge, badgeCls, value, label, sub }) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon name={icon} className={`${iconColor} text-xl`} />
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeCls}`}>{badge}</span>
      </div>
      <p className="text-[28px] font-extrabold text-navy-dark leading-none mb-1">{value}</p>
      <p className="text-[11px] text-gray-500 font-medium">{label}</p>
      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

export default function Dashboard() {
  const showToast = useToast()
  const navigate = useNavigate()
  const [period, setPeriod] = useState('today')
  const [viewTxn, setViewTxn] = useState(null)
  const [viewShift, setViewShift] = useState(null)
  const d = DASH_DATA[period]

  const balanced = SHIFTS_DATA.filter((s) => s.diff === 0).length
  const issues = SHIFTS_DATA.length - balanced

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Period tabs + export */}
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1 max-md:overflow-x-auto">
          {DASH_PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`period-tab shrink-0${period === p.key ? ' active' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => showToast('Exporting report...', 'info')}
          className="flex items-center gap-1.5 border border-border bg-white text-navy-dark px-4 py-2 rounded-xl text-[12px] font-semibold hover:bg-gray-50 transition"
        >
          <Icon name="download-outline" /> Export
        </button>
      </div>
      <p className="text-[11px] text-gray-400 font-medium mb-5">{d.label}</p>

      {/* Hero revenue card */}
      <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white relative overflow-hidden mb-5">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">Total Revenue — All Stores</p>
            <span className="text-[11px] font-semibold text-brand-green bg-brand-green/20 px-2.5 py-0.5 rounded-full">
              {d.trend}
            </span>
          </div>
          <p className="text-[38px] font-extrabold leading-tight">{d.rev}</p>
          <div className="flex items-center gap-8 mt-4 pt-4 border-t border-white/10 flex-wrap max-md:gap-[18px]">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Orders</p>
              <p className="text-[20px] font-bold">{d.orders}</p>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Active Stores</p>
              <p className="text-[20px] font-bold">{d.stores}</p>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">POS Revenue</p>
              <p className="text-[20px] font-bold">{d.pos}</p>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Online Revenue</p>
              <p className="text-[20px] font-bold">{d.online}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
        <KpiCard icon="cash-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" badge="↑ 12%" badgeCls="text-brand-green bg-brand-green/10" value={d.rev} label="Total Revenue" sub="All stores combined" />
        <KpiCard icon="receipt-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" badge="↑ 8%" badgeCls="text-brand-green bg-brand-green/10" value={d.orders} label="Total Orders" sub="Across all channels" />
        <KpiCard icon="storefront-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" badge="1 inactive" badgeCls="text-gray-400 bg-gray-100" value="3" label="Active Stores" sub="4 total registered" />
        <KpiCard icon="people-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" badge="↑ 42 new" badgeCls="text-brand-green bg-brand-green/10" value="4,821" label="Total Customers" sub="All-time registered" />
      </div>

      {/* Channel split + payment methods */}
      <div className="grid grid-cols-2 gap-5 mb-6 max-md:grid-cols-1">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[14px] font-semibold text-navy-dark mb-4">Channel Split</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center">
                    <Icon name="storefront-outline" className="text-navy text-sm" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-navy-dark">POS In-Store</p>
                    <p className="text-[10px] text-gray-400">{d.posPct}% share</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-navy-dark">{d.pos}</span>
              </div>
              <div className="prog-bar">
                <div className="prog-bar-fill bg-navy" style={{ width: `${d.posPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                    <Icon name="globe-outline" className="text-brand-blue text-sm" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-navy-dark">Online / EC</p>
                    <p className="text-[10px] text-gray-400">{d.ecPct}% share</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-navy-dark">{d.online}</span>
              </div>
              <div className="prog-bar">
                <div className="prog-bar-fill bg-brand-blue" style={{ width: `${d.ecPct}%` }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[11px] text-gray-400">
              POS dominates · <span className="font-semibold text-navy">5 registers active</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[14px] font-semibold text-navy-dark mb-4">Payment Methods Breakdown</p>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                  <Icon name={m.icon} className={`${m.color} text-sm`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] font-medium text-navy-dark">{m.name}</span>
                    <span className="text-[12px] font-bold">{m.rev}</span>
                  </div>
                  <div className="prog-bar">
                    <div className={`prog-bar-fill ${m.bar}`} style={{ width: `${m.pct}%` }}></div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 shrink-0">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store performance */}
      <div className="grid gap-5 mb-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] font-semibold text-navy-dark">Store Performance</p>
            <button onClick={() => navigate('/stores')} className="text-[11px] font-medium text-brand-blue hover:underline">
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {STORE_PERF.map((s) => (
              <div
                key={s.storeId}
                onClick={() => navigate('/stores')}
                className="cursor-pointer hover:bg-gray-50 rounded-xl p-2 py-0 -mx-2 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon name="storefront-outline" className={`${s.iconColor} text-sm`} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-navy-dark">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.orders} orders · {s.pct}% of total</p>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-navy-dark shrink-0 ml-2">{s.rev}</span>
                </div>
                <div className="prog-bar">
                  <div className={`prog-bar-fill ${s.barColor}`} style={{ width: `${s.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent shift closings */}
      <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-2">
          <div>
            <p className="text-[14px] font-semibold text-navy-dark">Recent Shift Closings</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Today · cashier drawer reconciliation</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">{balanced} Balanced</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${issues > 0 ? 'bg-brand-orange/10 text-brand-orange' : 'bg-gray-100 text-gray-400'}`}>
              {issues} Issue{issues !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[780px]">
            <div className="grid px-5 py-2 bg-gray-50/60 border-b border-border text-[10px] font-semibold text-gray-400 uppercase tracking-[0.07em]" style={{ gridTemplateColumns: '1.4fr 1.2fr 1fr 0.9fr 0.9fr 0.9fr 0.7fr' }}>
              <div>Cashier</div><div>Store</div><div>Date / Time</div>
              <div className="text-right">Expected</div><div className="text-right">Actual</div>
              <div className="text-right">Result</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {SHIFTS_DATA.map((s, idx) => {
                const isBalanced = s.diff === 0
                const isShort = s.diff < 0
                const statusIcon = isBalanced ? 'checkmark-circle' : isShort ? 'arrow-down-circle' : 'arrow-up-circle'
                const statusColor = isBalanced ? 'text-brand-green' : isShort ? 'text-brand-red' : 'text-brand-orange'
                const diffBg = isBalanced ? 'bg-brand-green/10' : isShort ? 'bg-brand-red/10' : 'bg-brand-orange/10'
                const diffLabel = isBalanced ? 'Balanced' : isShort ? `−Rs.${Math.abs(s.diff)}` : `+Rs.${s.diff}`
                const initials = s.cashier.split(' ').map((n) => n[0]).join('')
                const avatarBg = isBalanced ? 'bg-navy/10 text-navy' : isShort ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-orange/10 text-brand-orange'
                const sq = storeSquare(s.store)
                return (
                  <div key={idx} className="grid items-center px-5 py-3 hover:bg-gray-50/60 transition" style={{ gridTemplateColumns: '1.4fr 1.2fr 1fr 0.9fr 0.9fr 0.9fr 0.7fr' }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full ${avatarBg} flex items-center justify-center text-[10px] font-bold shrink-0`}>{initials}</div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-navy-dark truncate leading-tight">{s.cashier}</p>
                        <p className="text-[10px] text-gray-400 truncate">{s.register}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-white shrink-0" style={{ background: sq.bg }}>{sq.label}</div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-navy-dark truncate leading-tight">Al Fatah {s.store}</p>
                        <p className="text-[10px] text-gray-400">Lahore</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-gray-700">{s.date}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.time}</p>
                    </div>
                    <div className="text-right"><p className="text-[11px] text-gray-500">{fmt(s.expected)}</p></div>
                    <div className="text-right"><p className="text-[12px] font-semibold text-navy-dark">{fmt(s.actual)}</p></div>
                    <div className="flex items-center justify-end gap-1.5">
                      <Icon name={statusIcon} className={statusColor} style={{ fontSize: '14px', flexShrink: 0 }} />
                      <span className={`text-[10px] font-bold ${statusColor} ${diffBg} px-2 py-0.5 rounded-full whitespace-nowrap`}>{diffLabel}</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <ActionButton icon="eye-outline" label="View" onClick={() => setViewShift(s)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-2">
          <div>
            <p className="text-[14px] font-semibold text-navy-dark">Recent Transactions</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Latest orders across all stores &amp; channels</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold bg-navy/10 text-navy px-2.5 py-1 rounded-full">POS</span>
            <span className="text-[10px] font-semibold bg-brand-blue/10 text-brand-blue px-2.5 py-1 rounded-full">EC</span>
          </div>
        </div>
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[840px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: '1.4fr 1.6fr 0.7fr 1.4fr 0.9fr 0.8fr 0.8fr 0.6fr' }}>
              <div>Order ID</div><div>Store</div><div>Channel</div><div>Cashier / Staff</div>
              <div className="text-right">Amount</div><div>Payment</div><div>Date / Time</div><div></div>
            </div>
            <div className="divide-y divide-gray-100">
              {TXN_DATA.map((t) => (
                <div key={t.id} className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition" style={{ gridTemplateColumns: '1.4fr 1.6fr 0.7fr 1.4fr 0.9fr 0.8fr 0.8fr 0.6fr' }}>
                  <div>
                    <p className="text-[11px] font-bold font-mono text-navy-dark">{t.id}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{t.items} item{t.items !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-white shrink-0" style={{ background: t.storeColor }}>
                      {t.storeShort.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-navy-dark truncate leading-tight">Al Fatah {t.store}</p>
                      <p className="text-[10px] text-gray-400">Lahore</p>
                    </div>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.channel === 'POS' ? 'bg-navy/10 text-navy' : 'bg-brand-blue/10 text-brand-blue'}`}>{t.channel}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0">
                      {t.cashier === 'Online Order' ? <Icon name="globe-outline" style={{ fontSize: '11px' }} /> : t.cashier.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <p className="text-[11px] text-gray-600 truncate">{t.cashier}</p>
                  </div>
                  <div className="text-right"><p className="text-[12.5px] font-bold text-navy-dark">{t.amount}</p></div>
                  <div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${PAY_COLORS[t.pay] || 'bg-gray-100 text-gray-500'}`}>
                      <Icon name={t.payIcon} style={{ fontSize: '10px' }} />{t.pay}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-gray-700">{t.date}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{t.time}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <ActionButton icon="eye-outline" label="View" onClick={() => setViewTxn(t)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">Showing latest 10 transactions</p>
          <button onClick={() => showToast('Full transaction history coming soon', 'info')} className="text-[11px] font-semibold text-brand-blue hover:underline">
            View all transactions →
          </button>
        </div>
      </div>

      {/* Detail slideovers */}
      <TransactionDetailSlideover txn={viewTxn} onClose={() => setViewTxn(null)} />
      <ShiftDetailSlideover shift={viewShift} onClose={() => setViewShift(null)} />
    </div>
  )
}
