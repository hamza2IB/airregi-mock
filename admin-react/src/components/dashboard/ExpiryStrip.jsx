import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../Icon'
import { expiryStripItems } from '../../data/dashboardData'

const levelStyles = {
  red: {
    wrap: 'border-brand-red/25',
    bg: 'rgba(235,68,90,0.06)',
    dot: 'bg-brand-red animate-pulse',
    text: 'text-brand-red font-semibold',
    pill: 'bg-brand-red',
  },
  orange: {
    wrap: 'border-brand-orange/25',
    bg: 'rgba(255,152,0,0.06)',
    dot: 'bg-brand-orange',
    text: 'text-brand-orange font-medium',
    pill: 'bg-brand-orange',
  },
}

export default function ExpiryStrip() {
  const [visible, setVisible] = useState(true)
  const navigate = useNavigate()
  if (!visible) return null

  return (
    <div
      className="relative flex items-center gap-0 rounded-xl overflow-hidden border border-brand-orange/30 mb-6"
      style={{ background: '#fff8f0' }}
    >
      <div className="w-1 self-stretch bg-brand-orange shrink-0"></div>
      <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand-orange/20 flex items-center justify-center">
            <Icon name="warning" className="text-brand-orange" size={14} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-navy-dark leading-tight">Subscription Expiry</p>
            <p className="text-[10px] text-gray-500 leading-tight">Auto-ban in &lt;7 days</p>
          </div>
        </div>
        <div className="w-px h-7 bg-brand-orange/20 shrink-0 mx-1"></div>
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {expiryStripItems.map((item) => {
            const s = levelStyles[item.level]
            return (
              <div
                key={item.name}
                className={`inline-flex items-center rounded-lg overflow-hidden border shrink-0 ${s.wrap}`}
                style={{ background: s.bg }}
              >
                <div className="px-2.5 py-1.5 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`}></span>
                  <span className={`text-[11px] whitespace-nowrap ${s.text}`}>{item.name}</span>
                </div>
                <div className={`px-2 py-1.5 self-stretch flex items-center ${s.pill}`}>
                  <span className="text-[10px] font-extrabold text-white">{item.days}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            onClick={() => navigate('/businesses')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-brand-orange/15 transition"
          >
            Review all <Icon name="arrow-forward-outline" size={12} />
          </button>
          <button
            onClick={() => setVisible(false)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-black/5"
          >
            <Icon name="close-outline" size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
