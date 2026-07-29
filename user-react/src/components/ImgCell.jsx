import Icon from './Icon'
import { iconFor } from '../data/catalog'

// One image cell: centered icon placeholder (always visible) + photo layered
// on top. If the photo fails to load it hides, revealing the placeholder.
export default function ImgCell({ src, cat, color, width, height }) {
  return (
    <div className="relative bg-page overflow-hidden" style={{ width: width || undefined, height: `${height}px` }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon name={iconFor(cat)} style={{ fontSize: `${Math.round(height * 0.32)}px`, color: `${color}55` }} />
      </div>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
    </div>
  )
}
