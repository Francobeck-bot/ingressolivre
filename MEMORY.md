# IngressoLivre — Project Memory

Marketplace para revenda de ingressos de festas universitárias.
Stack: **Next.js 14 App Router · Supabase · Mercado Pago · Tailwind CSS · TypeScript**

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Auth + DB + Storage | Supabase (PostgreSQL + RLS + Realtime) |
| Payments | Mercado Pago (Preference API + PreApproval subscriptions) |
| Styling | Tailwind CSS v3 + custom design tokens |
| Fonts | Syne (headings) + DM Sans (body) via Google Fonts |
| Icons | lucide-react |
| Hosting | Vercel |

---

## 2. Design Tokens

| Token | Value |
|-------|-------|
| `--color-bg-primary` | `#0d0010` (deep purple-black background) |
| `--color-accent` | `#e0f809` (neon yellow — CTAs, prices) |
| Gradient | `#1a0030 → #6b00b3 → #e0408a` |
| Glass card | `rgba(255,255,255,0.05)` bg + `blur(12px)` |
| Border | `rgba(224,248,9,0.15)` |

Custom Tailwind utilities: `bg-gradient-main`, `shadow-glow`, `shadow-glow-sm`, `glass-card`, `glass-card-hover`, `gradient-text`, `btn-primary`, `btn-accent`, `skeleton`.

---

## 3. Project Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout (Navbar + Footer)
│   ├── globals.css             Global styles + design tokens
│   ├── page.tsx                Homepage
│   ├── buscar/page.tsx         Search + filter + infinite scroll
│   ├── ingresso/[id]/
│   │   ├── page.tsx            Listing detail
│   │   └── PurchaseModal.tsx   3-step checkout modal
│   ├── vender/page.tsx         5-step sell form
│   ├── login/page.tsx          Login (email + Google OAuth)
│   ├── cadastro/page.tsx       Registration
│   ├── chat/page.tsx           Real-time escrow chat
│   ├── minha-conta/
│   │   ├── compras/page.tsx    Buyer dashboard
│   │   ├── vendas/page.tsx     Seller dashboard
│   │   └── verificacao/page.tsx Seller verification tiers
│   ├── admin/page.tsx          Admin dispute panel
│   └── api/
│       ├── auth/callback/route.ts   Supabase OAuth callback
│       ├── pagamento/route.ts       Create MP Preference
│       ├── pagamento/assinatura/route.ts  Diamante subscription
│       └── webhooks/mercadopago/route.ts  Payment + subscription webhooks
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── IngressoCard.tsx        Listing card + skeleton
│   ├── SellerBadge.tsx         Bronze / Ouro / Diamante badge
│   ├── StarRating.tsx          Interactive + readonly stars
│   ├── StatusBadge.tsx         Transaction status pill
│   ├── SafetyBanner.tsx        Escrow explanation 3-step
│   └── StepIndicator.tsx       Multi-step form progress
├── lib/
│   ├── supabase/
│   │   ├── client.ts           createBrowserClient
│   │   ├── server.ts           createServerClient (cookie-based)
│   │   └── schema.sql          Full DB schema + RLS + triggers
│   ├── chat-filter.ts          Contact info censorship regex
│   └── utils.ts                formatCurrency, calcTaxa (4%), labels
└── types/
    └── database.ts             TypeScript interfaces for all DB tables
```

---

## 4. Database Schema

Tables: `profiles`, `eventos`, `anuncios`, `transacoes`, `mensagens`, `avaliacoes`, `disputas`, `assinaturas`, `verificacao_documentos`

Key enums:
- `nivel_verificacao`: `bronze | ouro | diamante`
- `tipo_ingresso`: `pista | pista_vip | camarote | meia_entrada | open_bar | vip | backstage`
- `status_transacao`: `aguardando_pagamento | pagamento_confirmado | aguardando_transferencia | transferencia_enviada | confirmado_comprador | em_disputa | finalizado | reembolsado`

Triggers:
- `handle_new_user()` — auto-creates `profiles` row on `auth.users` insert
- `update_seller_stars()` — recalculates `estrelas_media` after each review
- `check_seller_suspension()` — suspends seller after 3 upheld disputes

Run the full schema by executing `src/lib/supabase/schema.sql` in the Supabase SQL editor.

---

## 5. Business Rules

| Rule | Value |
|------|-------|
| Platform fee (taxa) | **4%** of ticket price |
| Seller delivery deadline | **24 hours** after payment confirmed |
| Auto-refund trigger | Seller misses 24h deadline (handled by webhook + cron) |
| Chat censorship | Phone numbers, @handles, WhatsApp/Insta keywords blocked |
| Seller tiers | Bronze (email) → Ouro (docs, manual review) → Diamante (R$10/mo) |
| Diamante boost | Listings appear first in search results |
| Auto-suspend | Seller suspended after 3 upheld disputes |

---

## 6. Setup — Step by Step

### 6.1 Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from **Settings → API**
3. In **SQL Editor**, run the full contents of `src/lib/supabase/schema.sql`
4. In **Authentication → Providers**, enable **Google** OAuth and add your OAuth app credentials
5. In **Storage**, create a bucket called `ingressos` (public read, authenticated write)
6. In **Authentication → URL Configuration**, add:
   - Site URL: `http://localhost:3000` (dev) / your production URL
   - Redirect URLs: `http://localhost:3000/api/auth/callback`

### 6.2 Mercado Pago

1. Create an app at [developers.mercadopago.com](https://developers.mercadopago.com)
2. Copy the **Test Access Token** (`TEST-...`) into `MERCADOPAGO_ACCESS_TOKEN`
3. Configure webhook: URL = `https://your-domain.com/api/webhooks/mercadopago`, events = `payment` + `subscription_preapproval`
4. For production, switch to the **Production Access Token** (`APP_USR-...`)

### 6.3 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your real Supabase + Mercado Pago credentials

# 3. Run dev server
npm run dev
# Opens at http://localhost:3000

# 4. Build for production
npm run build
npm start
```

### 6.4 Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# MERCADOPAGO_ACCESS_TOKEN
# NEXT_PUBLIC_BASE_URL  (your production domain, e.g. https://ingressolivre.vercel.app)
# NEXT_PUBLIC_ADMIN_EMAILS
```

---

## 7. Key Architecture Decisions

- **`createClient()` uses `<any>` generic** — avoids Supabase TypeScript inference issues where `.from()` returns `never`. Domain types live in `src/types/database.ts` and are cast at call sites.
- **All dynamic pages have `export const dynamic = "force-dynamic"`** — prevents Next.js from trying to statically prerender pages that call Supabase at module init time.
- **`useSearchParams()` pages are Suspense-wrapped** — Next.js 14 requirement: `/login`, `/cadastro`, `/buscar`, `/chat` each export a wrapper component that renders the inner component inside `<Suspense>`.
- **Chat censorship** — `filterMessage()` in `chat-filter.ts` runs before every Supabase insert. Blocked content is replaced with `[contato removido]` and a warning is shown.
- **Escrow flow** — money held until buyer clicks "Recebi o ingresso". Seller has 24h to upload the ticket file. Disputes go to admin panel.
- **Seller verification tiers** — Bronze is automatic (email confirmed). Ouro requires document upload (manual admin review). Diamante requires R$10/month Mercado Pago subscription via PreApproval API.

---

## 8. Admin Panel

URL: `/admin`
Access is controlled by the `NEXT_PUBLIC_ADMIN_EMAILS` env var (comma-separated).
Features: dispute list with status filter, expandable chat transcript, resolution notes, action buttons (release to seller / refund buyer / request info).

---

## 9. Payment Webhook Flow

```
Buyer pays → MP fires POST /api/webhooks/mercadopago
  └─ payment.status === "approved"
       → transacao.status = "aguardando_transferencia"
       → Seller sees "Enviar ingresso" action in /minha-conta/vendas
  └─ payment.status === "rejected" / "cancelled"
       → transacao.status = "reembolsado"

Buyer confirms receipt → /minha-conta/compras "Recebi ✓"
  → transacao.status = "confirmado_comprador"
  → Rating modal shown
  → (cron/admin) → transacao.status = "finalizado" → funds released
```

---

## 10. TODO / Next Steps

- [ ] Add Supabase Edge Function or Vercel Cron for automatic 24h refund if seller doesn't send ticket
- [ ] Add email notifications (Resend or Supabase email templates) for key events
- [ ] Add Stripe as alternative payment method for international cards
- [ ] Add event image upload (currently uses gradient placeholders)
- [ ] Implement `/como-funciona`, `/seguranca`, `/termos`, `/privacidade`, `/contato` static pages
- [ ] Add search by CEP/geolocation for "festas perto de você"
- [ ] Add Ouro verification review workflow in admin panel
