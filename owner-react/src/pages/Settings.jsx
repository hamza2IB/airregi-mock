import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import EditProfileSlideover from '../components/settings/EditProfileSlideover'
import ChangeEmailSlideover from '../components/settings/ChangeEmailSlideover'
import ChangePasswordSlideover from '../components/settings/ChangePasswordSlideover'
import AboutSlideover from '../components/settings/AboutSlideover'
import { OWNER_PROFILE, TOS_CONTENT, PRIVACY_CONTENT, REFUND_CONTENT } from '../data/settingsContent'

function AccountRow({ icon, iconWrap, title, desc, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 bg-white border rounded-2xl px-4 py-4 transition group text-left ${danger ? 'border-brand-red/20 hover:bg-brand-red/5' : 'border-border hover:border-navy/20 hover:shadow-sm'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${iconWrap}`}>
        <Icon name={icon} style={{ fontSize: '20px' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-semibold leading-tight ${danger ? 'text-brand-red' : 'text-navy-dark'}`}>{title}</p>
        <p className={`text-[11px] mt-0.5 truncate ${danger ? 'text-brand-red/60' : 'text-gray-400'}`}>{desc}</p>
      </div>
      {!danger && <Icon name="chevron-forward-outline" className="text-gray-300 group-hover:text-navy transition shrink-0" style={{ fontSize: '16px' }} />}
    </button>
  )
}

function AboutRow({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition text-left border-b border-border last:border-b-0">
      <div className="flex items-center gap-3">
        <Icon name={icon} className="text-gray-400 shrink-0" style={{ fontSize: '16px' }} />
        <span className="text-[12.5px] font-medium text-navy-dark">{label}</span>
      </div>
      <Icon name="chevron-forward-outline" className="text-gray-300" style={{ fontSize: '14px' }} />
    </button>
  )
}

export default function Settings() {
  const showToast = useToast()
  const navigate = useNavigate()
  const [editProfile, setEditProfile] = useState(false)
  const [changeEmail, setChangeEmail] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [about, setAbout] = useState(null) // TOS/PRIVACY/REFUND content object
  const [confirm, setConfirm] = useState(null)

  const signOut = () => {
    setConfirm({
      title: 'Sign Out',
      msg: 'Are you sure you want to sign out of the Owner Portal?',
      confirmLabel: 'Sign Out',
      tone: 'danger',
      onConfirm: () => showToast('Signed out successfully', 'info'),
    })
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Profile hero */}
      <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[22px] font-extrabold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#3366cc,#1a2d6b)' }}>{OWNER_PROFILE.initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[20px] font-extrabold leading-tight">{OWNER_PROFILE.name}</p>
            <p className="text-[13px] text-white/60 mt-0.5">{OWNER_PROFILE.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold bg-brand-green/25 text-brand-green px-2.5 py-0.5 rounded-full">{OWNER_PROFILE.plan}</span>
              <span className="text-[10px] text-white/40 font-medium">{OWNER_PROFILE.business}</span>
            </div>
          </div>
          <button onClick={() => setEditProfile(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/15 shrink-0">
            <Icon name="create-outline" style={{ fontSize: '13px' }} /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-start max-md:grid-cols-1">
        {/* Account */}
        <div className="space-y-3">
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.12em] font-semibold px-1 mb-2">Account</p>
          <AccountRow icon="person-outline" iconWrap="bg-navy/10 text-navy group-hover:bg-navy/15" title="Edit Profile" desc="Update name and phone number" onClick={() => setEditProfile(true)} />
          <AccountRow icon="mail-outline" iconWrap="bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue/15" title="Change Email" desc={OWNER_PROFILE.email} onClick={() => setChangeEmail(true)} />
          <AccountRow icon="lock-closed-outline" iconWrap="bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange/15" title="Change Password" desc="Update your login password" onClick={() => setChangePassword(true)} />
          <AccountRow icon="card-outline" iconWrap="bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple/15" title="Subscription & Billing" desc="Plan, payments, renewal" onClick={() => navigate('/subscription')} />
          <div className="pt-2">
            <AccountRow icon="log-out-outline" iconWrap="bg-brand-red/10 text-brand-red group-hover:bg-brand-red/15" title="Sign Out" desc="Sign out of the owner portal" onClick={signOut} danger />
          </div>
        </div>

        {/* About */}
        <div className="space-y-3">
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.12em] font-semibold px-1 mb-2">About</p>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <Icon name="information-circle-outline" className="text-navy" style={{ fontSize: '17px' }} />
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-navy-dark">RetailOS Platform</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Version 2.4.1</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-brand-green/10 text-brand-green px-2.5 py-0.5 rounded-full">Up to date</span>
            </div>
            <AboutRow icon="document-text-outline" label="Terms of Service" onClick={() => setAbout(TOS_CONTENT)} />
            <AboutRow icon="shield-checkmark-outline" label="Privacy Policy" onClick={() => setAbout(PRIVACY_CONTENT)} />
            <AboutRow icon="return-up-back-outline" label="Refund Policy" onClick={() => setAbout(REFUND_CONTENT)} />
          </div>
        </div>
      </div>

      {/* Slideovers */}
      <EditProfileSlideover open={editProfile} onClose={() => setEditProfile(false)} />
      <ChangeEmailSlideover open={changeEmail} onClose={() => setChangeEmail(false)} />
      <ChangePasswordSlideover open={changePassword} onClose={() => setChangePassword(false)} />
      <AboutSlideover data={about} onClose={() => setAbout(null)} />
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}
