import Icon from '../Icon'

export default function PlatformHealth({ onQueueTab }) {
  return (
    <>
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">Platform Health</p>
      <div className="adm-kpi-grid grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
        {/* Active Businesses */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <Icon name="business-outline" className="text-brand-blue text-xl" />
            </div>
            <span className="text-[10px] font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
              ↑ 3 this week
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-navy-dark leading-none mb-1">48</p>
          <p className="text-[11px] text-gray-500 font-medium">Active Businesses</p>
          <p className="text-[11px] text-gray-400 mt-1">214 total stores</p>
        </div>

        {/* Registered Customers */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Icon name="people-outline" className="text-brand-green text-xl" />
            </div>
            <span className="text-[10px] font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
              ↑ 420 this week
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-navy-dark leading-none mb-1">18.6k</p>
          <p className="text-[11px] text-gray-500 font-medium">Registered Customers</p>
        </div>

        {/* Pending Approvals — new registrations */}
        <div className="kpi-card cursor-pointer" onClick={() => onQueueTab('new-reg')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
              <Icon name="hourglass-outline" className="text-brand-purple text-xl" />
            </div>
            <span className="text-[10px] font-semibold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">
              Approve needed
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-brand-purple leading-none mb-1">4</p>
          <p className="text-[11px] text-gray-500 font-medium">Pending Approvals</p>
          <p className="text-[11px] text-gray-400 mt-1">New registrations</p>
        </div>

        {/* Renewals to Verify */}
        <div className="kpi-card cursor-pointer" onClick={() => onQueueTab('renewal')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              <Icon name="card-outline" className="text-brand-orange text-xl" />
            </div>
            <span className="text-[10px] font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
              Action needed
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-brand-orange leading-none mb-1">2</p>
          <p className="text-[11px] text-gray-500 font-medium">Renewals to Verify</p>
          <p className="text-[11px] text-gray-400 mt-1">Existing businesses</p>
        </div>
      </div>
    </>
  )
}
