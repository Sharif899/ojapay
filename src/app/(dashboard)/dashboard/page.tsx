'use client'
// src/app/(dashboard)/dashboard/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon, ArrowIcon, ExternalIcon } from '@/components/icons'
import { format } from 'date-fns'

interface Stats {
  linksCount: number; paymentsReceived: number
  totalUSDC: number;  customersCount: number
  recentTransactions: any[]
}

export default function DashboardPage() {
  const [stats, setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Payment Links',    val: stats.linksCount,          sub: 'All time' },
    { label: 'Payments Received',val: stats.paymentsReceived,    sub: 'Confirmed' },
    { label: 'Total Received',   val: `${stats.totalUSDC.toFixed(2)} USDC`, sub: 'USDC on Base' },
    { label: 'Happy Customers',  val: stats.customersCount,      sub: 'Unique payers' },
  ] : Array(4).fill(null)

  return (
    <div className="dash-main">
      <div className="dash-header anim-fade-up">
        <div>
          <div className="dash-title">Dashboard</div>
          <div className="dash-sub">Welcome back — here's your overview</div>
        </div>
        <Link href="/create" className="btn-primary" style={{ textDecoration: 'none' }}>
          <PlusIcon size={15}/>Create Payment Link
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {cards.map((s, i) => (
          <div className={`stat-card anim-fade-up d-${i + 1}`} key={i}>
            {loading ? (
              <>
                <div className="shimmer" style={{ height: 11, width: 80, marginBottom: 10 }}/>
                <div className="shimmer" style={{ height: 26, width: 120 }}/>
              </>
            ) : (
              <>
                <div className="stat-card-label">{s?.label}</div>
                <div className="stat-card-val">{s?.val}</div>
                <div className="stat-card-sub">{s?.sub}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="card anim-fade-up d-5">
        <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Recent Payments
          <Link href="/payments" className="btn-ghost" style={{ padding: '7px 14px', fontSize: 12, gap: 6, textDecoration: 'none' }}>
            View all <ArrowIcon size={13}/>
          </Link>
        </div>
        {loading ? (
          <div>{Array(4).fill(null).map((_, i) => <div key={i} className="shimmer" style={{ height: 48, borderRadius: 8, marginBottom: 8 }}/>)}</div>
        ) : stats?.recentTransactions?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💸</div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, marginBottom: 6 }}>No payments yet</div>
            <div style={{ fontSize: 13 }}>Create your first payment link to get started</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Service</th><th>Customer</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {stats?.recentTransactions?.map((tx: any) => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text)', fontWeight: 500 }}>{tx.paymentLink?.service || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {tx.customer?.name || `${tx.fromAddress?.slice(0,6)}...${tx.fromAddress?.slice(-4)}`}
                    </td>
                    <td style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: 'var(--text)' }}>{tx.amount} {tx.currency}</td>
                    <td>{format(new Date(tx.createdAt), 'MMM d, yyyy')}</td>
                    <td><span className={`badge badge-${tx.status === 'CONFIRMED' ? 'green' : tx.status === 'PENDING' ? 'yellow' : 'gray'}`}>{tx.status.toLowerCase()}</span></td>
                    <td>
                      <a href={`https://basescan.org/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--blue2)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        <ExternalIcon size={13}/>View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
