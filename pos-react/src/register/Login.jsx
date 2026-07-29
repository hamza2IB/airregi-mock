import { useRef, useState } from 'react'
import { useStore } from './store.jsx'
import { STAFF_CREDENTIALS } from '../shared/catalog.js'

export default function Login() {
  const { login } = useStore()
  const [error, setError] = useState('')
  const userRef = useRef(null)
  const pinRef = useRef(null)

  const doLogin = () => {
    const user = (userRef.current.value || '').trim().toLowerCase()
    const pin = (pinRef.current.value || '').trim()
    if (!user || !pin) return setError('Please enter both username and PIN')
    const staff = STAFF_CREDENTIALS.find((s) => s.username === user && s.pin === pin)
    if (!staff) { setError('Invalid credentials. Try again.'); pinRef.current.value = ''; return }
    setError(''); login(staff)
  }
  const fillDemo = (u, p) => { userRef.current.value = u; pinRef.current.value = p; setError('') }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Branding */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1535 0%, #1a2d6b 50%, #2a4494 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-12 left-12 w-44 h-44 border-2 border-white rounded-3xl rotate-12" />
          <div className="absolute bottom-16 right-12 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute top-1/3 right-16 w-28 h-28 border-2 border-white rounded-2xl -rotate-6" />
          <div className="absolute bottom-1/3 left-20 w-20 h-20 border-2 border-white rounded-xl rotate-45" />
        </div>
        <div className="relative z-10 text-center px-10">
          <div className="w-28 h-28 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
            <ion-icon name="storefront" class="text-white" style={{ fontSize: '80px' }}></ion-icon>
          </div>
          <h1 className="text-[36px] font-extrabold text-white tracking-tight">Clifton Mart</h1>
          <p className="text-[16px] text-white/50 mt-2 font-medium">Point of Sale · Register Terminal</p>
          <div className="mt-10 flex items-center justify-center gap-8 text-white/40 text-[13px]">
            <div className="flex items-center gap-2">
              <ion-icon name="shield-checkmark-outline" class="text-xl text-green-400/60"></ion-icon>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <ion-icon name="cloud-done-outline" class="text-xl text-blue-300/60"></ion-icon>
              <span>Cloud Synced</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 text-center">
          <p className="text-[12px] text-white/20 font-medium">Powered by Air Register · v3.0</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 lg:flex-none lg:w-[540px] min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 shrink-0 bg-white lg:shadow-2xl">
        <div className="lg:hidden text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1535, #1a2d6b)' }}>
            <ion-icon name="storefront" class="text-white" style={{ fontSize: '40px' }}></ion-icon>
          </div>
          <h1 className="text-[22px] font-bold text-navy">Clifton Mart</h1>
          <p className="text-[13px] text-gray-400 mt-1">POS Register · Sign In</p>
        </div>
        <div className="w-full max-w-[340px]">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-black">Welcome back</h2>
            <p className="text-[13px] lg:text-[14px] text-gray-500 mt-1.5">Sign in to start your shift</p>
          </div>
          <div className="mb-4 lg:mb-5">
            <label className="block text-[13px] text-gray-500 mb-2 font-medium">Staff Username</label>
            <div className="relative">
              <ion-icon name="person-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none"></ion-icon>
              <input ref={userRef} type="text" placeholder="e.g. hamza"
                onKeyDown={(e) => e.key === 'Enter' && pinRef.current.focus()}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-5 h-[52px] lg:h-[54px] text-[16px] focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-colors" />
            </div>
          </div>
          <div className="mb-5 lg:mb-7">
            <label className="block text-[13px] text-gray-500 mb-2 font-medium">PIN Code</label>
            <div className="relative">
              <ion-icon name="lock-closed-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none"></ion-icon>
              <input ref={pinRef} type="password" placeholder="••••" maxLength={6}
                onKeyDown={(e) => e.key === 'Enter' && doLogin()}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-5 h-[52px] lg:h-[54px] text-[20px] font-mono tracking-[0.3em] focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-colors" />
            </div>
          </div>
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-brand-red font-medium flex items-center justify-center gap-2">
              <ion-icon name="alert-circle-outline" class="text-lg shrink-0"></ion-icon>
              <span>{error}</span>
            </div>
          )}
          <button onClick={doLogin} className="tap-btn w-full h-[54px] lg:h-[56px] bg-navy text-white text-[15px] lg:text-[16px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-navy/30 hover:shadow-xl transition-shadow">
            <ion-icon name="log-in-outline" style={{ fontSize: '22px' }}></ion-icon> Sign In
          </button>
          <div className="mt-6 lg:mt-8 pt-5 lg:pt-6 border-t border-gray-100">
            <p className="text-[12px] text-gray-400 text-center mb-3">Quick demo login:</p>
            <div className="grid grid-cols-3 gap-2">
              {STAFF_CREDENTIALS.map((s) => (
                <button key={s.id} onClick={() => fillDemo(s.username, s.pin)}
                  className="tap-btn px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-center hover:bg-navy/5 hover:border-navy/30 transition-colors">
                  <p className="text-[13px] font-semibold text-black">{s.username}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.pin}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
