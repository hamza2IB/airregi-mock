import { useNavigate } from 'react-router-dom'
import Icon from '../Icon'
import QueueItem from './QueueItem'
import { queueItems } from '../../data/dashboardData'

const tabs = [
  { key: 'all', label: 'All', count: queueItems.length, pill: 'bg-navy' },
  { key: 'new-reg', label: 'New Reg', count: queueItems.filter((q) => q.type === 'new-reg').length, pill: 'bg-brand-purple' },
  { key: 'renewal', label: 'Renewals', count: queueItems.filter((q) => q.type === 'renewal').length, pill: 'bg-brand-orange' },
]

export default function QueueSection({ activeTab, onTabChange, resolvedIds, onVerify, onReject, onViewReceipt }) {
  const navigate = useNavigate()
  const total = queueItems.length
  const newRegCount = queueItems.filter((q) => q.type === 'new-reg').length
  const renewalCount = queueItems.filter((q) => q.type === 'renewal').length

  const visible = queueItems.filter((q) => activeTab === 'all' || q.type === activeTab)

  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">
        Payment Verification Queue
      </p>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Queue header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center shrink-0">
              <Icon name="layers-outline" className="text-brand-purple text-base" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-navy-dark">Payment Verification</p>
              <p className="text-[11px] text-gray-400">
                {total} total · <span className="text-brand-purple font-semibold">{newRegCount} new reg</span> ·{' '}
                <span className="text-brand-orange font-semibold">{renewalCount} renewals</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/payments', { state: { tab: activeTab } })}
            className="text-[11px] text-brand-blue font-medium hover:underline shrink-0"
          >
            View all →
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={
                  active
                    ? 'flex-1 py-2.5 text-[11px] font-semibold text-navy border-b-2 border-navy bg-gray-50/60 transition'
                    : 'flex-1 py-2.5 text-[11px] font-medium text-gray-500 border-b-2 border-transparent hover:bg-gray-50 transition'
                }
              >
                {tab.label}{' '}
                <span className={`ml-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${tab.pill}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* List */}
        <div
          className="divide-y divide-gray-300 overflow-y-auto queue-scroll"
          style={{ maxHeight: '480px' }}
        >
          {visible.map((item) => (
            <QueueItem
              key={item.id}
              item={item}
              resolved={resolvedIds.includes(item.id)}
              onVerify={onVerify}
              onReject={onReject}
              onViewReceipt={onViewReceipt}
            />
          ))}
          <div className="px-5 py-4 text-center bg-gray-50/30">
            <p className="text-[11px] text-gray-400">No more payments in queue.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
