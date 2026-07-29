import Icon from './Icon'
import { useApp } from '../store'

// Sticky sub-page header with a back button, title and optional subtitle.
export default function SubHeader({ title, sub, children }) {
  const { back } = useApp()
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-border px-4 pt-11 pb-3">
      <div className="flex items-center gap-3">
        <button onClick={back} className="w-9 h-9 rounded-xl bg-page border border-border flex items-center justify-center press shrink-0">
          <Icon name="chevron-back-outline" className="text-navy" style={{ fontSize: '17px' }} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[16px] font-extrabold text-navy-dark leading-tight truncate">{title}</h1>
          {sub && <p className="text-[10.5px] text-gray-400 leading-tight truncate">{sub}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
