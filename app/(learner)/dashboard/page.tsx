import Link from "next/link";
import type { Metadata } from "next";
import { MOCK_COURSES } from "@/mock";
import { CourseCard } from "@/components/course/CourseCard";
import { formatNumber } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { getEnrolledIds, getCourseProgress } from "@/lib/enrollment";

export const metadata: Metadata = { title: "แดชบอร์ด" };

const LEVEL_COLOR: Record<string, string> = {
  BRONZE: "#CD7F32", SILVER: "#A8A9AD", GOLD: "#F4C430", PLATINUM: "#E5E4E2", DIAMOND: "#B9F2FF",
};

function getLevel(xp: number): string {
  if (xp >= 5000) return "DIAMOND";
  if (xp >= 2000) return "PLATINUM";
  if (xp >= 1000) return "GOLD";
  if (xp >= 500)  return "SILVER";
  return "BRONZE";
}

const THUMB_MAP: Record<string, string> = {
  design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
  finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
  lifestyle: "thumb-lifestyle",
};

export default function DashboardPage() {
  const session     = getSession();
  const enrolledIds = session ? getEnrolledIds(session.id) : [];

  // Aggregate progress across all enrolled courses
  let totalCompleted = 0;
  let totalCerts     = 0;

  type CourseRow = {
    course:       typeof MOCK_COURSES[number];
    progress:     number;
    nextLessonId: string | null;
    completedIds: Set<string>;
    totalLessons: number;
    allLessons:   import("@/mock").MockLesson[];
  };

  const courseRows: CourseRow[] = enrolledIds
    .map((courseId) => {
      const course = MOCK_COURSES.find((c) => c.id === courseId);
      if (!course) return null;
      const prog = getCourseProgress(courseId);
      totalCompleted += prog.completedIds.size;
      if (prog.progress === 100) totalCerts++;
      return { course, ...prog };
    })
    .filter((x): x is CourseRow => x !== null);

  const xp    = totalCompleted * 10;
  const level = getLevel(xp);

  // Prioritise in-progress, then not-started — limit to 3 for the dashboard strip
  const inProgress  = courseRows.filter((r) => r.progress > 0 && r.progress < 100);
  const notStarted  = courseRows.filter((r) => r.progress === 0);
  const continueCourses = [...inProgress, ...notStarted].slice(0, 3);

  const recommendedCourses = MOCK_COURSES.filter((c) => !enrolledIds.includes(c.id)).slice(0, 4);

  return (
    <div className="plearn-container py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>ยินดีต้อนรับกลับ</p>
        <h1 className="text-display-m" style={{ color: "var(--ink)" }}>
          {session?.name ?? "แดชบอร์ด"}
        </h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {([
          { label: "คอร์สที่เรียน",   value: enrolledIds.length.toString(),  sub: "คอร์ส" },
          { label: "บทเรียนสำเร็จ",  value: totalCompleted.toString(),        sub: "บทเรียน" },
          {
            label: "XP สะสม",
            value: formatNumber(xp),
            sub: <span className="font-mono text-xs font-medium" style={{ color: LEVEL_COLOR[level] }}>{level}</span>,
          },
          { label: "ใบรับรอง",        value: totalCerts.toString(),           sub: "ใบ" },
        ] as const).map((kpi, i) => (
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

          {continueCourses.length === 0 ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{ background: "var(--paper)", borderColor: "var(--line)" }}
            >
              <p className="text-body mb-4" style={{ color: "var(--ink-3)" }}>
                ยังไม่ได้ลงทะเบียนคอร์สใดเลย
              </p>
              <Link href="/courses" className="plearn-btn plearn-btn-primary">
                ค้นหาคอร์ส
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {continueCourses.map(({ course, progress, nextLessonId }) => {
                const thumbClass = THUMB_MAP[course.category?.slug ?? ""] ?? "thumb-default";
                const href = nextLessonId
                  ? `/my-courses/${course.id}/learn/${nextLessonId}`
                  : `/my-courses/${course.id}`;
                return (
                  <div
                    key={course.id}
                    className="rounded-xl border p-4 flex gap-4 items-center"
                    style={{ background: "var(--paper)", borderColor: "var(--line)" }}
                  >
                    <div className={`w-16 h-16 rounded-lg shrink-0 ${thumbClass}`} />
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
                    <Link href={href} className="plearn-btn plearn-btn-primary shrink-0">
                      {progress === 0 ? "เริ่มเรียน" : "เรียนต่อ"}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Progress summary card */}
          <div className="rounded-xl p-6" style={{ background: "var(--ink)" }}>
            <p className="text-label mb-1" style={{ color: "rgba(255,252,246,0.5)" }}>ความก้าวหน้า</p>
            <p className="font-serif font-medium mb-4" style={{ fontSize: "20px", color: "var(--paper)" }}>
              {totalCompleted} บทเรียนสำเร็จ
            </p>
            <div className="plearn-progress mb-2" style={{ background: "rgba(255,252,246,0.15)" }}>
              <div
                className="plearn-progress__bar"
                style={{
                  width: `${enrolledIds.length > 0 ? Math.round((totalCerts / enrolledIds.length) * 100) : 0}%`,
                }}
              />
            </div>
            <p className="text-caption" style={{ color: "rgba(255,252,246,0.5)" }}>
              {totalCerts} / {enrolledIds.length} คอร์สเรียนจบ
            </p>
          </div>

          {/* Browse CTA */}
          <div
            className="rounded-xl border p-5"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}
          >
            <p className="text-body-s font-medium mb-3" style={{ color: "var(--ink)" }}>
              เพิ่มคอร์สใหม่
            </p>
            <Link href="/courses" className="plearn-btn plearn-btn-line w-full justify-center">
              ค้นหาคอร์ส
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended courses */}
      {recommendedCourses.length > 0 && (
        <div className="mt-12">
          <h2 className="text-h2 mb-6" style={{ color: "var(--ink)" }}>แนะนำสำหรับคุณ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
