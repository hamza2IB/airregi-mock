import Icon from '../Icon'

const ITEMS = [
  { key: 'dashboard', icon: 'grid-outline', label: 'Home' },
  { key: 'stores', icon: 'storefront-outline', label: 'Stores' },
  { key: 'products', icon: 'cube-outline', label: 'Products' },
  { key: 'users', icon: 'people-outline', label: 'Staff' },
]

const NAV_ALIAS = { 'store-detail': 'stores' }

export default function MobileBottomNav({ activePage, onNavigate, onOpenMore }) {
  const active = NAV_ALIAS[activePage] || activePage
  return (
    <nav
      className="md:hidden fixed left-0 right-0 bottom-0 z-[250] bg-white border-t border-border flex"
      style={{ padding: '6px 4px calc(6px + env(safe-area-inset-bottom))', boxShadow: '0 -4px 20px rgba(10,21,53,.08)' }}
    >
      {ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-[10px] text-[9.5px] font-bold transition-colors ${active === item.key ? 'text-navy' : 'text-gray-400'}`}
        >
          <Icon name={item.icon} style={{ fontSize: '20px' }} />
          <span>{item.label}</span>
        </button>
      ))}
      <button
        onClick={onOpenMore}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-[10px] text-[9.5px] font-bold text-gray-400"
      >
        <Icon name="menu-outline" style={{ fontSize: '20px' }} />
        <span>More</span>
      </button>
    </nav>
  )
}
