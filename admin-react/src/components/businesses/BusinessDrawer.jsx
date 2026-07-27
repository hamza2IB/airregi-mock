import { useEffect, useState } from 'react'
import Icon from '../Icon'
import { bizAvatarColor, getStoreList, STATUS_BADGE, STATUS_LABEL, PKG_COLOR } from '../../data/businessData'
import { newRegPaymentFor } from '../../data/paymentData'

// Derive the mocked profile the same way the original drawer did.
function deriveProfile(b) {
  const slug = b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const nameSlug = b.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '').slice(0, 14)
  return {
    legalName: b.name + ' (Pvt.) Ltd.',
    displayName: b.name,
    tagline:
      b.pkg === 'Enterprise'
        ? 'Retail excellence across Pakistan'
        : b.pkg === 'Pro'
          ? 'Your trusted retail partner'
          : '',
    industry: b.stores > 8 ? 'Retail & Grocery' : b.stores > 4 ? 'Fashion & Apparel' : 'Retail',
    orgType: b.pkg === 'Enterprise' ? 'Privately Held' : b.pkg === 'Pro' ? 'Partnership' : 'Sole Proprietorship',
    headOffice: b.city + ', Pakistan',
    companySize: b.staff > 100 ? '101–500 employees' : b.staff > 40 ? '11–100 employees' : '1–10 employees',
    regNumber: 'REG-' + String(b.id).padStart(5, '0') + '-PKR',
    ntn: '123456' + b.id + '-7',
    website: 'https://www.' + slug + '.pk',
    supportEmail: 'support@' + nameSlug + '.pk',
    supportPhone: '+92 300 ' + String(1000000 + b.id * 13337).slice(0, 7),
    description:
      b.pkg === 'Starter'
        ? ''
        : 'A leading retail brand operating across multiple cities in Pakistan, committed to quality products and excellent customer service.',
    facebook: b.pkg !== 'Starter' ? 'https://facebook.com/' + nameSlug : '',
    instagram: b.pkg !== 'Starter' ? 'https://instagram.com/' + nameSlug : '',
    linkedin: b.pkg === 'Enterprise' ? 'https://linkedin.com/company/' + slug : '',
    youtube: '',
    tiktok: '',
  }
}

function ownerEmailOf(b) {
  return (
    b.ownerEmail ||
    b.owner.split(' ').join('.').toLowerCase() +
      '@' +
      b.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '').slice(0, 12) +
      '.com'
  )
}

function Field({ label, value }) {
  const empty = !value || String(value).trim() === ''
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100/80 last:border-0">
      <span className="text-[11px] text-gray-400 shrink-0 leading-5">{label}</span>
      {empty ? (
        <span className="text-[11px] text-gray-300 italic">Not provided</span>
      ) : (
        <span className="text-[11px] font-semibold text-navy-dark text-right leading-5 break-all">{value}</span>
      )}
    </div>
  )
}

const LINK_META = {
  Facebook: { icon: 'logo-facebook', color: '#1877f2' },
  Instagram: { icon: 'logo-instagram', color: '#e1306c' },
  LinkedIn: { icon: 'logo-linkedin', color: '#0a66c2' },
  YouTube: { icon: 'logo-youtube', color: '#ff0000' },
  TikTok: { icon: 'musical-notes-outline', color: '#010101' },
  Website: { icon: 'globe-outline', color: '#3366cc' },
}

function LinkField({ label, url }) {
  const empty = !url || url.trim() === ''
  const meta = LINK_META[label] || { icon: 'link-outline', color: '#3366cc' }
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100/80 last:border-0">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: meta.color + '18' }}
      >
        <Icon name={meta.icon} style={{ fontSize: '14px', color: meta.color }} />
      </div>
      <span className="text-[11px] text-gray-400 w-[72px] shrink-0">{label}</span>
      {empty ? (
        <span className="text-[11px] text-gray-300 italic ml-auto">Not provided</span>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-semibold text-brand-blue hover:underline truncate ml-auto max-w-[150px]"
        >
          {url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
        </a>
      )}
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
          style={{ background: 'rgba(26,45,107,0.08)' }}
        >
          <Icon name={icon} style={{ fontSize: '11px', color: '#1a2d6b' }} />
        </div>
        <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.1em]">{title}</p>
      </div>
      <div className="bg-white rounded-xl border border-border px-4">{children}</div>
    </div>
  )
}

function SubscriptionExpiry({ b }) {
  if (b.status === 'pending') {
    return <span className="text-[12px] text-brand-purple font-medium">Awaiting approval</span>
  }
  if (b.status === 'banned') {
    return <span className="text-[12px] text-brand-red font-semibold">Expired — {b.subEnd}</span>
  }
  const col = b.daysLeft <= 2 ? 'text-brand-red' : b.daysLeft <= 7 ? 'text-brand-orange' : 'text-gray-700'
  return (
    <>
      <span className={`text-[12px] font-semibold ${col}`}>Expires {b.subEnd}</span>
      <span className={`text-[11px] font-medium ml-1 ${col}`}>({b.daysLeft}d remaining)</span>
    </>
  )
}

function StoreCard({ s, index }) {
  const isActive = s.status === 'active'
  const accentColor = isActive ? '#2dd36f' : '#cbd5e1'
  return (
    <div
      className={`rounded-xl border overflow-hidden ${isActive ? 'border-border bg-white' : 'border-gray-100 bg-gray-50/60'}`}
      style={{ opacity: isActive ? 1 : 0.65 }}
    >
      <div className="flex items-stretch">
        <div className="w-1 shrink-0" style={{ background: accentColor }}></div>
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0"
                style={{ background: bizAvatarColor(s.name) }}
              >
                {index + 1}
              </div>
              <p className="text-[12.5px] font-bold text-navy-dark truncate leading-tight">{s.name}</p>
            </div>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isActive ? 'text-brand-green bg-brand-green/10' : 'text-gray-400 bg-gray-200'}`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-start gap-1.5 mb-3">
            <Icon name="location-outline" style={{ fontSize: '12px', color: '#94a3b8', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-400 leading-snug">
              {s.address}, {s.city}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-0 pt-2.5 border-t border-gray-100">
            <div className="flex items-center gap-2 min-w-0 pr-3">
              <div className="w-6 h-6 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
                <Icon name="person-outline" style={{ fontSize: '11px', color: '#3366cc' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-gray-400 leading-none mb-0.5">Manager</p>
                <p className="text-[11px] font-semibold text-navy-dark truncate">{s.manager.split(' ')[0]}</p>
              </div>
            </div>
            {isActive ? (
              <>
                <div className="flex items-center gap-2 border-l border-gray-100 px-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-purple/10 flex items-center justify-center shrink-0">
                    <Icon name="people-outline" style={{ fontSize: '11px', color: '#7c4dff' }} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 leading-none mb-0.5">Staff</p>
                    <p className="text-[12px] font-bold text-navy-dark">{s.staff}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-green/10 flex items-center justify-center shrink-0">
                    <Icon name="cash-outline" style={{ fontSize: '11px', color: '#2dd36f' }} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 leading-none mb-0.5">Cashiers</p>
                    <p className="text-[12px] font-bold text-navy-dark">{s.cashiers}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div></div>
                <div></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DrawerAction({ b, onSuspend, onReject, onReactivate, onApprove, onGoPayments }) {
  if (b.status === 'active') {
    return (
      <button
        onClick={() => onSuspend(b)}
        className="flex-1 h-9 text-[12px] font-semibold text-brand-red bg-brand-red/5 border border-brand-red/20 rounded-xl hover:bg-brand-red/10 transition flex items-center justify-center gap-1.5"
      >
        <Icon name="pause-circle-outline" style={{ fontSize: '15px' }} />
        Suspend
      </button>
    )
  }
  if (b.status === 'pending') {
    const pay = newRegPaymentFor(b.name)
    return (
      <>
        <button
          onClick={() => onReject(b)}
          className="flex-1 h-9 text-[12px] font-semibold text-brand-red bg-brand-red/5 border border-brand-red/20 rounded-xl hover:bg-brand-red/10 transition flex items-center justify-center gap-1.5"
        >
          <Icon name="ban-outline" style={{ fontSize: '15px' }} />
          Reject
        </button>
        <button
          onClick={() => onApprove(b, pay?.ref)}
          className="flex-[1.6] h-9 text-[12px] font-semibold text-white bg-brand-green rounded-xl hover:bg-brand-green/90 transition flex items-center justify-center gap-1.5"
        >
          <Icon name="checkmark-circle-outline" style={{ fontSize: '15px' }} />
          Verify &amp; Approve
        </button>
      </>
    )
  }
  if (b.status === 'suspended') {
    return (
      <button
        onClick={() => onReactivate(b)}
        className="flex-1 h-9 text-[12px] font-semibold text-brand-green bg-brand-green/5 border border-brand-green/20 rounded-xl hover:bg-brand-green/10 transition flex items-center justify-center gap-1.5"
      >
        <Icon name="play-circle-outline" style={{ fontSize: '15px' }} />
        Reactivate
      </button>
    )
  }
  if (b.status === 'banned') {
    return (
      <button
        onClick={onGoPayments}
        className="flex-1 h-9 text-[12px] font-semibold text-brand-orange bg-brand-orange/5 border border-brand-orange/20 rounded-xl hover:bg-brand-orange/10 transition flex items-center justify-center gap-1.5"
      >
        <Icon name="card-outline" style={{ fontSize: '15px' }} />
        Go to Payment Queue
      </button>
    )
  }
  return null
}

// Payment-verification card shown for pending businesses so the admin can review
// the submitted registration payment before approving.
function PendingPayment({ b, onGoPayments }) {
  const pay = newRegPaymentFor(b.name)
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(45,211,111,0.12)' }}>
            <Icon name="card-outline" style={{ fontSize: '11px', color: '#2dd36f' }} />
          </div>
          <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.1em]">Registration Payment</p>
        </div>
        <button onClick={onGoPayments} className="text-[10px] font-semibold text-brand-blue hover:underline">
          Open in Payment Queue →
        </button>
      </div>

      {pay ? (
        <div className="bg-white rounded-xl border border-border px-4">
          <Field label="Plan" value={`${pay.pkg} · ${pay.amountLabel}`} />
          <Field label="Amount" value={`Rs.${pay.amount.toLocaleString()}`} />
          <Field label="Bank" value={pay.bank} />
          <Field label="Reference #" value={pay.ref} />
          <Field label="Submitted" value={pay.submitted || pay.date} />
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-[11px] text-gray-400 shrink-0 leading-5">Receipt</span>
            {pay.receipt ? (
              <button
                onClick={() => window.alert('Opening receipt: ' + pay.receipt)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline"
              >
                <Icon name="eye-outline" style={{ fontSize: '12px' }} />
                {pay.receipt}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-brand-orange font-medium">
                <Icon name="alert-circle-outline" style={{ fontSize: '12px' }} />
                No receipt uploaded
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border px-4 py-3">
          <p className="text-[11px] text-gray-400">No payment on record for this registration.</p>
        </div>
      )}

      <div className="flex items-start gap-2 mt-3 px-1">
        <Icon name="information-circle-outline" style={{ fontSize: '13px', color: '#7c4dff', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[10.5px] text-gray-500 leading-relaxed">
          Verify the payment above, then <strong className="text-navy-dark">approve</strong> to activate the business.
          The owner sets up stores, staff and products after approval.
        </p>
      </div>
    </div>
  )
}

function DrawerContent({ b, onClose, onSuspend, onReject, onReactivate, onApprove, onGoPayments }) {
  const hasProfile = b.status !== 'pending'
  const p = hasProfile ? deriveProfile(b) : {}
  const avatar = bizAvatarColor(b.name)
  const list = hasProfile ? getStoreList(b) : []
  const activeCount = list.length ? list.filter((s) => s.status === 'active').length : null
  const inactiveCount = list.length ? list.filter((s) => s.status !== 'active').length : null

  return (
    <>
      {/* Hero header */}
      <div className="relative shrink-0">
        <div
          className="h-24 w-full relative overflow-hidden"
          style={{ background: `linear-gradient(135deg,${avatar} 0%,${avatar}bb 100%)` }}
        >
          <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255,255,255,0.13)' }}></div>
          <div style={{ position: 'absolute', top: '14px', right: '72px', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
          <div style={{ position: 'absolute', bottom: '-36px', left: '24px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(0,0,0,0.13)' }}></div>
          <div style={{ position: 'absolute', bottom: '8px', left: '130px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }}></div>
          <div style={{ position: 'absolute', bottom: '10px', right: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="location-outline" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }} />
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{b.city}</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>·</span>
            <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>
              Since {b.joined.split(' ')[2]}
            </span>
          </div>
        </div>
        <div
          className="absolute left-5 bottom-0 translate-y-1/2 w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-[20px] font-extrabold text-white"
          style={{ background: avatar }}
        >
          {b.name.charAt(0)}
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-white transition"
          style={{ background: 'rgba(0,0,0,0.22)' }}
        >
          <Icon name="close-outline" style={{ fontSize: '18px' }} />
        </button>
      </div>

      {/* Identity block */}
      <div className="px-5 pt-11 pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${PKG_COLOR[b.pkg]}`}>{b.pkg}</span>
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[b.status]}`}>
            {STATUS_LABEL[b.status]}
          </span>
          {hasProfile && p.orgType && (
            <span className="text-[9.5px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {p.orgType}
            </span>
          )}
        </div>
        <p className="text-[16px] font-extrabold text-navy-dark leading-tight tracking-tight">{b.name}</p>
        <p className="text-[11.5px] text-gray-400 mt-0.5">
          {hasProfile && p.tagline ? p.tagline : b.city + ', Pakistan'}
        </p>
        {b.status !== 'pending' && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 flex-1">
              <Icon name="storefront-outline" style={{ fontSize: '13px', color: '#94a3b8' }} />
              <span className="text-[12px] font-bold text-navy-dark">{b.stores}</span>
              <span className="text-[10px] text-gray-400">Stores</span>
            </div>
            <div className="w-px h-3.5 bg-border"></div>
            <div className="flex items-center gap-1.5 flex-1">
              <Icon name="people-outline" style={{ fontSize: '13px', color: '#94a3b8' }} />
              <span className="text-[12px] font-bold text-navy-dark">{b.staff}</span>
              <span className="text-[10px] text-gray-400">Staff</span>
            </div>
            <div className="w-px h-3.5 bg-border"></div>
            <div className="flex items-center gap-1.5 flex-1">
              <Icon name="cube-outline" style={{ fontSize: '13px', color: '#94a3b8' }} />
              <span className="text-[12px] font-bold text-navy-dark">{b.products.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400">Products</span>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 expiry-scroll">
        {b.status === 'suspended' && b.suspendReason && (
          <div className="rounded-xl border border-brand-orange/25 px-4 py-3 flex gap-3 mb-5" style={{ background: '#fff8f0' }}>
            <Icon name="warning" style={{ fontSize: '16px', color: '#ff9800', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p className="text-[11px] font-bold text-brand-orange mb-0.5">Suspended</p>
              <p className="text-[11px] text-gray-600 leading-relaxed">{b.suspendReason}</p>
            </div>
          </div>
        )}

        {b.status === 'pending' && <PendingPayment b={b} onGoPayments={onGoPayments} />}

        {b.status === 'banned' && (
          <div className="rounded-xl border border-brand-red/20 px-4 py-3 flex gap-3 mb-5" style={{ background: '#fff5f5' }}>
            <Icon name="ban-outline" style={{ fontSize: '16px', color: '#eb445a', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p className="text-[11px] font-bold text-brand-red mb-1">Subscription Expired — Business Banned</p>
              <p className="text-[11px] text-gray-600 leading-relaxed mb-2">
                This business was auto-banned when its subscription expired. Access is fully locked until a renewal
                payment is submitted by the owner and verified by admin.
              </p>
              <div className="flex items-center gap-1.5 pt-2 border-t border-brand-red/10">
                <Icon name="information-circle-outline" style={{ fontSize: '12px', color: '#eb445a', flexShrink: 0 }} />
                <p className="text-[10.5px] text-gray-500">
                  Restoration is automatic once the renewal payment is verified in the{' '}
                  <strong className="text-navy-dark">Payment Verification Queue</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Owner */}
        <Section title="Owner" icon="person-outline">
          <div className="flex items-start gap-3 py-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-extrabold text-white shrink-0"
              style={{ background: bizAvatarColor(b.owner) }}
            >
              {b.owner.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-navy-dark">{b.owner}</p>
              <p className="text-[10.5px] text-gray-400 mb-1.5">Business Owner</p>
              <a
                href={`mailto:${ownerEmailOf(b)}`}
                className="inline-flex items-center gap-1 text-[10.5px] text-brand-blue font-medium hover:underline"
              >
                <Icon name="mail-outline" style={{ fontSize: '11px', flexShrink: 0 }} />
                <span className="truncate">{ownerEmailOf(b)}</span>
              </a>
            </div>
            <div className="text-right shrink-0 pt-0.5">
              <p className="text-[9.5px] text-gray-400 mb-0.5">Joined</p>
              <p className="text-[11px] font-semibold text-navy-dark">{b.joined}</p>
            </div>
          </div>
        </Section>

        {/* Subscription */}
        <Section title="Subscription" icon="card-outline">
          <Field label="Package" value={b.pkg} />
          <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100/80 last:border-0">
            <span className="text-[11px] text-gray-400 shrink-0 leading-5">Expiry</span>
            <div className="text-right">
              <SubscriptionExpiry b={b} />
            </div>
          </div>
        </Section>

        {hasProfile && (
          <>
            <Section title="Business Identity" icon="business-outline">
              <Field label="Legal Name" value={p.legalName} />
              <Field label="Display Name" value={p.displayName} />
              <Field label="Tagline" value={p.tagline} />
              <Field label="Industry" value={p.industry} />
              <Field label="Org Type" value={p.orgType} />
              <Field label="Company Size" value={p.companySize} />
            </Section>

            <Section title="Legal & Registration" icon="document-text-outline">
              <Field label="Reg. Number" value={p.regNumber} />
              <Field label="NTN Number" value={p.ntn} />
              <Field label="Head Office" value={p.headOffice} />
            </Section>

            {p.description && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(26,45,107,0.08)' }}>
                    <Icon name="reader-outline" style={{ fontSize: '11px', color: '#1a2d6b' }} />
                  </div>
                  <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.1em]">Description</p>
                </div>
                <div className="bg-white rounded-xl border border-border px-4 py-3">
                  <p className="text-[11px] text-gray-600 leading-relaxed">{p.description}</p>
                </div>
              </div>
            )}

            <Section title="Support Contact" icon="call-outline">
              <Field label="Email" value={p.supportEmail} />
              <Field label="Phone" value={p.supportPhone} />
              <LinkField label="Website" url={p.website} />
            </Section>

            <Section title="Social Links" icon="share-social-outline">
              <LinkField label="Facebook" url={p.facebook} />
              <LinkField label="Instagram" url={p.instagram} />
              <LinkField label="LinkedIn" url={p.linkedin} />
              <LinkField label="YouTube" url={p.youtube} />
              <LinkField label="TikTok" url={p.tiktok} />
            </Section>
          </>
        )}

        {/* Stores — always last for non-pending businesses */}
        {b.status !== 'pending' && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(26,45,107,0.08)' }}>
                  <Icon name="storefront-outline" style={{ fontSize: '11px', color: '#1a2d6b' }} />
                </div>
                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.1em]">Stores</p>
              </div>
              <div className="flex items-center gap-1.5">
                {list.length ? (
                  <>
                    <span className="text-[9.5px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                      {activeCount} active
                    </span>
                    {inactiveCount > 0 && (
                      <span className="text-[9.5px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {inactiveCount} inactive
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[9.5px] text-gray-400">{b.stores} total</span>
                )}
              </div>
            </div>
            {list.length ? (
              <div className="space-y-2.5">
                {list.map((s, i) => (
                  <StoreCard key={s.name} s={s} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border px-4 py-3 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Total stores</span>
                <span className="text-[12px] font-bold text-navy-dark">{b.stores}</span>
              </div>
            )}
          </div>
        )}

        <div style={{ height: '4px' }}></div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-border bg-gray-50/70 flex items-center gap-2 shrink-0">
        <button
          onClick={onClose}
          className="flex-1 h-9 text-[12px] font-semibold text-gray-500 bg-white border border-border rounded-xl hover:bg-gray-50 transition"
        >
          Close
        </button>
        <DrawerAction b={b} onSuspend={onSuspend} onReject={onReject} onReactivate={onReactivate} onApprove={onApprove} onGoPayments={onGoPayments} />
      </div>
    </>
  )
}

export default function BusinessDrawer({ biz, onClose, onSuspend, onReject, onReactivate, onApprove, onGoPayments }) {
  // Keep last business rendered during the slide-out animation.
  const [shown, setShown] = useState(biz)
  useEffect(() => {
    if (biz) setShown(biz)
  }, [biz])

  const open = !!biz

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[900] transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(10,21,53,0.4)' }}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-page z-[901] flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {shown && (
          <DrawerContent
            b={shown}
            onClose={onClose}
            onSuspend={onSuspend}
            onReject={onReject}
            onReactivate={onReactivate}
            onApprove={onApprove}
            onGoPayments={onGoPayments}
          />
        )}
      </div>
    </>
  )
}
