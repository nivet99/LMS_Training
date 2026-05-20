# Plearn LMS — Project Task Tracker

**Stack**: Next.js 14 · Auth.js v5 · PostgreSQL (Neon) · Prisma · Redis (Upstash) · Mux · AWS S3 · Inngest · Resend · Stripe  
**Start date**: 2026-05-16  
**Target ship**: Phase 1 by Week 10

---

## สรุปสถานะ 5 Core Modules (ตรวจสอบ 2026-05-16)

| Module | ชื่อ | สถานะ | หมายเหตุ |
|--------|------|--------|----------|
| 1 | Login / Logout | ⚠️ UI Only | หน้า login/signup ครบ — ยังไม่มี Auth.js session จริง |
| 2 | Browse Course | ✅ ใช้งานได้ | Catalog + Search bar + Filter + Course Detail ครบ |
| 3 | Learn Lesson | ✅ ใช้งานได้ | Video / Text / Quiz player ครบ พร้อม sidebar navigation |
| 4 | Take Quiz | ✅ ใช้งานได้ | QuizEngine: intro → questions → result + retry ครบ |
| 5 | Track Progress | ✅ Mock ใช้งานได้ | My Courses + Course Outline + progress bar ครบ |

---

## Phase 1 — Foundation & MVP (Weeks 1–10)

### Setup & Infrastructure
- [x] Scaffold Next.js 14 project (TypeScript, Tailwind, App Router)
- [x] Configure Plearn design system (CSS variables, Tailwind tokens)
- [x] Define all TypeScript types (`types/`)
- [x] Create mock data — courses, categories, users (`mock/`)
- [x] Create mock data — chapters, lessons, quiz (`mock/lessons.ts`)
- [x] Set up lib singletons (db, auth, redis, stripe, mux, s3, resend, inngest)
- [x] Write Prisma schema (all 20+ models)
- [x] Create middleware.ts (RBAC stub — pass-through for dev)
- [x] Create Zod validation schemas
- [x] Install Node.js 20+ and run `npm install` (fixed SSL cert issue)
- [x] Fix `npm config set strict-ssl false` for corporate proxy
- [x] `npm run dev` working at http://localhost:3000
- [ ] Create `.env.local` from `.env.example` and fill in all secrets
- [ ] Run `npm run db:push` to sync Prisma schema to Neon DB
- [ ] Deploy to Vercel Pro and configure environment variables

---

### Module 1 — Authentication & Login/Logout

#### สิ่งที่มีแล้ว (UI Shell)
- [x] หน้า Login UI (`/login`) — email/password form + OAuth buttons (Google/LINE/Facebook)
- [x] หน้า Signup UI (`/signup`) — registration form + role selector
- [x] หน้า Forgot Password UI (`/forgot-password`)

#### สิ่งที่ยังต้องทำ (Phase 1 Priority)
- [ ] ติดตั้ง `next-auth@5.0.0-beta` และ `@auth/prisma-adapter`
- [ ] ติดตั้ง `bcryptjs` + `@types/bcryptjs`
- [ ] สร้าง `lib/auth.ts` — Auth.js v5 config (Credentials + Google + LINE)
- [ ] สร้าง Server Action `registerUser()` — hash password, create DB record, send verification email
- [ ] สร้าง Server Action `signInWithCredentials()` — verify email/password, create session
- [ ] เพิ่ม `signOut()` button ใน Navbar และ user dropdown
- [ ] Wire login form กับ `signIn()` ของ Auth.js
- [ ] Wire signup form กับ `registerUser()` Server Action
- [ ] เปิดใช้ RBAC middleware (`middleware.ts`) — ต้องมี session ก่อน
- [ ] สร้าง `app/(auth)/verify-email/[token]/page.tsx`
- [ ] สร้าง `app/(auth)/reset-password/[token]/page.tsx`
- [ ] ทดสอบ Google OAuth login
- [ ] ทดสอบ LINE OAuth login (ต้องมี LINE Business Account)

---

### Module 2 — Browse Course (ค้นหาวิชา)

#### สิ่งที่มีแล้ว ✅
- [x] หน้า Course Catalog (`/courses`) — filter by category + level
- [x] Search bar (`CourseSearchBar.tsx`) — text search ผ่าน URL params
- [x] Filter sidebar — category + level selector
- [x] Course Card (`CourseCard.tsx`)
- [x] Course Detail (`/courses/[slug]`) — hero, enroll card, info
- [x] ISR revalidation (5 min catalog, 30 min detail)

#### สิ่งที่ยังต้องทำ
- [ ] Replace mock data ด้วย Prisma queries
- [ ] Syllabus accordion ในหน้า course detail
- [ ] Review list ใน course detail
- [ ] Meilisearch integration
- [ ] Pagination ใน course catalog

---

### Module 3 — Learn Lesson (เข้าเรียน)

#### สิ่งที่มีแล้ว ✅
- [x] หน้า My Courses (`/my-courses`) — enrolled courses + progress bars
- [x] หน้า Course Outline (`/my-courses/[courseId]`) — chapters + lessons list
- [x] หน้า Lesson Player (`/my-courses/[courseId]/learn/[lessonId]`) — full-screen layout
- [x] `LessonPlayer.tsx` — sidebar + video/text/quiz content area
- [x] Mock data: chapters + lessons สำหรับ 3 คอร์ส (UX, Marketing, Python)
- [x] Prev/Next navigation ระหว่าง lessons
- [x] "Mark as Complete" button สำหรับ VIDEO และ TEXT
- [x] Progress tracking (mock)

#### สิ่งที่ยังต้องทำ
- [ ] ติดตั้ง `@mux/mux-player-react` — แทน video placeholder
- [ ] Server Action `saveWatchPosition()` — upsert ทุก 15 วินาที
- [ ] Server Action `markLessonComplete()` — อัปเดต DB + award XP
- [ ] Resume from last position
- [ ] Sequential mode — lock lessons จนกว่าบทก่อนหน้าจะจบ
- [ ] PDF viewer component
- [ ] Replace mock progress ด้วย Prisma queries

---

### Module 4 — Take Quiz (ทำแบบทดสอบ)

#### สิ่งที่มีแล้ว ✅
- [x] `QuizEngine.tsx` — Client component พร้อมใช้งาน
- [x] Intro screen — แสดงจำนวนคำถาม, เวลา, คะแนนผ่าน
- [x] Playing screen — progress bar, timer, คำถาม + ตัวเลือก, feedback ทันที
- [x] Result screen — คะแนน %, pass/fail badge, เฉลยทุกข้อ, retry
- [x] รองรับ MULTIPLE_CHOICE และ TRUE_FALSE
- [x] Timer พร้อม warning เมื่อเหลือ 30 วินาที
- [x] Auto-submit เมื่อหมดเวลา
- [x] Mock quiz data: 5 quizzes (UX Design, Digital Marketing, Python)

#### สิ่งที่ยังต้องทำ
- [ ] Server Action `submitQuizAttempt()` — บันทึก score ลง DB
- [ ] เพิ่ม FILL_BLANK, MATCHING, SHORT_ANSWER question types
- [ ] Manual grading queue (instructor side)
- [ ] Quiz Builder UI สำหรับ instructor
- [ ] Server Action `createQuiz()` + `createQuestion()`
- [ ] Retake cooldown timer
- [ ] Quiz analytics — instructor dashboard

---

### Module 5 — Track Progress (ดูความก้าวหน้า)

#### สิ่งที่มีแล้ว ✅
- [x] Learner Dashboard (`/dashboard`) — KPI cards, streak widget, continue learning
- [x] My Courses (`/my-courses`) — progress bar ต่อคอร์ส, สถิติรวม
- [x] Course Outline (`/my-courses/[courseId]`) — progress ต่อบทเรียน + chapter
- [x] Lesson sidebar — สถานะ completed/in-progress ต่อบทเรียน
- [x] Mock progress data (`MOCK_PROGRESS`)

#### สิ่งที่ยังต้องทำ
- [ ] Replace mock progress ด้วย Prisma `LessonProgress` queries
- [ ] `course-completion-check` Inngest function
- [ ] Learning streak tracker (UTC+7)
- [ ] XP ledger + Level system (Bronze → Diamond)
- [ ] Certificate generation เมื่อเรียนจบ
- [ ] `/my-certificates` page

---

### Module 16 — AI Chatbot Assistant ✅ (2026-05-20)

- [x] `components/chatbot/ChatbotWidget.tsx` — FAB (robot icon) + chat panel, fixed bottom-right
- [x] `components/chatbot/chatbot-logic.ts` — keyword matching engine (token-based, strips Thai intent words)
- [x] Mounted globally in `app/layout.tsx`
- [x] Course search: name, category, slug, instructor, description (token OR logic)
- [x] Filters: ฟรี, ยอดนิยม, ใหม่, มือใหม่/กลาง/ขั้นสูง, ราคา, ดูทั้งหมด
- [x] On-site info: PIM (สถาบันปัญญาภิวัฒน์) address + MRT directions + opening hours
- [x] Fixed: "ช่วย" no longer intercepts course search queries
- [x] Fixed: multi-word Thai queries (e.g. "คอร์ส python", "อยากเรียน UX") work correctly
- [ ] Phase 2: replace mock data search with Meilisearch or Claude API (vector search)

---

### Payments & Enrollment (Module 7)
- [ ] ติดตั้ง `stripe`
- [ ] Server Action `createCheckoutSession()` → Stripe Checkout
- [ ] PromptPay QR payment
- [ ] `POST /api/webhooks/stripe` handler
- [ ] Server Action `enrollInCourse()`
- [ ] Coupon validation
- [ ] Payment receipt email

---

## Phase 2 — Core Engagement (Weeks 11–16)

### Full Quiz Engine
- [ ] FILL_BLANK question type
- [ ] MATCHING pairs question type
- [ ] SHORT_ANSWER + manual grading queue

### Certificates & Badges (Module 6)
- [ ] `generate-certificate` Inngest function (pdf-lib → S3 → email)
- [ ] Certificate PDF template
- [ ] `/my-certificates` page
- [ ] `/verify/[code]` public page
- [ ] Badge system (UserBadge model + award logic)

### Forum (Module 11)
- [ ] Forum thread list per course
- [ ] Tiptap rich text post composer
- [ ] `createPost()` / `deletePost()` / `pinPost()` Server Actions
- [ ] Nested replies (2 levels)
- [ ] In-app notification on reply
- [ ] Email digest via Resend

### Email Templates
- [ ] `WelcomeEmail.tsx`
- [ ] `EnrollmentConfirmEmail.tsx`
- [ ] `CertificateIssuedEmail.tsx`
- [ ] `PaymentReceiptEmail.tsx`
- [ ] `PasswordResetEmail.tsx`

---

## Phase 3 — Growth Features (Weeks 17–22)

### Gamification (Module 12)
- [ ] XP ledger write on lesson/quiz/forum events
- [ ] Level calculation (Bronze → Diamond)
- [ ] Leaderboard page (platform + per course)
- [ ] `recalculate-leaderboard` Inngest function (Upstash Redis sorted set)

### Instructor Analytics (Module 9)
- [ ] Revenue chart (Recharts)
- [ ] Student roster table
- [ ] Quiz analytics (per-question difficulty)
- [ ] Watch-time heatmap

### Live Classes (Module 10)
- [ ] Live class scheduler UI
- [ ] Zoom API integration
- [ ] `live-class-reminder` Inngest function

### PWA & Mobile (Module 14)
- [ ] Configure `next-pwa` + Workbox
- [ ] Web Push API notifications
- [ ] Offline lesson caching

### i18n (Module 15)
- [ ] Configure `next-intl` middleware
- [ ] Language switcher in Navbar

---

## Phase 4 — Scale & Polish (Weeks 23–28)

### Admin Panel (Module 13)
- [ ] Course moderation queue (`/admin/courses`)
- [ ] `approveCourse()` / `rejectCourse()` Server Actions
- [ ] User management table
- [ ] `banUser()` Server Action
- [ ] Transaction log + refund button
- [ ] Platform settings form

### Search
- [ ] Meilisearch index sync on course publish
- [ ] Autocomplete SearchBar (debounced via `/api/search`)
- [ ] Faceted filter panel

### Quality & Performance
- [ ] OWASP Top 10 security audit
- [ ] Lighthouse ≥ 90 on all public pages
- [ ] Load test with k6 (10K concurrent learners)
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Sentry error tracking
- [ ] PostHog analytics

---

## How to Run

```bash
# 1. Fix SSL for corporate proxy (one-time)
npm config set strict-ssl false

# 2. Install dependencies
npm install

# 3. Copy and fill in secrets
cp .env.example .env.local

# 4. Push Prisma schema to database
npm run db:push

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Key URLs (Dev)

| URL | คำอธิบาย |
|-----|----------|
| http://localhost:3000 | Homepage |
| http://localhost:3000/courses | Course Catalog + Search |
| http://localhost:3000/courses/ux-design-figma-fundamentals | Course Detail |
| http://localhost:3000/login | Login page |
| http://localhost:3000/signup | Signup page |
| http://localhost:3000/dashboard | Learner Dashboard |
| http://localhost:3000/my-courses | My Courses (enrolled list) |
| http://localhost:3000/my-courses/course_01 | Course Outline |
| http://localhost:3000/my-courses/course_01/learn/lesson_01_01_01 | Lesson Player (Video) |
| http://localhost:3000/my-courses/course_01/learn/lesson_01_01_02 | Lesson Player (Video 2) |
| http://localhost:3000/my-courses/course_01/learn/lesson_01_01_03 | Quiz Engine |
| http://localhost:3000/my-courses/course_01/learn/lesson_01_02_02 | Lesson Player (Text) |
| http://localhost:3000/instructor/dashboard | Instructor Dashboard |
| http://localhost:3000/admin/dashboard | Admin Dashboard |

---

## Key File Map

| สิ่งที่ต้องการแก้ | ไฟล์ |
|---|---|
| Design tokens | `tailwind.config.ts` + `app/globals.css` |
| Mock courses | `mock/courses.ts` |
| Mock chapters/lessons/quizzes | `mock/lessons.ts` |
| Mock progress & enrollments | `mock/lessons.ts` → `MOCK_PROGRESS`, `MOCK_ENROLLMENTS` |
| Homepage | `app/(public)/page.tsx` |
| Course Catalog + Search | `app/(public)/courses/page.tsx` |
| Course Detail | `app/(public)/courses/[slug]/page.tsx` |
| Learner Dashboard | `app/(learner)/dashboard/page.tsx` |
| My Courses list | `app/(learner)/my-courses/page.tsx` |
| Course Outline | `app/(learner)/my-courses/[courseId]/page.tsx` |
| Lesson Player page | `app/(learner)/my-courses/[courseId]/learn/[lessonId]/page.tsx` |
| Lesson Player component | `components/player/LessonPlayer.tsx` |
| Quiz Engine | `components/quiz/QuizEngine.tsx` |
| Search bar | `components/course/CourseSearchBar.tsx` |
| Navbar | `components/shared/Navbar.tsx` |
| RBAC middleware | `middleware.ts` |
| Database schema | `prisma/schema.prisma` |
| Server Actions | `actions/[domain]/[action].ts` |
| Background jobs | `inngest/[function].ts` |
| Email templates | `emails/[Template].tsx` |
| Environment variables | `.env.local` |
