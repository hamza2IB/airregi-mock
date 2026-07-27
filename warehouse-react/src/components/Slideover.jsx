import { useEffect, useState } from 'react'

// Right-side slide-over panel with backdrop. Keeps last content mounted during
// the close animation. `item` drives open/closed; when it becomes null the panel
// slides out. `render(item)` returns the panel's inner content.
export default function Slideover({ item, onClose, width = 520, render }) {
  const [shown, setShown] = useState(item)

  useEffect(() => {
    if (item) setShown(item)
  }, [item])

  const open = !!item

  return (
    <>
      <div
        className={`fixed inset-0 z-[190] transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(10,21,53,0.35)' }}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[200] overflow-y-auto thin-scroll transition-transform duration-300 max-md:!w-screen max-md:!max-w-full ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: `${width}px`, maxWidth: '95vw', boxShadow: '-8px 0 32px rgba(10,21,53,0.12)' }}
      >
        {shown && render(shown)}
      </div>
    </>
  )
}
