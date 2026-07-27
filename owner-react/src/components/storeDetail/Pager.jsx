import Icon from '../Icon'

// Numbered pagination control shared across store-detail tabs.
export default function Pager({ totalPages, curPage, setPage }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
        <Icon name="chevron-back-outline" style={{ fontSize: '13px' }} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`w-7 h-7 rounded-lg text-[12px] font-semibold flex items-center justify-center transition ${p === curPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'}`}
        >
          {p}
        </button>
      ))}
      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
        <Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} />
      </button>
    </div>
  )
}
