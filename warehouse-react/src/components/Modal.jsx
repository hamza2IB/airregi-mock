import { useEffect, useState } from 'react'

// Centered modal with blurred backdrop. `item` drives open/close; keeps last
// content mounted during the fade-out. `render(item)` returns the inner content.
export default function Modal({ item, onClose, maxWidth = 'max-w-md', render }) {
  const [shown, setShown] = useState(item)

  useEffect(() => {
    if (item) setShown(item)
  }, [item])

  const open = !!item

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" onClick={onClose}></div>
      <div
        className={`relative bg-white rounded-2xl w-full ${maxWidth} z-10 transition-transform duration-200 ${open ? 'scale-100' : 'scale-95'}`}
        style={{ boxShadow: '0 24px 64px rgba(10,21,53,0.22)' }}
      >
        {shown && render(shown)}
      </div>
    </div>
  )
}
