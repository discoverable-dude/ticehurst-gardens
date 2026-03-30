# Ticehurst Grounds & Gardens — Website

Next.js 16 + TypeScript + Tailwind CSS + Supabase  
Professional garden maintenance & exterior cleaning — Kent & East Sussex

---

## 🚀 Deploy to Vercel in 5 minutes

### Step 1 — Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `ticehurst`, pick **eu-west-2 (London)**
3. Once live, go to **SQL Editor** → paste the entire contents of `supabase/migrations/001_initial_schema.sql` → **Run**
4. Go to **Settings → API** and copy:
   - `Project URL`  
   - `anon / public` key

### Step 2 — Deploy to Vercel

1. Push this repo to GitHub (new private repo)
2. Go to [vercel.com/new](https://vercel.com/new) → import your GitHub repo
3. Vercel auto-detects Next.js — no build settings needed
4. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

5. Click **Deploy** — live in ~90 seconds

### Step 3 — Add your custom domain

1. In Vercel → your project → **Settings → Domains**
2. Add `www.ticehurstgroundsandgardens.co.uk`
3. Add the DNS records Vercel shows you to your domain registrar
4. SSL is automatic

---

## 🗂️ Project structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── quote/page.tsx              # Multi-step quote calculator
│   ├── contact/page.tsx            # Contact form
│   ├── contact/thanks/page.tsx     # Post-submission thank you
│   ├── about/page.tsx              # About page
│   ├── areas/
│   │   ├── page.tsx                # Areas index
│   │   └── [slug]/page.tsx         # 12 dynamic location pages
│   ├── services/
│   │   └── [slug]/page.tsx         # 12 dynamic service pages
│   ├── api/
│   │   ├── quote/route.ts          # POST → saves to Supabase quotes table
│   │   └── contact/route.ts        # POST → saves to Supabase contacts table
│   ├── sitemap.ts                  # Auto-generated XML sitemap
│   └── robots.ts                   # robots.txt
├── components/
│   ├── Nav.tsx                     # Sticky nav + mobile menu
│   ├── Footer.tsx                  # 4-col footer
│   ├── Wave.tsx                    # SVG wave dividers
│   └── QuoteTool.tsx               # Multi-step interactive price calculator
└── lib/
    ├── supabase.ts                 # Supabase client + TypeScript types
    ├── pricing.ts                  # Pricing engine — all price logic here
    ├── services.ts                 # All 12 service definitions
    └── locations.ts                # All 12 location definitions
supabase/
└── migrations/
    └── 001_initial_schema.sql      # Full DB schema — run once in Supabase
```

---

## 💰 Quote tool pricing

Edit prices in `src/lib/pricing.ts`. All values are realistic Kent/East Sussex market rates.  
Andy should review and adjust to match his actual pricing.

The tool covers all 12 services with:
- Garden/property size tiers
- Frequency discounts (regulars get better rates)
- Panel/fence count inputs where relevant
- Low/high estimate range displayed to user
- Full submission saved to Supabase `quotes` table with status tracking

---

## 🗄️ Database

Two tables in Supabase:

**`quotes`** — from the /quote multi-step tool  
**`contacts`** — from simple contact forms  

Both tables have Row Level Security enabled:
- Anonymous users can **INSERT** (submit forms)
- Authenticated users can do everything (for Andy's admin access)

To view new leads: log into Supabase → **Table Editor → `new_leads` view**

---

## 🛠️ Local development

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase URL and anon key in .env.local
npm run dev
# Open http://localhost:3000
```

---

## 📄 Pages & SEO

| Page | Target keyword | Monthly vol |
|------|----------------|------------|
| `/` | gardeners Ashford Kent | 110 |
| `/services/window-cleaning` | window cleaning Kent | 320 |
| `/services/gutter-clearing` | gutter cleaning Kent | 210 |
| `/services/lawn-care` | lawn care Kent | 70 |
| `/services/fencing` | fencing contractor Kent | 210 |
| `/areas/maidstone` | gardeners Maidstone | 320 |
| `/areas/tunbridge-wells` | window cleaning Tunbridge Wells | 390 |
| `/areas/hastings` | gardeners Hastings | 210 |

All pages include:
- Semantic HTML with correct heading hierarchy
- JSON-LD structured data (LocalBusiness, FAQPage, Service)
- Open Graph tags
- Canonical URLs
- Auto-generated sitemap at `/sitemap.xml`

---

## 🔧 Content updates

**To add a new location:** edit `src/lib/locations.ts`  
**To add a new service:** edit `src/lib/services.ts` + `src/lib/pricing.ts`  
**To update prices:** edit the pricing tables in `src/lib/pricing.ts`  
**To update reviews:** search for `REVIEWS` in `page.tsx` / `[slug]/page.tsx`

---

## 📦 Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Icons | Lucide React |
| Maps | Leaflet (via CDN on static HTML pages) |
