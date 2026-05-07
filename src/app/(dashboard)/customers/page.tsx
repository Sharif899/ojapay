'use client'
// src/app/(dashboard)/customers/page.tsx
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface Customer {
  id: string; name?: string; email?: string; wallet: string
  lastPaid?: string; lastAmount?: number; currency?: string
}

const COLORS = ['#4f6ef7','#7c5cfc','#3ecfcf','#22c87a','#f97316','#ec4899','#eab308']

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState<string | null>(null)
  const [editForm, setEditForm]   = useState({ name: '', email: '' })

  useEffect(() => {
    fetch('/api/customers')
      .then(r => r.json())
      .then(d => { setCustomers(d.customers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const startEdit = (c: Customer) => {
    setEditing(c.id)
    setEditForm({ name: c.name || '', email: c.email || '' })
  }

  const saveEdit = async (id: string) => {
    const res = await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    })
    if (res.ok) {
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...editForm } : c))
      setEditing(null)
    }
  }

  const getInitials = (c: Customer) => {
    if (c.name) return c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    return c.wallet.slice(2, 4).toUpperCase()
  }

  const getColor = (i: number) => COLORS[i % COLORS.length]

  return (
    <div className="dash-main">
      <div className="dash-header anim-fade-up">
        <div>
          <div className="dash-title">Customers</div>
          <div className="dash-sub">People who have paid you</div>
        </div>
        <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 28, color: 'var(--blue2)' }}>
          {loading ? '—' : customers.length}
        </div>
      </div>

      <div className="card anim-fade-up d-1">
        {loading ? (
          <div>{Array(5).fill(null).map((_, i) => <div key={i} className="shimmer" style={{ height: 52, borderRadius: 8, marginBottom: 8 }}/>)}</div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 16, color: 'var(--text2)', marginBottom: 6 }}>No customers yet</div>
            <div style={{ fontSize: 13 }}>Customers appear here once someone pays one of your links</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Customer</th><th>Wallet</th><th>Last Paid</th><th>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id}>
                    <td>
                      {editing === c.id ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input className="form-input" style={{ padding: '6px 10px', fontSize: 13, width: 120 }}
                            value={editForm.name} placeholder="Name"
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}/>
                          <input className="form-input" style={{ padding: '6px 10px', fontSize: 13, width: 140 }}
                            value={editForm.email} placeholder="Email"
                            onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}/>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="customer-av" style={{ background: getColor(i) }}>{getInitials(c)}</div>
                          <div>
                            <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 14 }}>{c.name || 'Unknown'}</div>
                            {c.email && <div style={{ color: 'var(--text3)', fontSize: 12 }}>{c.email}</div>}
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text3)' }}>
                      {c.wallet.slice(0, 6)}...{c.wallet.slice(-4)}
                    </td>
                    <td>{c.lastPaid ? format(new Date(c.lastPaid), 'MMM d, yyyy') : '—'}</td>
                    <td style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: 'var(--green)' }}>
                      {c.lastAmount ? `${c.lastAmount} ${c.currency || 'USDC'}` : '—'}
                    </td>
                    <td>
                      {editing === c.id ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => saveEdit(c.id)}>Save</button>
                          <button className="btn-ghost"   style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setEditing(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(c)}
                          style={{ background: 'none', border: 'none', color: 'var(--blue2)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                          Edit
                        </button>
                      )}
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
