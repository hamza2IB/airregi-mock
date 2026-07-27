import Icon from '../components/Icon'

const FEATURES = [
  { icon: 'business-outline', text: 'Manage every business & store from one place' },
  { icon: 'card-outline', text: 'Verify subscription payments in seconds' },
  { icon: 'trending-up-outline', text: 'Track platform revenue & growth' },
]

// Split-screen auth layout: navy brand panel (left) + form area (right).
export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="relative w-[46%] shrink-0 bg-navy-dark overflow-hidden max-lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy"></div>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
        <div style={{ position: 'absolute', bottom: '-120px', left: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(0,0,0,0.18)' }}></div>
        <div style={{ position: 'absolute', top: '30%', left: '60%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(51,102,204,0.25)' }}></div>

        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Icon name="shield-checkmark" className="text-navy" style={{ fontSize: '24px' }} />
            </div>
            <div>
              <p className="text-white font-bold text-[17px] leading-tight">RetailOS</p>
              <p className="text-white/40 text-[11px] tracking-wider uppercase">Admin Portal</p>
            </div>
          </div>

          {/* Headline + features */}
          <div>
            <h1 className="text-white text-[30px] font-extrabold leading-tight tracking-tight mb-3" style={{ letterSpacing: '-0.5px' }}>
              The command center for your retail platform.
            </h1>
            <p className="text-white/55 text-[13px] leading-relaxed mb-8 max-w-sm">
              Oversee businesses, verify payments, and keep the whole platform running — all from one secure dashboard.
            </p>
            <div className="space-y-3.5">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon name={f.icon} className="text-white" style={{ fontSize: '16px' }} />
                  </div>
                  <p className="text-white/75 text-[12.5px] font-medium">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/30 text-[11px]">© 2026 RetailOS Technologies. All rights reserved.</p>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center p-6 bg-page">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="hidden max-lg:flex items-center gap-2.5 justify-center mb-8">
            <div className="w-10 h-10 bg-navy-dark rounded-xl flex items-center justify-center shrink-0">
              <Icon name="shield-checkmark" className="text-white" style={{ fontSize: '20px' }} />
            </div>
            <div>
              <p className="text-navy-dark font-bold text-[15px] leading-tight">RetailOS</p>
              <p className="text-gray-400 text-[10px] tracking-wider uppercase">Admin Portal</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
