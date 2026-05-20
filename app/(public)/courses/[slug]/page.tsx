import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MOCK_COURSES } from "@/mock";
import { formatCurrency, formatDuration, formatNumber } from "@/lib/utils";
import { CourseStatusBadge } from "@/components/course/CourseStatusBadge";

export const revalidate = 1800;

export async function generateStaticParams() {
  return MOCK_COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = MOCK_COURSES.find((c) => c.slug === params.slug);
  if (!course) return { title: "ไม่พบคอร์ส" };
  return {
    title: course.title,
    description: course.description.slice(0, 160),
  };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = MOCK_COURSES.find((c) => c.slug === params.slug);
  if (!course) notFound();

  const isFree = !course.price || course.price === 0;

  return (
    <div>
      {/* Hero — dark ink bg */}
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

              {/* Meta row */}
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
                <span className="badge badge-draft" style={{ background: "rgba(255,252,246,0.1)", color: "rgba(255,252,246,0.65)" }}>
                  {course.level === "BEGINNER" ? "เริ่มต้น" : course.level === "INTERMEDIATE" ? "กลาง" : course.level === "ADVANCED" ? "ขั้นสูง" : "ทุกระดับ"}
                </span>
                {course.totalDuration && (
                  <span className="text-caption" style={{ color: "rgba(255,252,246,0.5)" }}>
                    {formatDuration(course.totalDuration)}
                  </span>
                )}
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

            {/* Enroll card */}
            <div className="plearn-enroll-card rounded-xl overflow-hidden" style={{ background: "var(--paper)" }}>
              {/* Thumbnail placeholder */}
              <div className={`w-full aspect-video ${
                { design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
                  finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
                  lifestyle: "thumb-lifestyle" }[course.category?.slug ?? ""] ?? "thumb-default"
              }`} />
              <div className="p-6">
                <p className="font-serif font-medium mb-1" style={{ fontSize: "32px", color: "var(--ink)" }}>
                  {isFree ? "ฟรี" : formatCurrency(course.price!, course.currency)}
                </p>
                <div className="space-y-2.5 mt-5">
                  <Link href="/signup" className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center">
                    {isFree ? "เรียนฟรีทันที" : "ลงทะเบียนเรียน"}
                  </Link>
                  <button className="plearn-btn plearn-btn-line plearn-btn-lg w-full justify-center">
                    ทดลองเรียนฟรี
                  </button>
                </div>
                <ul className="mt-5 space-y-2">
                  {[
                    `${course.lessonCount ?? 0} บทเรียน`,
                    `${formatDuration(course.totalDuration ?? 0)}`,
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

      {/* Body tabs placeholder */}
      <div className="plearn-container py-12">
        <div
          className="rounded-xl p-8 border"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}
        >
          <h2 className="text-h2 mb-4" style={{ color: "var(--ink)" }}>เกี่ยวกับคอร์สนี้</h2>
          <p className="text-body" style={{ color: "var(--ink-3)" }}>{course.description}</p>
        </div>
      </div>
    </div>
  );
}
