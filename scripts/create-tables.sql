-- Plearn LMS — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query

-- ─── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  icon       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  hashed_password TEXT,
  role            TEXT NOT NULL DEFAULT 'LEARNER' CHECK (role IN ('LEARNER','INSTRUCTOR','ADMIN','SUPER_ADMIN')),
  image           TEXT,
  locale          TEXT DEFAULT 'th',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Courses ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT,
  instructor_id    TEXT NOT NULL REFERENCES users(id),
  category_id      TEXT REFERENCES categories(id),
  price            NUMERIC(10,2),
  currency         TEXT DEFAULT 'THB',
  status           TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  language         TEXT DEFAULT 'th',
  level            TEXT DEFAULT 'BEGINNER' CHECK (level IN ('BEGINNER','INTERMEDIATE','ADVANCED','ALL_LEVELS')),
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

-- ─── Chapters ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chapters (
  id         TEXT PRIMARY KEY,
  course_id  TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  "order"    INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Lessons ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id          TEXT PRIMARY KEY,
  chapter_id  TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  course_id   TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'VIDEO' CHECK (type IN ('VIDEO','TEXT','QUIZ','PDF')),
  "order"     INTEGER NOT NULL DEFAULT 1,
  duration    INTEGER,
  is_free     BOOLEAN DEFAULT FALSE,
  youtube_url TEXT,
  content     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Enrollments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id     TEXT NOT NULL REFERENCES users(id),
  course_id   TEXT NOT NULL REFERENCES courses(id),
  paid_amount NUMERIC(10,2) DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ─── Lesson Progress ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id        TEXT NOT NULL REFERENCES users(id),
  lesson_id      TEXT NOT NULL REFERENCES lessons(id),
  course_id      TEXT NOT NULL REFERENCES courses(id),
  completed_at   TIMESTAMPTZ,
  watch_position INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- ─── Webboard ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webboard_posts (
  id          TEXT PRIMARY KEY,
  author_id   TEXT NOT NULL REFERENCES users(id),
  category    TEXT NOT NULL DEFAULT 'GENERAL' CHECK (category IN ('GENERAL','QA','SHOWCASE','FEEDBACK')),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  pinned      BOOLEAN DEFAULT FALSE,
  reply_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webboard_replies (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  post_id    TEXT NOT NULL REFERENCES webboard_posts(id) ON DELETE CASCADE,
  author_id  TEXT NOT NULL REFERENCES users(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE webboard_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE webboard_replies ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public read categories"  ON categories     FOR SELECT USING (true);
CREATE POLICY "public read courses"     ON courses        FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "public read chapters"    ON chapters       FOR SELECT USING (true);
CREATE POLICY "public read lessons"     ON lessons        FOR SELECT USING (true);
CREATE POLICY "public read webboard"    ON webboard_posts FOR SELECT USING (true);
CREATE POLICY "public read replies"     ON webboard_replies FOR SELECT USING (true);

-- User-scoped write
CREATE POLICY "user enrollments"      ON enrollments     FOR ALL  USING (auth.uid()::TEXT = user_id);
CREATE POLICY "user progress"         ON lesson_progress  FOR ALL  USING (auth.uid()::TEXT = user_id);
CREATE POLICY "auth post webboard"    ON webboard_posts  FOR INSERT WITH CHECK (auth.uid()::TEXT = author_id);
CREATE POLICY "auth reply webboard"   ON webboard_replies FOR INSERT WITH CHECK (auth.uid()::TEXT = author_id);
