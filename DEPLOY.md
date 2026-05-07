# OjaPay — Full Deployment Guide
## From zero to live at ojapay.xyz

---

## STEP 1 — Accounts to create (all free)

| Service        | URL                          | Purpose                        |
|----------------|------------------------------|--------------------------------|
| GitHub         | github.com                   | Host your code                 |
| Vercel         | vercel.com                   | Host the frontend/app          |
| Railway        | railway.app                  | Host PostgreSQL database        |
| Resend         | resend.com                   | Send payment emails            |
| Alchemy        | alchemy.com                  | Connect to Base blockchain     |
| WalletConnect  | cloud.walletconnect.com      | Mobile wallet support          |

---

## STEP 2 — Set up Railway (Database)

1. Go to railway.app → New Project → PostgreSQL
2. Click your database → **Variables** tab
3. Copy the `DATABASE_URL` value — it looks like:
   `postgresql://postgres:xxxx@containers-us-west.railway.app:xxxx/railway`
4. Save it — you'll need it in Step 5

---

## STEP 3 — Set up Alchemy (Base RPC)

1. Go to alchemy.com → Create App
2. Chain: **Base**, Network: **Mainnet**
3. Copy your **API Key** (not the full URL — just the key part)
4. For webhooks:
   - Go to Notify → Create Webhook
   - Type: **Address Activity**
   - Network: Base Mainnet
   - Webhook URL: `https://ojapay.xyz/api/webhooks/payment`
   - Save the **Signing Key** as `WEBHOOK_SECRET`

---

## STEP 4 — Set up Resend (Email)

1. Go to resend.com → Add Domain → add `ojapay.xyz`
2. Add the DNS records they give you to your domain registrar
3. Go to API Keys → Create API Key → copy it

---

## STEP 5 — Push code to GitHub

```bash
cd ojapay
git init
git add .
git commit -m "Initial OjaPay commit"
git remote add origin https://github.com/YOUR_USERNAME/ojapay.git
git push -u origin main
```

---

## STEP 6 — Deploy to Vercel

1. Go to vercel.com → Import Git Repository → select `ojapay`
2. Framework: **Next.js** (auto-detected)
3. Go to **Environment Variables** and add ALL of these:

```
DATABASE_URL                    = (from Railway Step 2)
NEXTAUTH_URL                    = https://ojapay.xyz
NEXTAUTH_SECRET                 = (run: openssl rand -base64 32)
RESEND_API_KEY                  = (from Resend Step 4)
EMAIL_FROM                      = OjaPay <noreply@ojapay.xyz>
NEXT_PUBLIC_ALCHEMY_ID          = (from Alchemy Step 3)
NEXT_PUBLIC_WALLET_CONNECT_ID   = (from cloud.walletconnect.com)
NEXT_PUBLIC_BASE_CHAIN_ID       = 8453
NEXT_PUBLIC_USDC_CONTRACT_BASE  = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_APP_URL             = https://ojapay.xyz
WEBHOOK_SECRET                  = (from Alchemy Step 3 Signing Key)
```

4. Click **Deploy**
5. Wait ~2 minutes for first build

---

## STEP 7 — Run Database Migrations

After first deploy, run this once to create all tables:

```bash
# In your local terminal (with DATABASE_URL set in .env.local)
npm run db:push
```

Or in Vercel → your project → Functions → Terminal:
```bash
npx prisma db push
```

---

## STEP 8 — Connect your domain

1. In Vercel → your project → Settings → Domains
2. Add `ojapay.xyz` and `www.ojapay.xyz`
3. Vercel gives you DNS records — add them at your domain registrar:
   - A record:     `@`   → Vercel IP
   - CNAME record: `www` → `cname.vercel-dns.com`
4. Wait up to 24 hours for DNS propagation (usually <1 hour)

---

## STEP 9 — Connect your wallet

1. Go to `https://ojapay.xyz/dashboard` → Settings
2. Connect your Base wallet (MetaMask, Coinbase Wallet, etc.)
3. This wallet address is where ALL your payments will go
4. **Never share your private key**

---

## STEP 10 — Test it end-to-end

1. Create a payment link for "Test" → $1 USDC
2. Open the link in a different browser / incognito
3. Connect a wallet with some USDC on Base
4. Complete the payment
5. Check your dashboard — transaction should appear within 30 seconds
6. Check your email — you should receive a payment notification

---

## Wallet Setup (Base USDC)

To receive USDC on Base, your wallet needs to be on the **Base network**.

Add Base to MetaMask:
- Network name: Base
- RPC URL: https://mainnet.base.org
- Chain ID: 8453
- Currency: ETH
- Explorer: https://basescan.org

To get USDC on Base:
- Bridge from Ethereum: bridge.base.org
- Buy directly: Coinbase (native Base support)

---

## Local Development

```bash
# 1. Clone & install
git clone https://github.com/YOUR_USERNAME/ojapay.git
cd ojapay
npm install

# 2. Copy env
cp .env.example .env.local
# Fill in your values

# 3. Push DB schema
npm run db:push

# 4. Run dev server
npm run dev

# App runs at http://localhost:3000
```

---

## Architecture Summary

```
ojapay.xyz (Vercel)
├── /                     Landing page
├── /auth/login           Login
├── /auth/register        Register  
├── /dashboard            Main dashboard (protected)
├── /dashboard/payments   All payment links
├── /dashboard/customers  Customer list
├── /dashboard/settings   Profile + wallet settings
├── /pay/[slug]           Public payment page (what payers see)
└── /api/
    ├── auth/             NextAuth + register
    ├── payments/         CRUD payment links
    ├── customers/        Customer management
    ├── dashboard/stats   Aggregated stats
    └── webhooks/payment  Alchemy webhook → confirms tx + sends email

Railway PostgreSQL
├── User           (accounts)
├── PaymentLink    (your links)
├── Transaction    (confirmed payments)
└── Customer       (people who paid you)
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails | Check all env vars are set in Vercel |
| DB connection error | Verify DATABASE_URL is correct |
| Emails not sending | Verify Resend domain DNS records |
| Wallet not connecting | Check WALLET_CONNECT_ID is set |
| Payments not showing | Verify Alchemy webhook URL & signing key |
| Domain not working | Wait for DNS propagation, check Vercel domain settings |

---

## Support
Built on Base · Powered by OjaPay
