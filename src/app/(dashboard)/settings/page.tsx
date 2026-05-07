'use client'
// src/app/(dashboard)/settings/page.tsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CheckIcon, SpinnerIcon } from '@/components/icons'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { address, isConnected }  = useAccount()

  const [form, setForm]       = useState({ name: '', email: '', username: '' })
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [toggles, setToggles] = useState({ email: true, auto: false, notify: true })
  const [toast, setToast]     = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400) }

  useEffect(() => {
    if (session?.user) {
      setForm({
        name:     session.user.name     || '',
        email:    session.user.email    || '',
        username: session.user.username || '',
      })
    }
  }, [session])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        await update({ name: form.name })
        setSaved(true)
        showToast('Profile saved!')
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  const toggle = (k: string) => setToggles(t => ({ ...t, [k]: !t[k as keyof typeof t] }))

  return (
    <div className="dash-main">
      <div className="dash-header anim-fade-up">
        <div>
          <div className="dash-title">Settings</div>
          <div className="dash-sub">Manage your account and preferences</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="settings-grid">

        {/* Profile */}
        <div className="card anim-fade-up d-1">
          <div className="settings-section-title">Profile</div>
          {[
            { label: 'Full Name', key: 'name',     type: 'text',  placeholder: 'Your name' },
            { label: 'Email',     key: 'email',    type: 'email', placeholder: 'you@example.com' },
            { label: 'Username',  key: 'username', type: 'text',  placeholder: 'yourhandle' },
          ].map(f => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" type={f.type} placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}/>
              {f.key === 'username' && (
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5 }}>
                  Your payment page: ojapay.xyz/pay/{form.username || 'yourhandle'}
                </div>
              )}
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 8 }} onClick={saveProfile} disabled={saving}>
            {saving ? <><SpinnerIcon size={15}/>Saving...</> : saved ? <><CheckIcon size={15}/>Saved!</> : <><CheckIcon size={15}/>Save Changes</>}
          </button>
        </div>

        <div>
          {/* Wallet */}
          <div className="card anim-fade-up d-2" style={{ marginBottom: 16 }}>
            <div className="settings-section-title">Wallet — Receive Payments</div>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
              Connect your Base wallet to receive USDC payments. All payments go directly to this address.
            </p>
            {isConnected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 'var(--r-sm)', background: 'var(--bg3)', border: '1px solid var(--border2)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--purple))', flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-h)' }}>
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Base Network · Connected</div>
                </div>
                <span className="badge badge-green">✓ Active</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '13px 15px', borderRadius: 'var(--r-sm)', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', fontSize: 13, color: 'var(--orange)' }}>
                  ⚠️ No wallet connected — you won't receive payments until you connect one.
                </div>
                <ConnectButton />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="card anim-fade-up d-3">
            <div className="settings-section-title">Notifications</div>
            {[
              { k: 'email',  label: 'Email notifications', desc: 'Get notified via email when you receive a payment' },
              { k: 'auto',   label: 'Auto-expire links',   desc: 'Automatically expire links after the set duration' },
              { k: 'notify', label: 'Payment alerts',      desc: 'Instant alerts when payments are completed' },
            ].map(t => (
              <div className="toggle" key={t.k}>
                <div>
                  <div className="toggle-label">{t.label}</div>
                  <div className="toggle-desc">{t.desc}</div>
                </div>
                <button className={`toggle-switch${toggles[t.k as keyof typeof toggles] ? '' : ' off'}`}
                  onClick={() => toggle(t.k)}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast"><CheckIcon size={15} color="var(--green)"/>{toast}</div>
      )}
    </div>
  )
}
