import Link from "next/link";
import { CourseGrid } from "@/components/course/CourseGrid";
import { MOCK_COURSES, MOCK_CATEGORIES } from "@/mock";
import { formatNumber } from "@/lib/utils";

export const revalidate = 3600; // ISR 1 hour

const STATS = [
  { value: "247",    label: "คอร์ส" },
  { value: "50,000", label: "ผู้เรียน" },
  { value: "500",    label: "ผู้สอน" },
  { value: "4.8",    label: "คะแนนเฉลี่ย" },
];

const LEARNING_PATHS = [
  {
    title: "นักการตลาดดิจิทัล",
    subtitle: "3 คอร์ส · 12 สัปดาห์",
    slug: "digital-marketer",
    class: "thumb-marketing",
  },
  {
    title: "นักพัฒนา Full-Stack",
    subtitle: "5 คอร์ส · 24 สัปดาห์",
    slug: "fullstack-developer",
    class: "thumb-tech",
  },
  {
    title: "ผู้บริหารมือใหม่",
    subtitle: "4 คอร์ส · 16 สัปดาห์",
    slug: "new-manager",
    class: "thumb-business",
  },
];

export default function HomePage() {
  const featuredCourses = MOCK_COURSES.filter((c) => c.status === "PUBLISHED").slice(0, 8);
  const bestsellers     = MOCK_COURSES.filter((c) => c.isBestseller);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="plearn-container py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <span
              className="badge badge-new mb-4 inline-flex"
            >
              แพลตฟอร์มใหม่
            </span>
            <h1
              className="text-display-l mb-6"
              style={{ color: "var(--ink)" }}
            >
              เรียน<em style={{ color: "var(--vermilion)", fontStyle: "italic" }}>เพลิน</em>
              <br />
              เก่งจริงในงานที่ทำ
            </h1>
            <p className="text-body-l mb-8 max-w-md" style={{ color: "var(--ink-3)" }}>
              คอร์สออนไลน์คุณภาพสูงจากผู้เชี่ยวชาญที่ทำงานจริง
              พร้อมใบรับรองที่นายจ้างยอมรับ
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/courses" className="plearn-btn plearn-btn-primary plearn-btn-lg">
                เริ่มเรียนฟรี
              </Link>
              <Link href="/pricing" className="plearn-btn plearn-btn-line plearn-btn-lg">
                ดูแผนราคา
              </Link>
            </div>
          </div>

          {/* Stats collage */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-6 border"
                style={{
                  background: "var(--paper)",
                  borderColor: "var(--line)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p
                  className="font-serif font-medium"
                  style={{ fontSize: "36px", color: "var(--ink)", lineHeight: 1.1 }}
                >
                  {s.value}
                </p>
                <p className="text-caption mt-1" style={{ color: "var(--ink-3)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category chips ─────────────────────────────────────────────────── */}
      <section
        className="border-y py-5"
        style={{ borderColor: "var(--line)", background: "var(--paper)" }}
      >
        <div className="plearn-container">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/courses"
              className="plearn-btn plearn-btn-line shrink-0 text-sm"
            >
              ทั้งหมด
            </Link>
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="plearn-btn plearn-btn-ghost shrink-0 text-sm"
                style={{ borderColor: "var(--line)" }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured courses ────────────────────────────────────────────────── */}
      <section className="plearn-container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-label mb-2" style={{ color: "var(--ink-3)" }}>
              คอร์สแนะนำ
            </p>
            <h2 className="text-h1" style={{ color: "var(--ink)" }}>
              เริ่มเรียนวันนี้
            </h2>
          </div>
          <Link
            href="/courses"
            className="plearn-btn plearn-btn-ghost text-sm"
            style={{ color: "var(--vermilion)" }}
          >
            ดูทั้งหมด →
          </Link>
        </div>
        <CourseGrid courses={featuredCourses} columns={4} />
      </section>

      {/* ── Learning paths ──────────────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}
      >
        <div className="plearn-container">
          <div className="mb-8">
            <p className="text-label mb-2" style={{ color: "var(--ink-3)" }}>
              Learning Paths
            </p>
            <h2 className="text-h1" style={{ color: "var(--ink)" }}>
              เส้นทางการเรียนรู้
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LEARNING_PATHS.map((path) => (
              <Link key={path.slug} href={`/courses?path=${path.slug}`}>
                <div className={`plearn-path-card ${path.class}`}>
                  <div className="absolute top-4 right-4 opacity-70">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.8">
                      <path d="M4 16L16 4M16 4H8M16 4v8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p
                    className="text-label mb-3"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    LEARNING PATH
                  </p>
                  <h3
                    className="font-serif font-medium mb-2"
                    style={{ fontSize: "22px", lineHeight: 1.25 }}
                  >
                    {path.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
                    {path.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers ─────────────────────────────────────────────────────── */}
      {bestsellers.length > 0 && (
        <section className="plearn-container py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-label mb-2" style={{ color: "var(--ink-3)" }}>
                ยอดนิยม
              </p>
              <h2 className="text-h1" style={{ color: "var(--ink)" }}>
                คอร์สขายดี
              </h2>
            </div>
          </div>
          <CourseGrid courses={bestsellers} columns={4} />
        </section>
      )}

      {/* ── Testimonial banner ──────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: "var(--ink)" }}
      >
        <div className="plearn-container text-center">
          <p
            className="font-serif font-medium mx-auto max-w-2xl"
            style={{ fontSize: "28px", color: "var(--paper)", lineHeight: 1.4 }}
          >
            &ldquo;คุณอยู่ห่างจากใบรับรองใบถัดไป
            เพียง <em style={{ color: "var(--vermilion)" }}>3 บทเรียน</em>&rdquo;
          </p>
          <div className="mt-8">
            <Link href="/signup" className="plearn-btn plearn-btn-primary plearn-btn-lg">
              เริ่มต้นฟรีวันนี้
            </Link>
          </div>
        </div>
      </section>

      {/* ── Business CTA ────────────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: "var(--pine)" }}
      >
        <div className="plearn-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-label mb-3" style={{ color: "var(--pine-soft)" }}>
                สำหรับองค์กร
              </p>
              <h2
                className="font-serif font-medium mb-4"
                style={{ fontSize: "36px", color: "var(--paper)", lineHeight: 1.2 }}
              >
                ฝึกอบรมพนักงาน
                <br />
                ทั้งองค์กรในที่เดียว
              </h2>
              <p className="text-body mb-6" style={{ color: "rgba(255,252,246,0.75)" }}>
                จัดการการเรียนรู้, ติดตามความก้าวหน้า, และออกใบรับรอง
                สำหรับพนักงานหลายร้อยคนได้อย่างง่ายดาย
              </p>
              <Link href="/contact" className="plearn-btn plearn-btn-primary plearn-btn-lg">
                ติดต่อทีมธุรกิจ
              </Link>
            </div>
            <div
              className="rounded-xl p-8 border"
              style={{
                background: "rgba(255,252,246,0.06)",
                borderColor: "rgba(255,252,246,0.12)",
              }}
            >
              {[
                { label: "จำนวนผู้เรียน",    value: formatNumber(50000) },
                { label: "อัตราสำเร็จ",      value: "42%" },
                { label: "คอร์สในคลัง",      value: "247+" },
                { label: "ผู้สอนมืออาชีพ",   value: "500+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                  style={{ borderColor: "rgba(255,252,246,0.1)" }}
                >
                  <span style={{ color: "rgba(255,252,246,0.65)", fontSize: "14px" }}>
                    {stat.label}
                  </span>
                  <span
                    className="font-mono font-medium"
                    style={{ color: "var(--paper)", fontSize: "16px" }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
