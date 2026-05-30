# Plearn LMS

Thai-language Learning Management System built with **Next.js 14**, **Supabase**, and **Prisma**.

**Production:** https://plearn-lms.vercel.app  
**Supabase project:** https://supabase.com/dashboard/project/fplntugopnypjxdwqnpb  
**GitHub:** https://github.com/nivet99/LMS_Training

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Server Actions) |
| Language | TypeScript |
| Database | Supabase PostgreSQL |
| ORM | Prisma 7 |
| Realtime/Auth | Supabase JS (`@supabase/supabase-js`) |
| Styling | Tailwind CSS + CSS custom properties |
| Deployment | Vercel (Singapore region) |

---

## Architecture

```
Phase 1 (current) — Cookie-based prototype
  ├── Auth: httpOnly cookie (plearn_user)
  ├── Data: Mock data in /mock/*.ts
  ├── Progress: client cookies
  └── Webboard: client cookies

Phase 2 (in progress) — Real database
  ├── Auth: Supabase Auth or NextAuth v5
  ├── Data: Supabase PostgreSQL via Prisma
  ├── Storage: Supabase Storage / AWS S3
  └── Video: Mux / YouTube URLs
```

---

## Supabase Setup (One-time)

### Step 1 — Create tables

1. Open the **SQL Editor**: https://supabase.com/dashboard/project/fplntugopnypjxdwqnpb/sql/new
2. Copy the contents of [`scripts/create-tables.sql`](./scripts/create-tables.sql)
3. Paste and click **Run**

### Step 2 — Seed sample data

```bash
node scripts/seed-supabase.mjs
```

This inserts:
- 7 categories
- 3 demo users (learner / instructor / admin)
- 3 published courses
- 3 enrollments
- 4 webboard posts

### Step 3 — Prisma migrations (optional, Phase 2)

Get the connection string from Supabase Dashboard → **Settings → Database → Connection string** and set:

```env
# .env.local
DATABASE_URL=postgresql://postgres.fplntugopnypjxdwqnpb:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.fplntugopnypjxdwqnpb.supabase.co:5432/postgres
```

Then run:
```bash
npx prisma db push
npx prisma generate
```

---

## Environment Variables

### Vercel (Production) — already configured

| Variable | Status | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Set | `https://fplntugopnypjxdwqnpb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set | Public key for client-side queries |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set | Server-only, bypasses RLS |
| `NEXT_PUBLIC_APP_URL` | ✅ Set | `https://plearn-lms.vercel.app` |
| `DATABASE_URL` | ⏳ Pending | Needs DB password from dashboard |
| `DIRECT_URL` | ⏳ Pending | Needs DB password from dashboard |

### Local development — `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://fplntugopnypjxdwqnpb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
DATABASE_URL=postgresql://postgres.fplntugopnypjxdwqnpb:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.fplntugopnypjxdwqnpb.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

---

## Local Development

```bash
npm install
npm run dev        # http://localhost:3002
```

### Database scripts

```bash
node scripts/seed-supabase.mjs    # Seed Supabase with sample data
npx prisma generate               # Regenerate Prisma client
npx prisma db push                # Push schema to DB (needs DATABASE_URL)
npx prisma studio                 # Visual DB browser
```

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Learner | learner@plearn.co | password |
| Instructor | instructor@plearn.co | password |
| Admin | admin@plearn.co | password |

---

## Core LMS Flow

```
/ (home) → /courses (catalog) → /courses/[slug] (detail)
        → Enroll → /my-courses → /my-courses/[id]/learn/[lessonId]
                              → Quiz → Progress tracking

/dashboard        — Learner dashboard with XP + progress
/instructor/*     — Course creation and management
/admin/*          — Platform admin (users, courses, payments)
/webboard         — Community discussion forum
```

---

## Deployment

```bash
# Deploy to Vercel production
NODE_TLS_REJECT_UNAUTHORIZED=0 vercel --prod --yes

# Push to GitHub (auto-deploys if connected)
git push origin main
```

---

## Project Structure

```
plearn-lms/
├── app/
│   ├── (public)/          # Home, courses, webboard
│   ├── (learner)/         # Dashboard, my-courses, lesson player
│   ├── (instructor)/      # Course management
│   ├── (admin)/           # Platform admin
│   └── api/               # REST endpoints
├── actions/               # Next.js Server Actions
├── components/            # React components
├── lib/
│   ├── supabase.ts        # Supabase client (browser + server)
│   ├── db.ts              # Prisma client
│   ├── session.ts         # Cookie-based session
│   └── enrollment.ts      # Progress helpers
├── mock/                  # Mock data (Phase 1)
├── prisma/
│   └── schema.prisma      # Database schema (429 lines)
├── prisma.config.ts       # Prisma v7 configuration
└── scripts/
    ├── create-tables.sql  # Supabase SQL for table creation
    └── seed-supabase.mjs  # Data seeding script
```
