import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { MOCK_COURSES, MOCK_CHAPTERS } from "@/mock";
import { formatCurrency, formatDuration, formatNumber } from "@/lib/utils";
import { CourseStatusBadge } from "@/components/course/CourseStatusBadge";
import { getSession } from "@/lib/session";
import { getEnrolledIds, getCourseProgress } from "@/lib/enrollment";
import { enrollCourse } from "@/actions/courses/enroll";

export const revalidate = 0; // always fresh (enrollment state depends on cookies)

export async function generateStaticParams() {
  return MOCK_COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = MOCK_COURSES.find((c) => c.slug === params.slug);
  if (!course) return { title: "ไม่พบคอร์ส" };
  return { title: course.title, description: course.description.slice(0, 160) };
}

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: "เริ่มต้น", INTERMEDIATE: "กลาง", ADVANCED: "ขั้นสูง", ALL_LEVELS: "ทุกระดับ",
};

const THUMB_MAP: Record<string, string> = {
  design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
  finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
  lifestyle: "thumb-lifestyle",
};

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = MOCK_COURSES.find((c) => c.slug === params.slug);
  if (!course) notFound();

  const isFree     = !course.price || Number(course.price) === 0;
  const thumbClass = THUMB_MAP[course.category?.slug ?? ""] ?? "thumb-default";

  // Auth + enrollment state
  const session     = getSession();
  const enrolledIds = session ? getEnrolledIds(session.id) : [];
  const isEnrolled  = enrolledIds.includes(course.id);

  // Find first lesson for "Continue" link
  const chapters    = MOCK_CHAPTERS[course.id] ?? [];
  const firstLesson = chapters[0]?.lessons[0];
  const continueUrl = isEnrolled && firstLesson
    ? `/my-courses/${course.id}/learn/${firstLesson.id}`
    : null;

  // Progress if enrolled
  const prog = isEnrolled ? getCourseProgress(course.id) : null;

  // Bind enrollCourse to this course's ID
  const enrollAction = enrollCourse.bind(null, course.id);

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ background: "var(--ink)" }} className="py-14">
        <div className="plearn-container">
          <div className="grid lg:grid-cols-[1fr_460px] gap-14 items-start">
            {/* Left */}
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-6 text-caption" style={{ color: "rgba(255,252,246,0.5)" }}>
                <Link href="/courses" className="hover:underline">คอร์ส</Link>
                <span>›</span>
                <span style={{ color: "rgba(255,252,246,0.75)" }}>{course.category?.name}</span>
              </div>

              <h1 className="text-display-l mb-4" style={{ color: "var(--paper)" }}>
                {course.title}
              </h1>
              <p className="text-body-l mb-6 max-w-xl" style={{ color: "rgba(255,252,246,0.75)" }}>
                {course.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {course.averageRating && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium" style={{ color: "var(--mustard)" }}>
                      {course.averageRating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} viewBox="0 0 12 12" className="w-3.5 h-3.5"
                          fill={i < Math.round(course.averageRating!) ? "var(--mustard)" : "none"}
                          stroke="var(--mustard)" strokeWidth="1">
                          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-caption" style={{ color: "rgba(255,252,246,0.5)" }}>
                      ({formatNumber(course.enrollmentCount ?? 0)} ผู้เรียน)
                    </span>
                  </div>
                )}
                <span className="badge" style={{ background: "rgba(255,252,246,0.1)", color: "rgba(255,252,246,0.65)" }}>
                  {LEVEL_LABEL[course.level] ?? course.level}
                </span>
                {course.totalDuration && (
                  <span className="text-caption" style={{ color: "rgba(255,252,246,0.5)" }}>
                    {formatDuration(course.totalDuration)}
                  </span>
                )}
                <CourseStatusBadge status={course.status} />
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: "var(--vermilion)", color: "var(--paper)" }}>
                  {course.instructor.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="text-caption-s" style={{ color: "rgba(255,252,246,0.5)" }}>ผู้สอน</p>
                  <p className="text-body-s font-medium" style={{ color: "var(--paper)" }}>
                    {course.instructor.name}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Enroll card ── */}
            <div className="plearn-enroll-card rounded-xl overflow-hidden sticky top-20" style={{ background: "var(--paper)" }}>
              <div className={`w-full aspect-video ${thumbClass}`} />
              <div className="p-6">
                {/* Price */}
                <p className="font-serif font-medium mb-1" style={{ fontSize: "32px", color: "var(--ink)" }}>
                  {isFree ? "ฟรี" : formatCurrency(course.price!, course.currency)}
                </p>

                {/* CTA buttons */}
                <div className="space-y-2.5 mt-5">
                  {!session ? (
                    // Not logged in → prompt to login
                    <Link
                      href={`/login?callbackUrl=/courses/${course.slug}`}
                      className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center"
                    >
                      เข้าสู่ระบบเพื่อเรียน
                    </Link>
                  ) : isEnrolled ? (
                    // Already enrolled → go to lesson
                    <div>
                      {prog && (
                        <div className="mb-3">
                          <div className="plearn-progress mb-1">
                            <div className="plearn-progress__bar" style={{ width: `${prog.progress}%` }} />
                          </div>
                          <p className="text-caption" style={{ color: "var(--ink-3)" }}>
                            {prog.completedIds.size}/{prog.totalLessons} บทเรียน · {prog.progress}% สำเร็จ
                          </p>
                        </div>
                      )}
                      <Link
                        href={continueUrl ?? `/my-courses/${course.id}`}
                        className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center"
                      >
                        {prog?.progress === 0 ? "เริ่มเรียน" : prog?.progress === 100 ? "ทบทวนคอร์ส" : "เรียนต่อ"}
                      </Link>
                    </div>
                  ) : (
                    // Not enrolled → enroll form
                    <form action={enrollAction}>
                      <button
                        type="submit"
                        className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center"
                      >
                        {isFree ? "เรียนฟรีทันที" : "ลงทะเบียนเรียน"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Features list */}
                <ul className="mt-5 space-y-2">
                  {[
                    `${course.lessonCount ?? 0} บทเรียน`,
                    formatDuration(course.totalDuration ?? 0),
                    "เรียนได้ตลอดชีพ",
                    "ใบรับรองเมื่อเรียนจบ",
                    "เข้าถึงได้บน Mobile",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-body-s" style={{ color: "var(--ink-3)" }}>
                      <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none" stroke="var(--pine)" strokeWidth="2">
                        <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="plearn-container py-12 space-y-10">

        {/* About */}
        <div className="rounded-xl p-8 border" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
          <h2 className="text-h2 mb-4" style={{ color: "var(--ink)" }}>เกี่ยวกับคอร์สนี้</h2>
          <p className="text-body" style={{ color: "var(--ink-3)" }}>{course.description}</p>
        </div>

        {/* Syllabus */}
        {chapters.length > 0 && (
          <div>
            <h2 className="text-h2 mb-5" style={{ color: "var(--ink)" }}>เนื้อหาคอร์ส</h2>
            <p className="text-caption mb-4" style={{ color: "var(--ink-3)" }}>
              {chapters.length} บท · {chapters.flatMap((ch) => ch.lessons).length} บทเรียน · {formatDuration(course.totalDuration ?? 0)}
            </p>
            <div className="space-y-3">
              {chapters.map((chapter) => (
                <details key={chapter.id} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }} open>
                  <summary
                    className="px-5 py-4 flex items-center justify-between cursor-pointer select-none"
                    style={{ background: "var(--cream-2)" }}
                  >
                    <div>
                      <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>{chapter.title}</p>
                      <p className="text-caption" style={{ color: "var(--ink-3)" }}>
                        {chapter.lessons.length} บทเรียน · {formatDuration(chapter.lessons.reduce((s, l) => s + (l.duration ?? 0), 0))}
                      </p>
                    </div>
                    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 transition-transform" fill="none" stroke="var(--ink-3)" strokeWidth="1.5">
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>
                  <div className="divide-y bg-white" style={{ borderColor: "var(--line)" }}>
                    {chapter.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-4 px-5 py-3.5">
                        {/* Type icon */}
                        <span style={{ color: "var(--ink-4)" }}>
                          {lesson.type === "VIDEO" ? (
                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <polygon points="4,2 14,8 4,14" fill="currentColor" strokeLinejoin="round"/>
                            </svg>
                          ) : lesson.type === "QUIZ" ? (
                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="8" cy="8" r="6"/><path d="M8 5v.5m0 2v2.5" strokeLinecap="round"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 4h10M3 7h8M3 10h6" strokeLinecap="round"/>
                            </svg>
                          )}
                        </span>

                        <span className="flex-1 text-body-s" style={{ color: "var(--ink)" }}>
                          {lesson.title}
                          {lesson.isFree && (
                            <span className="ml-2 text-xs font-medium" style={{ color: "var(--pine)" }}>ดูฟรี</span>
                          )}
                        </span>

                        {lesson.duration && (
                          <span className="text-caption shrink-0" style={{ color: "var(--ink-4)" }}>
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
