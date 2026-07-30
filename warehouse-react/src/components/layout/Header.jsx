import Icon from '../Icon'

export default function Header({ meta, alerts = 7, onOpenMobileSidebar, onAlerts, onScan }) {
  return (
    <header
      className="bg-white border-b border-border sticky top-0 z-40"
      style={{ boxShadow: '0 1px 0 #e8ecf1,0 4px 12px rgba(10,21,53,.04)' }}
    >
      <div className="flex items-center gap-4 px-8 max-md:px-4 max-md:gap-2.5" style={{ height: '64px' }}>
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden w-[38px] h-[38px] rounded-[10px] bg-page border border-border flex items-center justify-center shrink-0"
        >
          <Icon name="menu-outline" style={{ fontSize: '20px', color: '#1a2d6b' }} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] font-medium text-gray-400 max-md:text-[10px]">{meta.section}</span>
            <Icon name="chevron-forward-outline" style={{ fontSize: '10px', color: '#cbd5e1', flexShrink: 0 }} />
            <span className="text-[11px] font-semibold text-gray-500 truncate max-md:text-[10px]">{meta.page}</span>
          </div>
          <h1 className="text-[17px] font-extrabold text-navy-dark leading-none max-md:text-[15px]" style={{ letterSpacing: '-.4px' }}>
            {meta.heading}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onScan}
            title="Scan to check stock"
            className="w-9 h-9 rounded-xl bg-page border border-border flex items-center justify-center hover:bg-white transition"
          >
            <Icon name="scan-outline" className="text-navy" style={{ fontSize: '18px' }} />
          </button>
          <button
            onClick={onAlerts}
            className="relative w-9 h-9 rounded-xl bg-page border border-border flex items-center justify-center hover:bg-white transition"
          >
            <Icon name="alert-circle-outline" className="text-brand-orange" style={{ fontSize: '18px' }} />
            {alerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red rounded-full text-[9px] font-extrabold text-white flex items-center justify-center">{alerts}</span>
            )}
          </button>
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-page transition">
            <div
              className="shrink-0"
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c4dff,#3366cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' }}
            >
              ZK
            </div>
            <div className="max-md:hidden">
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0a1535', lineHeight: 1.25, whiteSpace: 'nowrap' }}>Zain Khan</div>
              <div style={{ fontSize: '10.5px', fontWeight: 500, color: '#94a3b8', lineHeight: 1.25 }}>Warehouse Manager</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
