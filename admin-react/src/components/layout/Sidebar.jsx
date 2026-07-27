import { NavLink } from 'react-router-dom'
import Icon from '../Icon'

const navGroups = [
  {
    label: 'Overview',
    items: [{ key: 'dashboard', icon: 'grid-outline', label: 'Dashboard' }],
  },
  {
    label: 'Businesses',
    items: [
      { key: 'businesses', icon: 'business-outline', label: 'All Businesses' },
      { key: 'payments', icon: 'card-outline', label: 'Payment Verification' },
      { key: 'platform-users', icon: 'people-circle-outline', label: 'Platform Users' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { key: 'packages', icon: 'layers-outline', label: 'Packages' },
      { key: 'categories', icon: 'list-outline', label: 'Industries' },
    ],
  },
  {
    label: 'Reports',
    items: [{ key: 'revenue', icon: 'trending-up-outline', label: 'Revenue' }],
  },
  {
    label: 'Admin',
    items: [{ key: 'settings', icon: 'settings-outline', label: 'Platform Settings' }],
  },
]

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-[260px] bg-navy-dark flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto max-md:hidden">
      {/* Logo / Brand */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <Icon name="shield-checkmark" className="text-navy" size={22} />
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-tight">RetailOS</p>
          <p className="text-white/40 text-[11px] tracking-wider uppercase">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-semibold px-4 mt-5 first:mt-0 mb-2">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.key}
                to={`/${item.key}`}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-semibold truncate">Super Admin</p>
            <p className="text-white/40 text-[11px] truncate">admin@retailos.io</p>
          </div>
          <button onClick={onLogout} title="Sign out" className="text-white/40 hover:text-white">
            <Icon name="log-out-outline" size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
