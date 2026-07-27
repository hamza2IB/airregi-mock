import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import PackageCard from '../components/packages/PackageCard'
import PackageFormModal from '../components/packages/PackageFormModal'
import PackageToggleModal from '../components/packages/PackageToggleModal'
import { useToast } from '../components/Toast'
import { PKG_DATA, PKG_NEW_COLORS } from '../data/packageData'

export default function Packages() {
  const showToast = useToast()
  const [packages, setPackages] = useState(() => PKG_DATA.map((p) => ({ ...p })))
  const [formOpen, setFormOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState(null)
  const [togglePkg, setTogglePkg] = useState(null)

  const totalSubs = useMemo(() => packages.reduce((sum, p) => sum + p.activeSubs, 0), [packages])

  const openCreate = () => {
    setEditingPkg(null)
    setFormOpen(true)
  }

  const openEdit = (p) => {
    setEditingPkg(p)
    setFormOpen(true)
  }

  const handleSave = (payload, id) => {
    if (id) {
      setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...payload } : p)))
      showToast(`${payload.name} package updated. Existing subscribers are unaffected.`, 'success')
    } else {
      setPackages((prev) => {
        const c = PKG_NEW_COLORS[prev.length % PKG_NEW_COLORS.length]
        return [...prev, { id: Date.now(), ...payload, activeSubs: 0, ...c }]
      })
      showToast(`${payload.name} package created.`, 'success')
    }
    setFormOpen(false)
    setEditingPkg(null)
  }

  const handleToggle = (pkg) => {
    const nextEnabled = !pkg.enabled
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, enabled: nextEnabled } : p)))
    setTogglePkg(null)
    showToast(`${pkg.name} package ${nextEnabled ? 'enabled' : 'disabled'}.`, nextEnabled ? 'success' : 'error')
  }

  return (
    <div className="adm-content p-8 max-md:p-4">
      {/* Header row: summary + create button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-[12px] text-gray-500">
            <span className="font-bold text-navy-dark">{totalSubs}</span> active subscriptions across{' '}
            <span className="font-bold text-navy-dark">{packages.length}</span> packages
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition"
        >
          <Icon name="add-outline" style={{ fontSize: '16px' }} /> Create Package
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Editing a package's price or limits only affects <strong className="text-navy-dark">new subscribers</strong>.
          Businesses already subscribed keep their existing terms until they renew.
        </p>
      </div>

      {/* Package cards grid */}
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        {packages.map((p) => (
          <PackageCard key={p.id} p={p} onEdit={openEdit} onToggle={setTogglePkg} />
        ))}
      </div>

      {/* Modals */}
      <PackageFormModal
        open={formOpen}
        pkg={editingPkg}
        onClose={() => {
          setFormOpen(false)
          setEditingPkg(null)
        }}
        onSave={handleSave}
      />
      <PackageToggleModal pkg={togglePkg} onClose={() => setTogglePkg(null)} onConfirm={handleToggle} />
    </div>
  )
}
