import { createContext, useCallback, useContext, useState } from 'react'
import Icon from './Icon'

const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg) => {
    const id = ++idSeq
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2300)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div id="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Icon name="information-circle-outline" style={{ fontSize: '17px' }} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
