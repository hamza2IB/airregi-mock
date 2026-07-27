import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(() => {})

export function useToast() {
  return useContext(ToastContext)
}

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, type = 'success') => {
    const id = ++idSeq
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 text-white text-[13px] font-semibold px-4 py-3 rounded-2xl"
            style={{
              background: '#0a1535',
              boxShadow: '0 8px 32px rgba(10,21,53,.18)',
              borderLeft: t.type === 'success' ? '4px solid #2dd36f' : '4px solid #eb445a',
            }}
          >
            <span>{t.type === 'success' ? '✅' : '❌'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
