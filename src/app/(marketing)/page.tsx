'use client'
// src/app/(marketing)/page.tsx  →  ojapay.xyz/
import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import {
  LinkIcon, CopyIcon, ShareIcon, ShieldIcon, ZapIcon, GlobeIcon,
  PlusIcon, PlayIcon, EditIcon, DownloadIcon, WalletIcon, UsersIcon,
  CheckIcon, ExternalIcon
} from '@/components/icons'

function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  const show = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400) }
  return [toast, show] as const
}

export default function HomePage() {
  const [toast, showToast] = useToast()

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"/><div className="hero-grid"/>

        {/* Left copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge anim-fade-up d-1">
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue)' }}/>
            Built on Base
          </div>
          <h1 className="hero-title anim-fade-up d-2">
            Get Paid Securely,<br/><span>On Your Terms.</span>
          </h1>
          <p className="hero-sub anim-fade-up d-3">
            OjaPay helps freelancers and service providers get paid by anyone, anywhere onchain. Share a payment link, get paid in seconds.
          </p>
          <div className="hero-btns anim-fade-up d-4">
            <Link href="/auth/register" className="btn-primary" style={{ textDecoration: 'none' }}>
              <PlusIcon size={15}/>Create Payment Link
            </Link>
            <button className="btn-ghost"><PlayIcon size={13}/>How It Works</button>
          </div>
        </div>

        {/* Payment card preview */}
        <div style={{ position: 'relative', zIndex: 1 }} className="anim-scale-in d-3">
          <div className="pay-card">
            <div className="pay-card-title"><LinkIcon size={15} color="#4f6ef7"/>Your Payment Link</div>
            <div className="pay-link-row">
              <input className="pay-link-input" readOnly value="ojapay.xyz/pay/abc123"/>
              <button className="copy-btn" onClick={() => { navigator.clipboard?.writeText('https://ojapay.xyz/pay/abc123'); showToast('Link copied!') }}>
                <CopyIcon size={13} color="#fff"/>Copy Link
              </button>
            </div>
            <div className="pay-details-hd">
              <span className="pay-details-lbl">Payment Details</span>
              <button className="edit-btn"><EditIcon size={13}/>Edit</button>
            </div>
            <div className="pay-row"><span className="pay-label">Service</span><span className="pay-value">Logo Design</span></div>
            <div className="pay-row"><span className="pay-label">Amount</span><span className="pay-value">50 USDC</span></div>
            <div className="pay-row" style={{ borderBottom: 'none' }}>
              <span className="pay-label">Network</span>
              <div className="pay-network">
                <span className="pay-value">Base</span>
                <div className="base-dot"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/></svg></div>
              </div>
            </div>
            <Link href="/auth/register" className="share-btn-card" style={{ textDecoration: 'none' }}>
              <ShareIcon size={14}/>Share Payment Link
            </Link>
          </div>
        </div>

        {/* Why OjaPay */}
        <div style={{ position: 'relative', zIndex: 1 }} className="anim-fade-up d-4">
          <div className="why-title">Why OjaPay?</div>
          {[
            { icon: <ShieldIcon size={17} color="#4f6ef7"/>, cls: 'why-icon-b', title: 'Secure Payments',    text: 'Funds are secured onchain. You get paid with confidence.' },
            { icon: <ZapIcon    size={17} color="#7c5cfc"/>, cls: 'why-icon-p', title: 'Instant & Low Fees', text: 'Built on Base for fast, low-cost transactions.' },
            { icon: <GlobeIcon  size={17} color="#3ecfcf"/>, cls: 'why-icon-c', title: 'Global Access',      text: 'Anyone with a wallet can pay you from anywhere in the world.' },
          ].map((w, i) => (
            <div className={`why-item anim-slide-r d-${i + 4}`} key={w.title}>
              <div className={`why-icon ${w.cls}`}>{w.icon}</div>
              <div><div className="why-item-title">{w.title}</div><div className="why-item-text">{w.text}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        {[
          { icon: <LinkIcon     size={21} color="#4f6ef7"/>, cls: 'stat-icon-b', num: '12+',      lbl: 'Payment Links Created' },
          { icon: <DownloadIcon size={21} color="#22c87a"/>, cls: 'stat-icon-g', num: '8+',       lbl: 'Payments Received' },
          { icon: <WalletIcon   size={21} color="#7c5cfc"/>, cls: 'stat-icon-p', num: '320 USDC', lbl: 'Total Received' },
          { icon: <UsersIcon    size={21} color="#f97316"/>, cls: 'stat-icon-o', num: '6+',       lbl: 'Happy Customers' },
        ].map(s => (
          <div className="stat-item" key={s.lbl}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-num">{s.num}</div><div className="stat-lbl">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      {/* SCREEN PREVIEWS */}
      <div className="screens">
        <div className="screens-head anim-fade-up">
          <div className="screens-title">Everything you need to get paid</div>
          <div className="screens-sub">From link creation to payment confirmation — fully onchain.</div>
        </div>
        <div className="screens-grid">
          {/* Create */}
          <div className="screen-card anim-fade-up d-1">
            <div className="screen-bar"><div className="screen-dots"><div className="dot-r"/><div className="dot-y"/><div className="dot-g"/></div><div className="screen-url">Create Payment Link</div></div>
            <div className="screen-body">
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 13, fontWeight: 700, marginBottom: 5, color: 'var(--text)' }}>Create Payment Link</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>Create a link and get paid by customers.</div>
              {['Service / Product', 'Amount', 'Description'].map(f => (
                <div key={f} style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>{f}</div>
                  <div style={{ height: 30, borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border2)' }}/>
                </div>
              ))}
              <div style={{ height: 34, borderRadius: 6, background: 'var(--blue)', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-h)', gap: 6 }}>
                <PlusIcon size={12} color="#fff"/>Create Payment Link
              </div>
            </div>
          </div>
          {/* Pay */}
          <div className="screen-card anim-fade-up d-2">
            <div className="screen-bar"><div className="screen-dots"><div className="dot-r"/><div className="dot-y"/><div className="dot-g"/></div><div className="screen-url">ojapay.xyz/pay/abc123</div></div>
            <div className="screen-body" style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-h)', fontWeight: 700, color: '#fff', fontSize: 15, margin: '0 auto 12px' }}>OP</div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>Pay Sharif</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 5 }}>Website Design</div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 4, letterSpacing: '-1px' }}>100 USDC</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>Pay securely on Base</div>
              <div style={{ height: 34, borderRadius: 6, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', gap: 6 }}><WalletIcon size={12} color="#fff"/>Connect Wallet</div>
            </div>
          </div>
          {/* Success */}
          <div className="screen-card anim-fade-up d-3">
            <div className="screen-bar"><div className="screen-dots"><div className="dot-r"/><div className="dot-y"/><div className="dot-g"/></div><div className="screen-url">ojapay.xyz/pay/abc123/success</div></div>
            <div className="screen-body" style={{ textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(34,200,122,0.15)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>Payment Successful!</div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-1px' }}>100 USDC</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', margin: '5px 0 14px' }}>has been paid to Sharif</div>
              <div style={{ height: 32, borderRadius: 6, border: '1.5px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--blue)', marginBottom: 7, gap: 5 }}><ExternalIcon size={11}/>View Transaction</div>
              <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>Back to Home</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, rgba(79,110,247,0.12), rgba(124,92,252,0.08))', borderTop: '1px solid var(--border)', padding: '80px 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, marginBottom: 16 }}>Ready to get paid onchain?</div>
        <div style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 32 }}>Join freelancers already using OjaPay to get paid in USDC on Base.</div>
        <Link href="/auth/register" className="btn-primary" style={{ fontSize: 16, padding: '15px 32px', textDecoration: 'none' }}>
          <PlusIcon size={17}/>Get Started — It's Free
        </Link>
      </div>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 16 }}>OjaPay</div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>Built on Base · Powered by USDC · © 2026 OjaPay</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Terms', 'Privacy', 'Docs'].map(l => <span key={l} style={{ fontSize: 13, color: 'var(--text3)', cursor: 'pointer' }}>{l}</span>)}
        </div>
      </footer>

      {toast && (
        <div className="toast"><CheckIcon size={15} color="var(--green)"/>{toast}</div>
      )}
    </>
  )
}
