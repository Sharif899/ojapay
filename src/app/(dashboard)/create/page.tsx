'use client'
// src/app/(dashboard)/create/page.tsx
import { useState } from 'react'
import { LinkIcon, CopyIcon, ShareIcon, CheckIcon, SpinnerIcon } from '@/components/icons'
import Link from 'next/link'

export default function CreatePage() {
  const [form, setForm]       = useState({ service: '', amount: '', currency: 'USDC', description: '', expiry: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<{ url: string; slug: string } | null>(null)
  const [error, setError]     = useState('')
  const [copied, setCopied]   = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.service.trim() && parseFloat(form.amount) > 0

  const getExpiryDate = () => {
    if (!form.expiry) return undefined
    const days = parseInt(form.expiry)
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString()
  }

  const handleCreate = async () => {
    if (!valid) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service:     form.service,
          amount:      parseFloat(form.amount),
          currency:    form.currency,
          description: form.description || undefined,
          expiresAt:   getExpiryDate(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create link')
      setResult({ url: data.url, slug: data.slug })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (!result) return
    navigator.clipboard?.writeText(result.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result) return (
    <div className="dash-main" style={{ maxWidth: 520 }}>
      <div className="card anim-scale-in" style={{ textAlign: 'center', padding: '44px 36px' }}>
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(34,200,122,0.12)', border: '2.5px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round">
            <path className="success-check" d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Link Created!</div>
        <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Your payment link is live and ready to share.</div>

        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderRadius: 'var(--r-sm)', background: 'var(--bg3)', border: '1px solid var(--border2)', marginBottom: 20, alignItems: 'center' }}>
          <div style={{ flex: 1, fontSize: 13, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
            {result.url}
          </div>
          <button className="copy-btn" style={{ padding: '7px 14px', fontSize: 12 }} onClick={copyLink}>
            {copied ? <><CheckIcon size={13} color="#fff"/>Copied!</> : <><CopyIcon size={13} color="#fff"/>Copy</>}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a href={`/pay/${result.slug}`} target="_blank" rel="noopener noreferrer"
            className="btn-primary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
            <ShareIcon size={14}/>Preview Page
          </a>
          <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => { setResult(null); setForm({ service: '', amount: '', currency: 'USDC', description: '', expiry: '' }) }}>
            Create Another
          </button>
        </div>

        <Link href="/payments" style={{ display: 'block', marginTop: 16, color: 'var(--blue2)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          View all payment links →
        </Link>
      </div>
    </div>
  )

  return (
    <div className="dash-main" style={{ maxWidth: 520 }}>
      <div className="dash-header anim-fade-up">
        <div>
          <div className="dash-title">Create Payment Link</div>
          <div className="dash-sub">Create a link and get paid by your customers.</div>
        </div>
      </div>

      <div className="card anim-fade-up d-1">
        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Service / Product</label>
          <input className="form-input" placeholder="e.g. Website Design, Logo, Consulting"
            value={form.service} onChange={e => set('service', e.target.value)}/>
        </div>

        <div className="form-group">
          <label className="form-label">Amount</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10 }}>
            <input className="form-input" type="number" placeholder="100" min="0.01" step="0.01"
              value={form.amount} onChange={e => set('amount', e.target.value)}/>
            <select className="form-select" value={form.currency} onChange={e => set('currency', e.target.value)}>
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Description <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional)</span>
          </label>
          <input className="form-input" placeholder="Payment for website design project"
            value={form.description} onChange={e => set('description', e.target.value)} maxLength={300}/>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5, display: 'flex', justifyContent: 'space-between' }}>
            <span>Visible to the payer on the payment page.</span>
            <span>{form.description.length}/300</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Auto Expiry <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional)</span>
          </label>
          <select className="form-select" value={form.expiry} onChange={e => set('expiry', e.target.value)}>
            <option value="">No expiry</option>
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
          </select>
        </div>

        <button className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: 15, fontSize: 15, opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}
          onClick={handleCreate} disabled={!valid || loading}>
          {loading
            ? <><SpinnerIcon size={17}/>Creating...</>
            : <><LinkIcon size={15} color="#fff"/>Create Payment Link</>
          }
        </button>
      </div>
    </div>
  )
}
