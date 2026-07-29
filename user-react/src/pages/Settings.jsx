import Icon from '../components/Icon'
import { useApp } from '../store'

const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export default function Settings() {
  const { user, addresses, payments, wishlist, myissues, openSettings, go, showToast } = useApp()

  const Row = ({ icon, label, k, hint }) => (
    <button onClick={() => openSettings(k)} className="press w-full flex items-center gap-3 px-4 py-3.5 text-left border-t border-border first:border-0">
      <div className="w-8 h-8 rounded-lg bg-page flex items-center justify-center shrink-0"><Icon name={icon} className="text-navy" style={{ fontSize: '17px' }} /></div>
      <span className="flex-1 text-[13px] font-semibold text-navy-dark">{label}</span>
      {hint && <span className="text-[11px] text-gray-400 truncate max-w-[110px]">{hint}</span>}
      <Icon name="chevron-forward" className="text-gray-300 shrink-0" style={{ fontSize: '15px' }} />
    </button>
  )

  const groups = [
    { title: 'Account', rows: [
      { icon: 'person-outline', label: 'Personal information', k: 'profile' },
      { icon: 'location-outline', label: 'Delivery addresses', k: 'addresses', hint: `${addresses.length} saved` },
      { icon: 'card-outline', label: 'Payment methods', k: 'payments', hint: `${payments.length} saved` },
      { icon: 'heart-outline', label: 'Wishlist', k: 'wishlist', hint: `${wishlist.length} items` },
    ] },
    { title: 'Support', rows: [
      { icon: 'chatbox-ellipses-outline', label: 'My requests', k: 'myissues', hint: `${myissues.length} total` },
      { icon: 'help-circle-outline', label: 'Help center', k: 'help' },
      { icon: 'chatbubbles-outline', label: 'Contact us', k: 'contact' },
      { icon: 'document-text-outline', label: 'Terms & privacy', k: 'terms' },
    ] },
  ]

  return (
    <div className="screen">
      <div className="bg-gradient-to-br from-navy-dark to-navy px-5 pt-12 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-extrabold text-[18px]">{initials(user.name)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-[16px] leading-tight truncate">{user.name}</p>
            <p className="text-white/50 text-[12px] leading-tight truncate">{user.email}</p>
          </div>
          <button onClick={() => openSettings('profile')} className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center press"><Icon name="create-outline" className="text-white" style={{ fontSize: '17px' }} /></button>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-1 pt-2 pb-1">{g.title}</p>
            <div className="bg-white rounded-2xl border border-border overflow-hidden">{g.rows.map((r) => <Row key={r.k} {...r} />)}</div>
          </div>
        ))}
        <button onClick={() => { showToast('Logged out'); go('home') }} className="press w-full mt-4 flex items-center justify-center gap-2 bg-brand-red/10 text-brand-red text-[13px] font-bold py-3.5 rounded-2xl"><Icon name="log-out-outline" style={{ fontSize: '17px' }} />Log out</button>
        <p className="text-center text-[10px] text-gray-300 mt-4">RetailOS Shop · v1.0.0</p>
      </div>
    </div>
  )
}
