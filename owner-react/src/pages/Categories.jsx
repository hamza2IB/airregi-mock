import { useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import CategoryFormSlideover from '../components/categories/CategoryFormSlideover'
import {
  INITIAL_CATEGORIES,
  CAT_AVATAR_BG,
  CAT_BAR_COLOR,
  catChildren,
  catById,
  catSlugPath,
  catDescendantCount,
} from '../data/categoriesData'

function Kpi({ value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 text-center">
      <p className={`text-[22px] font-extrabold ${valueCls}`}>{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function Categories() {
  const showToast = useToast()
  const [cats, setCats] = useState(INITIAL_CATEGORIES)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(() => new Set(INITIAL_CATEGORIES.filter((c) => c.parentId === null).map((c) => c.id)))
  const [menu, setMenu] = useState(null) // { id, x, y }
  const [form, setForm] = useState(null) // { editId, parentId }
  const [confirm, setConfirm] = useState(null)

  const total = cats.length
  const active = cats.filter((c) => c.status === 'active').length
  const roots = catChildren(cats, null)

  const q = search.toLowerCase().trim()

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const openMenu = (id, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const menuW = 220
    let left = rect.right - menuW
    let top = rect.bottom + 6
    if (left < 8) left = 8
    if (top + 240 > window.innerHeight) top = rect.top - 240
    setMenu({ id, x: left, y: top })
  }

  const doToggleStatus = (id) => {
    const cat = catById(cats, id)
    if (!cat) return
    const ns = cat.status === 'active' ? 'inactive' : 'active'
    const ids = new Set()
    const recurse = (cid) => {
      ids.add(cid)
      catChildren(cats, cid).forEach((ch) => recurse(ch.id))
    }
    recurse(id)
    setCats((prev) => prev.map((c) => (ids.has(c.id) ? { ...c, status: ns } : c)))
    const n = catDescendantCount(cats, id)
    showToast(`${cat.name} ${ns === 'active' ? 'activated' : 'deactivated'}${n > 0 ? ` (+${n} sub-categor${n > 1 ? 'ies' : 'y'})` : ''}`, ns === 'active' ? 'success' : 'info')
  }

  const doDelete = (id) => {
    const cat = catById(cats, id)
    if (!cat) return
    const n = catDescendantCount(cats, id)
    setConfirm({
      title: `Delete "${cat.name}"?`,
      msg: n > 0 ? `Has ${n} nested sub-categor${n > 1 ? 'ies' : 'y'} — all will be deleted.` : `"${cat.name}" will be removed.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: () => {
        const ids = new Set()
        const collect = (cid) => {
          ids.add(cid)
          catChildren(cats, cid).forEach((ch) => collect(ch.id))
        }
        collect(id)
        setCats((prev) => prev.filter((c) => !ids.has(c.id)))
        setExpanded((prev) => {
          const next = new Set(prev)
          ids.forEach((i) => next.delete(i))
          return next
        })
        showToast(`"${cat.name}" deleted`, 'success')
      },
    })
  }

  const handleSave = (payload, editId) => {
    if (editId != null) {
      setCats((prev) => prev.map((c) => (c.id === editId ? { ...c, ...payload } : c)))
      showToast(`"${payload.name}" updated`, 'success')
    } else {
      setCats((prev) => {
        const newId = Math.max(0, ...prev.map((c) => c.id)) + 1
        const siblings = prev.filter((c) => c.parentId === payload.parentId)
        return [...prev, { id: newId, sortOrder: siblings.length, ...payload }]
      })
      if (payload.parentId) setExpanded((prev) => new Set(prev).add(payload.parentId))
      showToast(`"${payload.name}" created`, 'success')
    }
    setForm(null)
  }

  // Build the rendered rows (nested or flat search results).
  let rows = []
  if (q) {
    const matches = cats.filter(
      (c) => (filter === 'all' || c.status === filter) && (c.name.toLowerCase().includes(q) || c.slug.includes(q))
    )
    rows = matches.map((c) => ({ cat: c, depth: 0, flat: true }))
  } else {
    const walk = (parentId, depth) => {
      catChildren(cats, parentId).forEach((c) => {
        if (filter !== 'all' && c.status !== filter) return
        rows.push({ cat: c, depth, flat: false })
        if (catChildren(cats, c.id).length > 0 && expanded.has(c.id)) walk(c.id, depth + 1)
      })
    }
    walk(null, 0)
  }

  const menuCat = menu ? catById(cats, menu.id) : null

  return (
    <div className="p-8 max-md:p-3.5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
        <Kpi value={total} valueCls="text-navy-dark" label="Total" />
        <Kpi value={active} valueCls="text-brand-green" label="Active" />
        <Kpi value={total - active} valueCls="text-gray-400" label="Inactive" />
        <Kpi value={roots.length} valueCls="text-navy-dark" label="Root Categories" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Icon name="search-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '15px' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 h-[42px] text-[13px] text-navy-dark placeholder-gray-400 focus:outline-none focus:border-navy"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1">
          {['all', 'active', 'inactive'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`period-tab ${filter === f ? 'active' : ''}`}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => setForm({ editId: null, parentId: null })} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-navy-light transition shrink-0">
          <Icon name="add-outline" style={{ fontSize: '18px' }} /> Add Root Category
        </button>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-xl border border-border overflow-hidden p-4">
        <div className="space-y-1.5 pt-2">
          {rows.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-gray-400">{q ? 'No categories found' : 'No categories yet'}</p>
              {!q && (
                <button onClick={() => setForm({ editId: null, parentId: null })} className="mt-3 text-[12px] font-semibold text-brand-blue hover:underline">Add Root Category →</button>
              )}
            </div>
          ) : (
            rows.map(({ cat, depth, flat }) => (
              <CatRow
                key={cat.id}
                cat={cat}
                depth={depth}
                flat={flat}
                cats={cats}
                expanded={expanded}
                onToggleExpand={toggleExpand}
                onMenu={openMenu}
              />
            ))
          )}
        </div>
      </div>

      {/* Actions popover */}
      {menu && menuCat && (
        <>
          <div className="fixed inset-0 z-[490]" onClick={() => setMenu(null)}></div>
          <div className="fixed z-[500]" style={{ left: menu.x, top: menu.y, minWidth: 220 }}>
            <div className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-[13px] font-bold text-navy-dark leading-tight">{menuCat.name}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{catSlugPath(cats, menuCat)}</p>
              </div>
              <div className="py-1">
                <button onClick={() => { setForm({ editId: null, parentId: menu.id }); setMenu(null) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-left transition">
                  <Icon name="add-circle-outline" className="text-navy shrink-0" style={{ fontSize: '16px' }} />
                  <span className="text-[12px] font-medium text-navy-dark">Add Sub-Category</span>
                </button>
                <button onClick={() => { setForm({ editId: menu.id, parentId: null }); setMenu(null) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-left transition">
                  <Icon name="create-outline" className="text-navy shrink-0" style={{ fontSize: '16px' }} />
                  <span className="text-[12px] font-medium text-navy-dark">Edit Category</span>
                </button>
                <button onClick={() => { const id = menu.id; setMenu(null); doToggleStatus(id) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-left transition">
                  {menuCat.status === 'active' ? (
                    <>
                      <Icon name="eye-off-outline" className="text-brand-orange shrink-0" style={{ fontSize: '16px' }} />
                      <span className="text-[12px] font-medium text-brand-orange">Deactivate</span>
                    </>
                  ) : (
                    <>
                      <Icon name="eye-outline" className="text-brand-green shrink-0" style={{ fontSize: '16px' }} />
                      <span className="text-[12px] font-medium text-brand-green">Activate</span>
                    </>
                  )}
                </button>
                <div className="mx-3 my-1 h-px bg-gray-100"></div>
                <button onClick={() => { const id = menu.id; setMenu(null); doDelete(id) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-left transition">
                  <Icon name="trash-outline" className="text-brand-red shrink-0" style={{ fontSize: '16px' }} />
                  <span className="text-[12px] font-medium text-brand-red">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <CategoryFormSlideover item={form} cats={cats} onClose={() => setForm(null)} onSave={handleSave} />
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}

function CatRow({ cat, depth, flat, cats, expanded, onToggleExpand, onMenu }) {
  const hasKids = catChildren(cats, cat.id).length > 0
  const isOpen = expanded.has(cat.id)
  const sub = catChildren(cats, cat.id).length
  const indent = flat ? 0 : depth * 20
  const avatarBg = CAT_AVATAR_BG[Math.min(depth, CAT_AVATAR_BG.length - 1)]
  const barColor = CAT_BAR_COLOR[Math.min(depth, CAT_BAR_COLOR.length - 1)]
  const init = (cat.name || '?').charAt(0).toUpperCase()
  const chev = isOpen && hasKids ? 'chevron-down-outline' : 'chevron-forward-outline'

  return (
    <div className={`relative bg-white rounded-2xl border border-border overflow-visible ${cat.status === 'active' ? '' : 'opacity-55'}`} style={{ marginLeft: indent }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: barColor, opacity: 0.5 }}></div>
      <div className="flex items-center gap-2.5 px-3 py-3 pl-4">
        <button onClick={() => onToggleExpand(cat.id)} className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${hasKids ? 'hover:bg-gray-100' : 'pointer-events-none opacity-0'}`}>
          <Icon name={chev} className="text-gray-400" style={{ fontSize: '14px' }} />
        </button>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-[13px] text-white" style={{ background: avatarBg }}>{init}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[13px] font-bold text-navy-dark">{cat.name}</p>
            {cat.status === 'active' ? (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-brand-green bg-brand-green/10">Active</span>
            ) : (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-gray-400 bg-gray-100">Inactive</span>
            )}
            {sub > 0 && <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{sub} sub{sub > 1 ? 's' : ''}</span>}
          </div>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{catSlugPath(cats, cat)}</p>
        </div>
        <button onClick={(e) => onMenu(cat.id, e)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 hover:bg-gray-200 transition">
          <Icon name="ellipsis-vertical" className="text-gray-500" style={{ fontSize: '14px' }} />
        </button>
      </div>
    </div>
  )
}
