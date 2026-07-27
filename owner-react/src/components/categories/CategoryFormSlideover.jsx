import { useEffect, useRef, useState } from 'react'
import Slideover from '../Slideover'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { autoSlug, catById, catDepth, catSlugPath, isSelfOrDescendant } from '../../data/categoriesData'

const FIELD = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-[46px] text-[14px] focus:outline-none focus:border-navy'
const LBL = 'block text-[11px] text-gray-500 font-medium mb-1.5'

function Form({ cats, editId, parentId, onCancel, onSave }) {
  const showToast = useToast()
  const editing = editId != null
  const cat = editing ? catById(cats, editId) : null
  const effectiveParent = cat?.parentId ?? parentId ?? ''

  const [name, setName] = useState(cat?.name || '')
  const [slug, setSlug] = useState(cat?.slug || '')
  const [parent, setParent] = useState(effectiveParent === null ? '' : String(effectiveParent))
  const [active, setActive] = useState((cat?.status || 'active') === 'active')
  const slugTouched = useRef(editing)

  const onName = (v) => {
    setName(v)
    if (!slugTouched.current) setSlug(autoSlug(v))
  }

  // Parent options exclude the category itself and its descendants (no cycles).
  const options = cats
    .filter((c) => !editing || !isSelfOrDescendant(cats, c.id, editId))
    .map((c) => ({ id: c.id, label: '\u00a0\u00a0'.repeat(catDepth(cats, c.id)) + c.name }))

  const submit = () => {
    const nm = name.trim()
    const sl = slug.trim()
    if (!nm) return showToast('Name is required', 'error')
    if (!sl) return showToast('Slug is required', 'error')
    if (!/^[a-z0-9-]+$/.test(sl)) return showToast('Slug: lowercase, numbers and hyphens only', 'error')
    const dup = cats.find((c) => c.slug === sl && c.id !== editId)
    if (dup) return showToast(`Slug already used by "${dup.name}"`, 'error')
    onSave({ name: nm, slug: sl, status: active ? 'active' : 'inactive', parentId: parent ? parseInt(parent, 10) : null }, editId)
  }

  const parentCat = parentId ? catById(cats, parentId) : null
  const title = editing ? 'Edit Category' : parentCat ? 'Add Sub-category' : 'Add Root Category'
  const subtitle = parentCat
    ? `Under: ${parentCat.name} (${catSlugPath(cats, parentCat)})`
    : editing && cat?.parentId
      ? `Under: ${catById(cats, cat.parentId)?.name || ''}`
      : 'Top-level category'

  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">{title}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className={LBL}>Name <span className="text-brand-red">*</span></label>
            <input value={name} onChange={(e) => onName(e.target.value)} placeholder="e.g. T-Shirts" className={FIELD} />
          </div>
          <div>
            <label className={LBL}>Slug <span className="text-brand-red">*</span></label>
            <input value={slug} onChange={(e) => { slugTouched.current = true; setSlug(e.target.value) }} placeholder="auto-generated" className={`${FIELD} font-mono`} />
            <p className="text-[10px] text-gray-400 mt-1">Lowercase, hyphens only · auto-filled from name</p>
          </div>
          <div>
            <label className={LBL}>Parent Category</label>
            <select value={parent} onChange={(e) => setParent(e.target.value)} className={`${FIELD} !text-[13px] cursor-pointer`}>
              <option value="">— Root (no parent) —</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 h-[54px]">
            <div>
              <p className="text-[13px] font-medium text-navy-dark">Active</p>
              <p className="text-[10px] text-gray-400">Visible on marketplace</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-navy transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <button onClick={submit} className="w-full h-[46px] bg-navy text-white text-[13px] font-semibold rounded-xl hover:bg-navy-light transition">
            {editing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </div>
    </>
  )
}

export default function CategoryFormSlideover({ item, cats, onClose, onSave }) {
  const keyRef = useRef(0)
  useEffect(() => {
    if (item) keyRef.current += 1
  }, [item])
  return (
    <Slideover
      item={item}
      onClose={onClose}
      width={480}
      render={(it) => (
        <Form key={keyRef.current} cats={cats} editId={it.editId} parentId={it.parentId} onCancel={onClose} onSave={onSave} />
      )}
    />
  )
}
