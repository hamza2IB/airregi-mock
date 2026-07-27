import Icon from '../Icon'
import { expiringSoon, planDistribution } from '../../data/dashboardData'

const rowStyles = {
  red: { wrap: 'bg-brand-red/10', icon: 'alert-circle', iconCls: 'text-brand-red', days: 'text-brand-red' },
  orange: { wrap: 'bg-brand-orange/10', icon: 'warning', iconCls: 'text-brand-orange', days: 'text-brand-orange' },
  gray: { wrap: 'bg-gray-100', icon: 'time-outline', iconCls: 'text-gray-400', days: 'text-gray-400' },
}

function ExpiryRow({ item }) {
  const s = rowStyles[item.level]
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.wrap}`}>
        <Icon name={s.icon} className={`${s.iconCls} text-base`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-black truncate">{item.name}</p>
        <p className="text-[10px] text-gray-400">{item.plan}</p>
      </div>
      {item.tag ? (
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-[12px] font-extrabold ${s.days}`}>{item.days}</span>
          {item.level === 'red' ? (
            <span className="text-[9px] font-medium text-white bg-brand-red px-1.5 py-0.5 rounded-full leading-none">
              {item.tag}
            </span>
          ) : (
            <span className="text-[9px] font-medium text-brand-orange bg-brand-orange/15 px-1.5 py-0.5 rounded-full leading-none">
              {item.tag}
            </span>
          )}
        </div>
      ) : (
        <span className={`text-[12px] font-extrabold shrink-0 ${s.days}`}>{item.days}</span>
      )}
    </div>
  )
}

export default function SubscriptionOverview() {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">Subscription Overview</p>
      <div className="grid grid-cols-1 gap-4">
        {/* Expiring Soon */}
        <div className="bg-white rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
                <Icon name="alarm-outline" className="text-brand-red text-lg" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-navy-dark">Expiring Soon</p>
                <p className="text-[11px] text-gray-400">Within 7 days · auto-ban risk</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-brand-red bg-brand-red/10 px-2.5 py-1 rounded-full shrink-0">
              8 at risk
            </span>
          </div>

          <div className="divide-y divide-gray-300 overflow-y-auto expiry-scroll" style={{ maxHeight: '180px' }}>
            {expiringSoon.map((item) => (
              <ExpiryRow key={item.name} item={item} />
            ))}
          </div>

          <div className="px-5 py-3 bg-gray-50/70 border-t border-border shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-gray-500 font-medium">8 of 48 businesses at risk</p>
              <a href="#" className="text-[10px] font-semibold text-brand-blue hover:underline">
                Send reminders →
              </a>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-1.5 rounded-full"
                style={{ width: '16.7%', background: 'linear-gradient(90deg,#eb445a,#ff9800)' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-navy/10 flex items-center justify-center">
              <Icon name="pie-chart-outline" className="text-navy text-lg" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-navy-dark">Plan Distribution</p>
              <p className="text-[11px] text-gray-400">48 active businesses</p>
            </div>
          </div>
          <div className="w-full h-5 rounded-full overflow-hidden flex mb-4">
            {planDistribution.map((p) => (
              <div key={p.name} className={`h-5 ${p.barCls}`} style={{ width: p.pct }}></div>
            ))}
          </div>
          <div className="space-y-3">
            {planDistribution.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${p.dotCls}`}></div>
                  <span className="text-[12px] text-gray-700 font-medium">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400">{p.biz} businesses</span>
                  <span className="text-[12px] font-bold text-navy-dark">{p.pct}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-1 rounded-lg font-semibold">
              46 Active
            </span>
            <span className="text-[10px] bg-brand-red/10 text-brand-red px-2 py-1 rounded-lg font-semibold">
              1 Suspended
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-semibold">1 Banned</span>
          </div>
        </div>
      </div>
    </div>
  )
}
