import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_COURSES, MOCK_CHAPTERS } from "@/mock";
import { formatDuration } from "@/lib/utils";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = MOCK_COURSES.find((c) => c.id === params.id);
  return { title: course ? `จัดการ: ${course.title}` : "จัดการคอร์ส" };
}

export default function CourseEditPage({ params }: Props) {
  const course = MOCK_COURSES.find((c) => c.id === params.id);
  if (!course) notFound();

  const chapters = MOCK_CHAPTERS[params.id] ?? [];
  const totalLessons = chapters.reduce((n, ch) => n + ch.lessons.length, 0);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-caption mb-6" style={{ color: "var(--ink-3)" }}>
        <Link href="/instructor/courses" className="hover:underline">คอร์สของฉัน</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>{course.title}</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-display-m mb-1" style={{ color: "var(--ink)" }}>{course.title}</h1>
          <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
            {chapters.length} บท · {totalLessons} บทเรียน
          </p>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          target="_blank"
          className="plearn-btn plearn-btn-line text-sm shrink-0"
        >
          ดูหน้าคอร์ส ↗
        </Link>
      </div>

      {/* Chapters and lessons */}
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <div
            className="rounded-xl border p-12 text-center"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}
          >
            <p className="text-h3 mb-2" style={{ color: "var(--ink)" }}>ยังไม่มีบทเรียน</p>
            <p className="text-body-s mb-4" style={{ color: "var(--ink-3)" }}>
              เริ่มสร้างบทและบทเรียนแรกของคุณ
            </p>
            <button className="plearn-btn plearn-btn-primary">+ เพิ่มบทแรก</button>
          </div>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="rounded-xl border overflow-hidden"
              style={{ background: "var(--paper)", borderColor: "var(--line)" }}
            >
              {/* Chapter header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ background: "var(--cream-2)", borderColor: "var(--line)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-caption font-mono px-2 py-0.5 rounded"
                    style={{ background: "var(--line)", color: "var(--ink-3)" }}
                  >
                    บทที่ {chapter.order}
                  </span>
                  <h2 className="text-body font-medium" style={{ color: "var(--ink)" }}>
                    {chapter.title}
                  </h2>
                </div>
                <span className="text-caption" style={{ color: "var(--ink-3)" }}>
                  {chapter.lessons.length} บทเรียน
                </span>
              </div>

              {/* Lessons */}
              <div className="divide-y" style={{ borderColor: "var(--line)" }}>
                {chapter.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--cream)] transition-colors"
                  >
                    {/* Lesson type icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                      style={{
                        background:
                          lesson.type === "VIDEO" ? "var(--vermilion-soft)" :
                          lesson.type === "QUIZ"  ? "var(--mustard-soft)"  :
                          "var(--pine-soft)",
                        color:
                          lesson.type === "VIDEO" ? "var(--vermilion)" :
                          lesson.type === "QUIZ"  ? "#B45309"           :
                          "var(--pine)",
                      }}
                    >
                      {lesson.type === "VIDEO" ? "▶" : lesson.type === "QUIZ" ? "✏" : "📄"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-body-s font-medium truncate" style={{ color: "var(--ink)" }}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-caption" style={{ color: "var(--ink-3)" }}>
                          {lesson.type === "VIDEO" ? "วิดีโอ" : lesson.type === "TEXT" ? "บทความ" : "แบบทดสอบ"}
                        </span>
                        {lesson.duration && (
                          <span className="text-caption font-mono" style={{ color: "var(--ink-4)" }}>
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                        {lesson.isFree && (
                          <span
                            className="text-caption px-1.5 py-0.5 rounded"
                            style={{ background: "var(--pine-soft)", color: "var(--pine)" }}
                          >
                            ฟรี
                          </span>
                        )}
                        {/* YouTube URL status */}
                        {lesson.type === "VIDEO" && (
                          lesson.youtubeUrl ? (
                            <span
                              className="text-caption px-1.5 py-0.5 rounded flex items-center gap-1"
                              style={{ background: "var(--pine-soft)", color: "var(--pine)" }}
                            >
                              ▶ มีวิดีโอ
                            </span>
                          ) : (
                            <span
                              className="text-caption px-1.5 py-0.5 rounded"
                              style={{ background: "var(--vermilion-soft)", color: "var(--vermilion)" }}
                            >
                              ยังไม่มีวิดีโอ
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Edit button */}
                    <Link
                      href={`/instructor/courses/${params.id}/edit/${lesson.id}`}
                      className="plearn-btn plearn-btn-ghost text-sm px-3 shrink-0"
                    >
                      แก้ไข
                    </Link>
                  </div>
                ))}

                {/* Add lesson row */}
                <div className="px-5 py-3">
                  <button
                    className="flex items-center gap-2 text-body-s hover:opacity-70 transition-opacity"
                    style={{ color: "var(--vermilion)" }}
                  >
                    <span className="text-lg leading-none">+</span>
                    <span>เพิ่มบทเรียน</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Add chapter button */}
        {chapters.length > 0 && (
          <button
            className="w-full rounded-xl border border-dashed py-4 text-body-s transition-colors hover:border-[var(--ink-3)] hover:bg-[var(--cream-2)]"
            style={{ borderColor: "var(--line-2)", color: "var(--ink-3)" }}
          >
            + เพิ่มบทใหม่
          </button>
        )}
      </div>
    </div>
  );
}
