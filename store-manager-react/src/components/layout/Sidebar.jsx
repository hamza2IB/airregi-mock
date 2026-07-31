import Icon from '../Icon'

const NAV_GROUPS = [
  { label: 'Overview', items: [{ key: 'dashboard', icon: 'grid-outline', label: 'Dashboard' }] },
  {
    label: 'Inventory',
    items: [
      { key: 'inventory', icon: 'cube-outline', label: 'Stock Levels' },
      { key: 'movements', icon: 'swap-vertical-outline', label: 'Stock Movements' },
      { key: 'scanstock', icon: 'scan-outline', label: 'Scan to Check' },
    ],
  },
  { label: 'Replenishment', items: [{ key: 'requests', icon: 'swap-horizontal-outline', label: 'Stock Transfers' }] },
  {
    label: 'Orders',
    items: [
      { key: 'orders', icon: 'globe-outline', label: 'Online Orders' },
      { key: 'refunds', icon: 'arrow-undo-outline', label: 'Refunds' },
      { key: 'issues', icon: 'chatbox-ellipses-outline', label: 'Customer Issues' },
    ],
  },
  { label: 'Team', items: [{ key: 'shifts', icon: 'time-outline', label: 'Cashier Shifts' }] },
  { label: 'Store', items: [{ key: 'sales', icon: 'receipt-outline', label: 'Store Sales' }] },
]

export default function Sidebar({ activePage, onNavigate, mobileOpen, onCloseMobile, onLogout, refundBadge, issuesBadge }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[290] bg-navy-dark/45 transition-opacity duration-250 lg:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      ></div>

      <aside
        className={`bg-navy-dark flex flex-col shrink-0 overflow-y-auto thin-scroll
          w-[260px] sticky top-0 h-screen
          max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:h-[100dvh] max-lg:w-[82vw] max-lg:max-w-[300px] max-lg:z-[300]
          max-lg:transition-transform max-lg:duration-300 ${mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}`}
        style={{ boxShadow: mobileOpen ? '10px 0 40px rgba(10,21,53,.28)' : 'none' }}
      >
        <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Icon name="storefront" className="text-navy" style={{ fontSize: '22px' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[15px] leading-tight">Al Fatah — Main Branch</p>
            <p className="text-white/40 text-[11px] tracking-wider uppercase">Store Portal</p>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden w-[30px] h-[30px] rounded-lg bg-white/[.08] text-white flex items-center justify-center shrink-0">
            <Icon name="close-outline" style={{ fontSize: '20px' }} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-semibold px-4 mt-5 first:mt-0 mb-2">
                {group.label}
              </p>
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className={`sidebar-link${activePage === item.key ? ' active' : ''}`}
                  onClick={() => onNavigate(item.key)}
                >
                  <Icon name={item.icon} style={{ fontSize: '20px' }} />
                  <span>{item.label}</span>
                  {item.key === 'refunds' && refundBadge > 0 && (
                    <span className="ml-auto text-[9px] font-bold bg-brand-red text-white px-1.5 py-0.5 rounded-full">{refundBadge}</span>
                  )}
                  {item.key === 'issues' && issuesBadge > 0 && (
                    <span className="ml-auto text-[9px] font-bold bg-brand-red text-white px-1.5 py-0.5 rounded-full">{issuesBadge}</span>
                  )}

                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0">
              NH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-semibold truncate">Nadia Hasan</p>
              <p className="text-white/40 text-[11px] truncate">nadia@alfatah.pk</p>
            </div>
            <button onClick={onLogout} title="Log out" className="text-white/40 hover:text-white">
              <Icon name="log-out-outline" style={{ fontSize: '18px' }} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
