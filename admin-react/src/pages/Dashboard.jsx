import { useState } from 'react'
import ExpiryStrip from '../components/dashboard/ExpiryStrip'
import PlatformHealth from '../components/dashboard/PlatformHealth'
import RevenueSection from '../components/dashboard/RevenueSection'
import QueueSection from '../components/dashboard/QueueSection'
import SubscriptionOverview from '../components/dashboard/SubscriptionOverview'
import RejectModal from '../components/dashboard/RejectModal'
import { useToast } from '../components/Toast'

export default function Dashboard() {
  const showToast = useToast()
  const [queueTab, setQueueTab] = useState('all')
  const [resolvedIds, setResolvedIds] = useState([])
  const [rejectTarget, setRejectTarget] = useState(null)

  const handleVerify = (item) => {
    setResolvedIds((prev) => [...prev, item.id])
    showToast(item.verifyToast, 'success')
  }

  const handleConfirmReject = (item) => {
    setResolvedIds((prev) => [...prev, item.id])
    setRejectTarget(null)
    const msg =
      item.rejectType === 'new-reg'
        ? `${item.name} registration rejected. Applicant notified.`
        : `${item.name} payment rejected. Owner notified to resubmit.`
    showToast(msg, 'error')
  }

  const handleViewReceipt = (name) => {
    // Mirrors the original alert() placeholder.
    window.alert('Opening receipt for: ' + name)
  }

  return (
    <div className="adm-content p-8 max-md:p-4">
      <ExpiryStrip />

      <PlatformHealth onQueueTab={setQueueTab} />

      <RevenueSection />

      {/* Queue + Subscription overview */}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1" style={{ alignItems: 'start' }}>
        <QueueSection
          activeTab={queueTab}
          onTabChange={setQueueTab}
          resolvedIds={resolvedIds}
          onVerify={handleVerify}
          onReject={setRejectTarget}
          onViewReceipt={handleViewReceipt}
        />
        <SubscriptionOverview />
      </div>

      <RejectModal target={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={handleConfirmReject} />
    </div>
  )
}
