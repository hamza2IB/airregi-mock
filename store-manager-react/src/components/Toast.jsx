import { createContext, useCallback, useContext, useState } from 'react'
import Icon from './Icon'

const ToastContext = createContext(() => {})

export function useToast() {
  return useContext(ToastContext)
}

const STYLES = {
  success: { bg: '#dcfce7', color: '#16a34a', icon: 'checkmark-circle' },
  error: { bg: '#fee2e2', color: '#b91c1c', icon: 'close-circle' },
  warning: { bg: '#fff7ed', color: '#c2410c', icon: 'warning' },
  info: { bg: '#eff6ff', color: '#3366cc', icon: 'information-circle' },
}

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, type = 'success') => {
    const id = ++idSeq
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-md:left-3 max-md:right-3 max-md:bottom-[78px]">
        {toasts.map((t) => {
          const s = STYLES[t.type] || STYLES.info
          return (
            <div
              key={t.id}
              className="flex items-center gap-2.5 px-4 py-3 rounded-[10px] text-[13px] font-semibold min-w-[280px] max-w-[380px] max-md:min-w-0 max-md:max-w-none"
              style={{ background: s.bg, color: s.color, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            >
              <Icon name={s.icon} style={{ fontSize: '18px', flexShrink: 0 }} />
              <span>{t.msg}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
