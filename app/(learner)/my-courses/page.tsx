import Link from "next/link";
import type { Metadata } from "next";
import { MOCK_COURSES, MOCK_ENROLLMENTS, MOCK_CHAPTERS, MOCK_PROGRESS } from "@/mock";

export const metadata: Metadata = { title: "คอร์สของฉัน" };

function getCourseProgress(courseId: string): number {
  const chapters = MOCK_CHAPTERS[courseId] ?? [];
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  if (allLessons.length === 0) return 0;
  const completed = allLessons.filter((l) => MOCK_PROGRESS[l.id]?.completedAt).length;
  return Math.round((completed / allLessons.length) * 100);
}

function getLastLesson(courseId: string): string | null {
  const chapters = MOCK_CHAPTERS[courseId] ?? [];
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  // last lesson with progress
  const withProgress = allLessons.filter((l) => MOCK_PROGRESS[l.id]);
  if (withProgress.length === 0) return allLessons[0]?.id ?? null;
  return withProgress[withProgress.length - 1].id;
}

const THUMB_MAP: Record<string, string> = {
  design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
  finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
  lifestyle: "thumb-lifestyle",
};

export default function MyCoursesPage() {
  const enrolledCourses = MOCK_ENROLLMENTS.map((en) => {
    const course = MOCK_COURSES.find((c) => c.id === en.courseId);
    if (!course) return null;
    const progress = getCourseProgress(en.courseId);
    const lastLessonId = getLastLesson(en.courseId);
    return { course, progress, lastLessonId, enrolledAt: en.enrolledAt };
  }).filter(Boolean) as { course: typeof MOCK_COURSES[number]; progress: number; lastLessonId: string | null; enrolledAt: string }[];

  return (
    <div className="plearn-container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>พื้นที่เรียนรู้</p>
          <h1 className="text-display-m" style={{ color: "var(--ink)" }}>คอร์สของฉัน</h1>
        </div>
        <Link href="/courses" className="plearn-btn plearn-btn-line">
          เพิ่มคอร์ส
        </Link>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "var(--cream-2)" }}>
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="var(--ink-4)" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-h2 mb-2" style={{ color: "var(--ink)" }}>ยังไม่มีคอร์สที่เรียน</p>
          <p className="text-body mb-6" style={{ color: "var(--ink-3)" }}>เริ่มต้นเรียนรู้กับคอร์สคุณภาพกว่า 247 คอร์ส</p>
          <Link href="/courses" className="plearn-btn plearn-btn-primary plearn-btn-lg">
            ค้นหาคอร์ส
          </Link>
        </div>
      ) : (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "คอร์สทั้งหมด",   value: enrolledCourses.length },
              { label: "กำลังเรียน",       value: enrolledCourses.filter((e) => e.progress > 0 && e.progress < 100).length },
              { label: "เรียนจบแล้ว",     value: enrolledCourses.filter((e) => e.progress === 100).length },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border p-4 text-center"
                style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
                <p className="font-serif font-medium text-3xl" style={{ color: "var(--ink)" }}>{stat.value}</p>
                <p className="text-caption mt-1" style={{ color: "var(--ink-3)" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Course cards */}
          <div className="space-y-4">
            {enrolledCourses.map(({ course, progress, lastLessonId }) => {
              const thumbClass = THUMB_MAP[course.category?.slug ?? ""] ?? "thumb-default";
              const isComplete = progress === 100;
              const continueUrl = lastLessonId
                ? `/my-courses/${course.id}/learn/${lastLessonId}`
                : `/my-courses/${course.id}`;

              return (
                <div key={course.id}
                  className="rounded-xl border overflow-hidden flex"
                  style={{ background: "var(--paper)", borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}>
                  {/* Thumbnail */}
                  <div className={`w-40 shrink-0 ${thumbClass}`} />

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <h2 className="text-body font-medium flex-1 min-w-0" style={{ color: "var(--ink)" }}>
                          {course.title}
                        </h2>
                        {isComplete && (
                          <span className="badge shrink-0" style={{
                            background: "var(--pine-soft)", color: "var(--pine)",
                            fontSize: "10px", padding: "2px 8px",
                          }}>
                            เรียนจบแล้ว
                          </span>
                        )}
                      </div>
                      <p className="text-caption mb-3" style={{ color: "var(--ink-3)" }}>
                        {course.instructor.name}
                      </p>
                      {/* Progress bar */}
                      <div className="plearn-progress mb-1">
                        <div className="plearn-progress__bar" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-caption-s" style={{ color: "var(--ink-4)" }}>
                        {progress}% สำเร็จ
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <Link href={continueUrl} className="plearn-btn plearn-btn-primary">
                        {progress === 0 ? "เริ่มเรียน" : isComplete ? "ทบทวน" : "เรียนต่อ"}
                      </Link>
                      <Link href={`/my-courses/${course.id}`}
                        className="plearn-btn plearn-btn-ghost text-sm" style={{ color: "var(--ink-3)" }}>
                        เนื้อหาคอร์ส
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
