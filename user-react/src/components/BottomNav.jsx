import Icon from './Icon'

const TABS = [
  { key: 'home', icon: 'home-outline', label: 'Home' },
  { key: 'cart', icon: 'cart-outline', label: 'Cart' },
  { key: 'pay', icon: 'qr-code-outline', label: 'Pay', orb: true },
  { key: 'orders', icon: 'receipt-outline', label: 'Orders' },
  { key: 'settings', icon: 'settings-outline', label: 'Settings' },
]

export default function BottomNav({ activeTab, onNavigate, cartCount = 0 }) {
  return (
    <nav id="tabbar">
      {TABS.map((t) =>
        t.orb ? (
          <div key={t.key} className="tab tab-pay" onClick={() => onNavigate(t.key)}>
            <div className="pay-orb"><Icon name={t.icon} /></div>
          </div>
        ) : (
          <div
            key={t.key}
            className={`tab relative${activeTab === t.key ? ' active' : ''}`}
            onClick={() => onNavigate(t.key)}
          >
            {t.key === 'cart' && cartCount > 0 && (
              <span className="absolute -top-0.5 right-[26%] min-w-[16px] h-[16px] px-1 bg-brand-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </div>
        ),
      )}
    </nav>
  )
}
