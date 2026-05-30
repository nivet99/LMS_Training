/**
 * Seed script — inserts sample LMS data into Supabase using the REST API.
 * Run: node scripts/seed-supabase.mjs
 *
 * Creates tables via SQL (requires service_role), then seeds data.
 * No Prisma migrations needed — works directly with Supabase.
 */

const SUPABASE_URL = "https://fplntugopnypjxdwqnpb.supabase.co";
const SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwbG50dWdvcG55cGp4ZHdxbnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDEzMjE4NCwiZXhwIjoyMDk1NzA4MTg0fQ.OtiX3wQHigstuF5r85JSa1moNzHE5el9cV3w32D7NZo";

const headers = {
  "Content-Type": "application/json",
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Prefer": "return=minimal",
};

async function sql(query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: "POST",
    headers,
    body: JSON.stringify({ sql: query }),
  });
  if (!res.ok) {
    const err = await res.text();
    // If exec function doesn't exist, use the query API
    if (res.status === 404 || err.includes("does not exist")) {
      return { skipped: true };
    }
    throw new Error(`SQL error ${res.status}: ${err}`);
  }
  return res.json().catch(() => ({}));
}

async function upsert(table, rows, conflictCol = "id") {
  if (!rows.length) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers, "Prefer": `resolution=merge-duplicates,return=minimal` },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    if (text.includes("does not exist")) {
      console.log(`  ⚠ Table '${table}' not found — run migrations first.`);
      return;
    }
    throw new Error(`Upsert ${table} failed ${res.status}: ${text}`);
  }
  console.log(`  ✓ ${table}: ${rows.length} rows`);
}

async function main() {
  console.log("\n🌱 Plearn LMS — Supabase Seed\n");

  // ── 1. Test connection ────────────────────────────────────────────────────
  console.log("1. Testing Supabase connection...");
  const health = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
    headers: { "apikey": SERVICE_KEY },
  });
  if (!health.ok) throw new Error("Supabase unreachable");
  console.log("   ✓ Connected to Supabase (project: fplntugopnypjxdwqnpb)\n");

  // ── 2. Create tables ──────────────────────────────────────────────────────
  console.log("2. Creating tables (if not exist)...");
  const CREATE_TABLES = `
    -- Categories
    CREATE TABLE IF NOT EXISTS categories (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      slug       TEXT UNIQUE NOT NULL,
      icon       TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Users
    CREATE TABLE IF NOT EXISTS users (
      id              TEXT PRIMARY KEY,
      name            TEXT NOT NULL,
      email           TEXT UNIQUE NOT NULL,
      hashed_password TEXT,
      role            TEXT NOT NULL DEFAULT 'LEARNER',
      image           TEXT,
      locale          TEXT DEFAULT 'th',
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    );

    -- Courses
    CREATE TABLE IF NOT EXISTS courses (
      id               TEXT PRIMARY KEY,
      title            TEXT NOT NULL,
      slug             TEXT UNIQUE NOT NULL,
      description      TEXT,
      instructor_id    TEXT NOT NULL REFERENCES users(id),
      category_id      TEXT REFERENCES categories(id),
      price            NUMERIC(10,2),
      currency         TEXT DEFAULT 'THB',
      status           TEXT NOT NULL DEFAULT 'DRAFT',
      language         TEXT DEFAULT 'th',
      level            TEXT DEFAULT 'BEGINNER',
      thumbnail        TEXT,
      total_duration   INTEGER DEFAULT 0,
      lesson_count     INTEGER DEFAULT 0,
      enrollment_count INTEGER DEFAULT 0,
      average_rating   NUMERIC(3,2),
      is_bestseller    BOOLEAN DEFAULT FALSE,
      is_new           BOOLEAN DEFAULT FALSE,
      created_at       TIMESTAMPTZ DEFAULT NOW(),
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    );

    -- Chapters
    CREATE TABLE IF NOT EXISTS chapters (
      id         TEXT PRIMARY KEY,
      course_id  TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title      TEXT NOT NULL,
      "order"    INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Lessons
    CREATE TABLE IF NOT EXISTS lessons (
      id           TEXT PRIMARY KEY,
      chapter_id   TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      course_id    TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title        TEXT NOT NULL,
      type         TEXT NOT NULL DEFAULT 'VIDEO',
      "order"      INTEGER NOT NULL DEFAULT 1,
      duration     INTEGER,
      is_free      BOOLEAN DEFAULT FALSE,
      youtube_url  TEXT,
      content      TEXT,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enrollments
    CREATE TABLE IF NOT EXISTS enrollments (
      id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      user_id     TEXT NOT NULL REFERENCES users(id),
      course_id   TEXT NOT NULL REFERENCES courses(id),
      paid_amount NUMERIC(10,2) DEFAULT 0,
      enrolled_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, course_id)
    );

    -- Lesson Progress
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      user_id        TEXT NOT NULL REFERENCES users(id),
      lesson_id      TEXT NOT NULL REFERENCES lessons(id),
      course_id      TEXT NOT NULL REFERENCES courses(id),
      completed_at   TIMESTAMPTZ,
      watch_position INTEGER DEFAULT 0,
      UNIQUE(user_id, lesson_id)
    );

    -- Webboard Posts
    CREATE TABLE IF NOT EXISTS webboard_posts (
      id          TEXT PRIMARY KEY,
      author_id   TEXT NOT NULL REFERENCES users(id),
      category    TEXT NOT NULL DEFAULT 'GENERAL',
      title       TEXT NOT NULL,
      content     TEXT NOT NULL,
      pinned      BOOLEAN DEFAULT FALSE,
      reply_count INTEGER DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    -- Webboard Replies
    CREATE TABLE IF NOT EXISTS webboard_replies (
      id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      post_id    TEXT NOT NULL REFERENCES webboard_posts(id) ON DELETE CASCADE,
      author_id  TEXT NOT NULL REFERENCES users(id),
      content    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
    ALTER TABLE courses        ENABLE ROW LEVEL SECURITY;
    ALTER TABLE chapters       ENABLE ROW LEVEL SECURITY;
    ALTER TABLE lessons        ENABLE ROW LEVEL SECURITY;
    ALTER TABLE enrollments    ENABLE ROW LEVEL SECURITY;
    ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
    ALTER TABLE webboard_posts  ENABLE ROW LEVEL SECURITY;
    ALTER TABLE webboard_replies ENABLE ROW LEVEL SECURITY;

    -- Public read policies
    CREATE POLICY IF NOT EXISTS "public read categories"  ON categories     FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public read courses"     ON courses         FOR SELECT USING (status = 'PUBLISHED');
    CREATE POLICY IF NOT EXISTS "public read chapters"    ON chapters        FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public read lessons"     ON lessons         FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public read webboard"    ON webboard_posts  FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public read replies"     ON webboard_replies FOR SELECT USING (true);

    -- User-scoped policies
    CREATE POLICY IF NOT EXISTS "user enrollments"       ON enrollments     FOR ALL USING (auth.uid()::TEXT = user_id);
    CREATE POLICY IF NOT EXISTS "user progress"          ON lesson_progress  FOR ALL USING (auth.uid()::TEXT = user_id);
    CREATE POLICY IF NOT EXISTS "auth post webboard"     ON webboard_posts  FOR INSERT WITH CHECK (auth.uid()::TEXT = author_id);
    CREATE POLICY IF NOT EXISTS "auth reply webboard"    ON webboard_replies FOR INSERT WITH CHECK (auth.uid()::TEXT = author_id);
  `;

  const sqlRes = await sql(CREATE_TABLES);
  if (sqlRes?.skipped) {
    console.log("   ⚠ exec() RPC not available — tables must exist already.");
    console.log("   → Run migrations via Supabase Dashboard SQL Editor.\n");
  } else {
    console.log("   ✓ Tables created / verified\n");
  }

  // ── 3. Seed categories ────────────────────────────────────────────────────
  console.log("3. Seeding categories...");
  await upsert("categories", [
    { id: "cat_design",    name: "Design",     slug: "design",     icon: "palette" },
    { id: "cat_marketing", name: "การตลาด",   slug: "marketing",  icon: "megaphone" },
    { id: "cat_tech",      name: "เทคโนโลยี", slug: "tech",       icon: "cpu" },
    { id: "cat_finance",   name: "การเงิน",   slug: "finance",    icon: "trending" },
    { id: "cat_language",  name: "ภาษา",      slug: "language",   icon: "globe" },
    { id: "cat_business",  name: "ธุรกิจ",   slug: "business",   icon: "briefcase" },
    { id: "cat_lifestyle", name: "ไลฟ์สไตล์", slug: "lifestyle",  icon: "heart" },
  ]);

  // ── 4. Seed users ─────────────────────────────────────────────────────────
  console.log("4. Seeding users...");
  await upsert("users", [
    { id: "demo_learner_01",    name: "ปาริชาต วรรณกรรม",  email: "learner@plearn.co",    role: "LEARNER",    hashed_password: "demo_hash" },
    { id: "demo_instructor_01", name: "ดร.วิชาญ สอนดี",     email: "instructor@plearn.co", role: "INSTRUCTOR", hashed_password: "demo_hash" },
    { id: "demo_admin_01",      name: "ผู้ดูแลระบบ",         email: "admin@plearn.co",      role: "ADMIN",      hashed_password: "demo_hash" },
  ]);

  // ── 5. Seed courses ───────────────────────────────────────────────────────
  console.log("5. Seeding courses...");
  await upsert("courses", [
    {
      id: "course_01", title: "UX Design ขั้นพื้นฐาน: จากศูนย์สู่ Figma",
      slug: "ux-design-figma-fundamentals",
      description: "เรียนรู้กระบวนการออกแบบ UX ตั้งแต่ User Research ไปจนถึงการสร้าง Prototype ใน Figma",
      instructor_id: "demo_instructor_01", category_id: "cat_design",
      price: 1490, status: "PUBLISHED", level: "BEGINNER",
      total_duration: 28800, lesson_count: 8, enrollment_count: 1240,
      average_rating: 4.8, is_bestseller: true,
    },
    {
      id: "course_02", title: "Digital Marketing ครบสูตร: SEO, Meta Ads & Analytics",
      slug: "digital-marketing-complete",
      description: "เรียนรู้ Digital Marketing แบบครบวงจร ตั้งแต่ SEO ไปจนถึง Paid Ads",
      instructor_id: "demo_instructor_01", category_id: "cat_marketing",
      price: 1990, status: "PUBLISHED", level: "INTERMEDIATE",
      total_duration: 21600, lesson_count: 6, enrollment_count: 890,
      average_rating: 4.7, is_bestseller: false,
    },
    {
      id: "course_03", title: "Python สำหรับ Data Science & Machine Learning",
      slug: "python-data-science-ml",
      description: "เรียนรู้ Python สำหรับ Data Science และ Machine Learning ตั้งแต่พื้นฐาน",
      instructor_id: "demo_instructor_01", category_id: "cat_tech",
      price: 0, status: "PUBLISHED", level: "BEGINNER",
      total_duration: 18000, lesson_count: 6, enrollment_count: 2100,
      average_rating: 4.9, is_bestseller: true,
    },
  ]);

  // ── 6. Seed enrollments ───────────────────────────────────────────────────
  console.log("6. Seeding enrollments...");
  await upsert("enrollments", [
    { id: "enroll_01", user_id: "demo_learner_01", course_id: "course_01", paid_amount: 1490, enrolled_at: "2026-05-01T08:00:00Z" },
    { id: "enroll_02", user_id: "demo_learner_01", course_id: "course_02", paid_amount: 1990, enrolled_at: "2026-05-05T14:00:00Z" },
    { id: "enroll_03", user_id: "demo_learner_01", course_id: "course_03", paid_amount: 0,    enrolled_at: "2026-05-08T10:00:00Z" },
  ]);

  // ── 7. Seed webboard posts ────────────────────────────────────────────────
  console.log("7. Seeding webboard posts...");
  await upsert("webboard_posts", [
    { id: "post_001", author_id: "demo_admin_01",      category: "GENERAL",  title: "ยินดีต้อนรับสู่ Webboard Plearn!", content: "สวัสดีทุกคน! ยินดีต้อนรับสู่ชุมชนของ Plearn", pinned: true,  reply_count: 5, created_at: "2026-05-01T08:00:00Z" },
    { id: "post_002", author_id: "demo_learner_01",    category: "QA",       title: "สอบถามเรื่อง Figma — Prototype ไม่ทำงาน",           content: "กำลังเรียนคอร์ส UX Design อยู่ พอทำ Prototype แล้ว Link ไม่ทำงาน", pinned: false, reply_count: 3, created_at: "2026-05-20T10:30:00Z" },
    { id: "post_003", author_id: "demo_learner_01",    category: "SHOWCASE", title: "แชร์ผลงาน: Dashboard Design จากคอร์ส UX",          content: "เรียนจบบทที่ 3 แล้ว ลองทำ Dashboard สำหรับแอป Fitness Tracker", pinned: false, reply_count: 8, created_at: "2026-05-22T14:00:00Z" },
    { id: "post_004", author_id: "demo_instructor_01", category: "GENERAL",  title: "อัปเดต: เพิ่มบทเรียนใหม่ในคอร์ส UX Design แล้ว!", content: "เพิ่งอัปโหลดบทเรียนใหม่เข้าคอร์ส UX Design",           pinned: false, reply_count: 2, created_at: "2026-05-27T11:00:00Z" },
  ]);

  console.log("\n✅ Seed complete!\n");
  console.log("Summary:");
  console.log("  • 7 categories");
  console.log("  • 3 demo users (learner / instructor / admin)");
  console.log("  • 3 courses (UX Design, Digital Marketing, Python)");
  console.log("  • 3 enrollments for demo_learner_01");
  console.log("  • 4 webboard posts");
  console.log("\nNote: Tables may not have been created if exec() RPC is unavailable.");
  console.log("In that case, copy the SQL from scripts/create-tables.sql and run it");
  console.log("in Supabase Dashboard → SQL Editor.\n");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
