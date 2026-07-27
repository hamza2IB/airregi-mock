import Icon from '../Icon'

export default function Header({ meta }) {
  return (
    <header
      className="adm-header bg-white border-b border-border sticky top-0 z-40"
      style={{ boxShadow: '0 1px 0 #e8ecf1,0 4px 12px rgba(10,21,53,.04)' }}
    >
      <div className="flex items-center gap-4 px-8 max-md:px-4" style={{ height: '64px' }}>
        {/* Page title + breadcrumb */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] font-medium text-gray-400 cursor-pointer hover:text-navy transition">
              {meta.section}
            </span>
            <Icon name="chevron-forward-outline" style={{ fontSize: '10px', color: '#cbd5e1', flexShrink: 0 }} />
            <span className="text-[11px] font-semibold text-gray-500 truncate">{meta.title}</span>
          </div>
          <h1
            className="text-[17px] font-extrabold text-navy-dark leading-none max-md:text-[16px]"
            style={{ letterSpacing: '-.4px' }}
          >
            {meta.heading}
          </h1>
        </div>

        {/* User chip */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-page transition">
            <div
              className="shrink-0"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#2dd36f,#23b55a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              SA
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0a1535', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
                Super Admin
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 500, color: '#94a3b8', lineHeight: 1.25 }}>
                Platform Admin
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
