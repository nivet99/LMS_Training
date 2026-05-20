import Link from "next/link";
import type { Metadata } from "next";
import { MOCK_COURSES } from "@/mock";
import { CourseCard } from "@/components/course/CourseCard";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "แดชบอร์ด" };

const MOCK_STREAK = { current: 12, calendar: [true, true, false, true, true, true, true] };
const MOCK_XP     = 1850;
const MOCK_LEVEL  = "GOLD";

const LEVEL_COLOR: Record<string, string> = {
  BRONZE:   "#CD7F32",
  SILVER:   "#A8A9AD",
  GOLD:     "#F4C430",
  PLATINUM: "#E5E4E2",
  DIAMOND:  "#B9F2FF",
};

export default function DashboardPage() {
  const inProgressCourses   = MOCK_COURSES.slice(0, 3);
  const recommendedCourses  = MOCK_COURSES.slice(4, 8);

  return (
    <div className="plearn-container py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>ยินดีต้อนรับกลับ</p>
          <h1 className="text-display-m" style={{ color: "var(--ink)" }}>แดชบอร์ด</h1>
        </div>
        {/* Streak card */}
        <div
          className="rounded-xl border px-5 py-4 flex items-center gap-4"
          style={{ background: "var(--paper)", borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="var(--vermilion)">
                <path d="M8 1C5 5 3 7 3 10a5 5 0 0010 0c0-3-2-5-5-9z"/>
              </svg>
              <span className="font-mono font-medium" style={{ fontSize: "20px", color: "var(--ink)" }}>
                {MOCK_STREAK.current}
              </span>
            </div>
            <p className="text-caption" style={{ color: "var(--ink-3)" }}>วันติดต่อกัน</p>
          </div>
          <div className="flex gap-1">
            {MOCK_STREAK.calendar.map((done, i) => (
              <div
                key={i}
                className="streak-day rounded"
                style={{ background: done ? "var(--vermilion)" : "var(--cream-2)" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "คอร์สที่กำลังเรียน", value: "3",                    sub: "คอร์ส" },
          { label: "บทเรียนสำเร็จ",      value: "47",                   sub: "บทเรียน" },
          {
            label: "XP สะสม",
            value: formatNumber(MOCK_XP),
            sub: (
              <span className="font-mono text-xs font-medium" style={{ color: LEVEL_COLOR[MOCK_LEVEL] }}>
                {MOCK_LEVEL}
              </span>
            ),
          },
          { label: "ใบรับรอง",           value: "2",                    sub: "ใบ" },
        ].map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl border p-5"
            style={{ background: "var(--paper)", borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
          >
            <p className="text-caption mb-1" style={{ color: "var(--ink-3)" }}>{kpi.label}</p>
            <p className="font-serif font-medium" style={{ fontSize: "28px", color: "var(--ink)", lineHeight: 1.1 }}>
              {kpi.value}
            </p>
            <p className="text-caption mt-0.5" style={{ color: "var(--ink-4)" }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Left: continue learning */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-h2" style={{ color: "var(--ink)" }}>เรียนต่อ</h2>
            <Link href="/my-courses" className="text-body-s" style={{ color: "var(--vermilion)" }}>
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="space-y-3">
            {inProgressCourses.map((course, idx) => {
              const progress = [35, 68, 12][idx] ?? 0;
              return (
                <div
                  key={course.id}
                  className="rounded-xl border p-4 flex gap-4 items-center"
                  style={{ background: "var(--paper)", borderColor: "var(--line)" }}
                >
                  {/* Thumb */}
                  <div
                    className={`w-16 h-16 rounded-lg shrink-0 ${
                      { design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
                        finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
                        lifestyle: "thumb-lifestyle" }[course.category?.slug ?? ""] ?? "thumb-default"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-s font-medium truncate" style={{ color: "var(--ink)" }}>
                      {course.title}
                    </p>
                    <p className="text-caption mb-2" style={{ color: "var(--ink-3)" }}>
                      {course.instructor.name}
                    </p>
                    <div className="plearn-progress">
                      <div className="plearn-progress__bar" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-caption-s mt-1" style={{ color: "var(--ink-4)" }}>
                      {progress}% สำเร็จ
                    </p>
                  </div>
                  <Link
                    href={`/my-courses/${course.id}/learn/${course.id}_lesson1`}
                    className="plearn-btn plearn-btn-primary shrink-0"
                  >
                    เรียนต่อ
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Monthly goal */}
          <div className="rounded-xl p-6" style={{ background: "var(--ink)" }}>
            <p className="text-label mb-1" style={{ color: "rgba(255,252,246,0.5)" }}>เป้าหมายเดือนนี้</p>
            <p className="font-serif font-medium mb-4" style={{ fontSize: "20px", color: "var(--paper)" }}>
              เรียน 10 บทเรียน
            </p>
            <div className="plearn-progress mb-2" style={{ background: "rgba(255,252,246,0.15)" }}>
              <div className="plearn-progress__bar" style={{ width: "70%" }} />
            </div>
            <p className="text-caption" style={{ color: "rgba(255,252,246,0.5)" }}>7 / 10 บทเรียน</p>
          </div>

          {/* Upcoming */}
          <div
            className="rounded-xl border p-5"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}
          >
            <p className="text-label mb-3" style={{ color: "var(--ink-3)" }}>กิจกรรมที่กำลังจะมาถึง</p>
            <div className="space-y-3">
              {[
                { time: "พรุ่งนี้ 19:00", label: "Live Class: React Hooks Deep Dive" },
                { time: "ศุกร์ 20:00",    label: "Live Class: UI Design Principles" },
              ].map((ev) => (
                <div key={ev.label} className="flex gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: "var(--vermilion)" }}
                  />
                  <div>
                    <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>{ev.label}</p>
                    <p className="text-caption" style={{ color: "var(--ink-3)" }}>{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended courses */}
      <div className="mt-12">
        <h2 className="text-h2 mb-6" style={{ color: "var(--ink)" }}>แนะนำสำหรับคุณ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
