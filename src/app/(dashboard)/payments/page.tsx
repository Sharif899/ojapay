'use client'
// src/app/(dashboard)/payments/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon, CopyIcon, ExternalIcon, CheckIcon } from '@/components/icons'
import { format } from 'date-fns'

interface PaymentLink {
  id: string; slug: string; service: string; amount: number
  currency: string; isActive: boolean; createdAt: string
  expiresAt?: string; transactions: { status: string }[]
}

export default function PaymentsPage() {
  const [links, setLinks]     = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied]   = useState<string | null>(null)
  const APP = process.env.NEXT_PUBLIC_APP_URL || 'https://ojapay.xyz'

  useEffect(() => {
    fetch('/api/payments')
      .then(r => r.json())
      .then(d => { setLinks(d.links || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const copyLink = (slug: string) => {
    navigator.clipboard?.writeText(`${APP}/pay/${slug}`)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }

  const deactivate = async (slug: string) => {
    await fetch(`/api/payments/${slug}`, { method: 'DELETE' })
    setLinks(prev => prev.map(l => l.slug === slug ? { ...l, isActive: false } : l))
  }

  return (
    <div className="dash-main">
      <div className="dash-header anim-fade-up">
        <div>
          <div className="dash-title">Payments</div>
          <div className="dash-sub">All your payment links and transactions</div>
        </div>
        <Link href="/create" className="btn-primary" style={{ textDecoration: 'none' }}>
          <PlusIcon size={15}/>New Payment Link
        </Link>
      </div>

      <div className="card anim-fade-up d-1">
        {loading ? (
          <div>{Array(5).fill(null).map((_, i) => <div key={i} className="shimmer" style={{ height: 50, borderRadius: 8, marginBottom: 8 }}/>)}</div>
        ) : links.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔗</div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text2)' }}>No payment links yet</div>
            <Link href="/create" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', marginTop: 8 }}>
              <PlusIcon size={15}/>Create your first link
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Service</th><th>Amount</th><th>Created</th><th>Expires</th><th>Payments</th><th>Status</th><th>Link</th><th></th></tr>
              </thead>
              <tbody>
                {links.map(l => {
                  const paid = l.transactions?.filter(t => t.status === 'CONFIRMED').length || 0
                  return (
                    <tr key={l.id}>
                      <td style={{ color: 'var(--text)', fontWeight: 500 }}>{l.service}</td>
                      <td style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: 'var(--text)' }}>{l.amount} {l.currency}</td>
                      <td>{format(new Date(l.createdAt), 'MMM d, yyyy')}</td>
                      <td>{l.expiresAt ? format(new Date(l.expiresAt), 'MMM d') : <span style={{ color: 'var(--text3)' }}>Never</span>}</td>
                      <td><span className="badge badge-green">{paid} paid</span></td>
                      <td><span className={`badge badge-${l.isActive ? 'blue' : 'gray'}`}>{l.isActive ? 'active' : 'inactive'}</span></td>
                      <td>
                        <button onClick={() => copyLink(l.slug)}
                          style={{ background: 'none', border: 'none', color: copied === l.slug ? 'var(--green)' : 'var(--blue2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
                          {copied === l.slug ? <><CheckIcon size={13} color="var(--green)"/>Copied!</> : <><CopyIcon size={13}/>Copy</>}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <a href={`/pay/${l.slug}`} target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--blue2)', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ExternalIcon size={12}/>View
                          </a>
                          {l.isActive && (
                            <button onClick={() => deactivate(l.slug)}
                              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                              Disable
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
