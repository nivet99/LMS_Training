import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MOCK_COURSES, MOCK_CHAPTERS, MOCK_PROGRESS } from "@/mock";
import { formatDuration } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { courseId: string } }): Promise<Metadata> {
  const course = MOCK_COURSES.find((c) => c.id === params.courseId);
  return { title: course ? `${course.title} — เนื้อหา` : "คอร์ส" };
}

const THUMB_MAP: Record<string, string> = {
  design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
  finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
  lifestyle: "thumb-lifestyle",
};

const LESSON_TYPE_LABEL: Record<string, string> = {
  VIDEO: "วิดีโอ", TEXT: "บทความ", QUIZ: "แบบทดสอบ",
};

const LESSON_TYPE_ICON: Record<string, React.ReactNode> = {
  VIDEO: (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="5,3 13,8 5,13" fill="currentColor" strokeLinejoin="round"/>
    </svg>
  ),
  TEXT: (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 4h10M3 7h8M3 10h6" strokeLinecap="round"/>
    </svg>
  ),
  QUIZ: (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6"/><path d="M8 5.5v.5m0 2v2.5" strokeLinecap="round"/>
    </svg>
  ),
};

import React from "react";

export default function CourseOutlinePage({ params }: { params: { courseId: string } }) {
  const course = MOCK_COURSES.find((c) => c.id === params.courseId);
  if (!course) notFound();

  const chapters = MOCK_CHAPTERS[params.courseId] ?? [];
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => MOCK_PROGRESS[l.id]?.completedAt).length;
  const progress = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const thumbClass = THUMB_MAP[course.category?.slug ?? ""] ?? "thumb-default";

  // Find next lesson to continue (first incomplete)
  const nextLesson = allLessons.find((l) => !MOCK_PROGRESS[l.id]?.completedAt) ?? allLessons[0];

  return (
    <div className="plearn-container py-8">
      {/* Course hero */}
      <div className="rounded-xl overflow-hidden border mb-8 flex gap-0"
        style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        <div className={`w-48 shrink-0 ${thumbClass}`} />
        <div className="flex-1 p-6">
          <p className="text-caption mb-1" style={{ color: "var(--ink-3)" }}>
            {course.category?.name}
          </p>
          <h1 className="text-h2 mb-2" style={{ color: "var(--ink)" }}>{course.title}</h1>
          <p className="text-body-s mb-4" style={{ color: "var(--ink-3)" }}>
            {course.instructor.name} · {allLessons.length} บทเรียน · {formatDuration(course.totalDuration ?? 0)}
          </p>
          {/* Progress */}
          <div className="mb-1">
            <div className="plearn-progress">
              <div className="plearn-progress__bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <p className="text-caption-s mb-4" style={{ color: "var(--ink-4)" }}>
            {completedCount} / {allLessons.length} บทเรียน · {progress}% สำเร็จ
          </p>
          {nextLesson && (
            <Link href={`/my-courses/${course.id}/learn/${nextLesson.id}`}
              className="plearn-btn plearn-btn-primary">
              {progress === 0 ? "เริ่มเรียน" : progress === 100 ? "ทบทวนคอร์ส" : "เรียนต่อ"}
            </Link>
          )}
        </div>
      </div>

      {/* Chapter list */}
      <h2 className="text-h2 mb-5" style={{ color: "var(--ink)" }}>เนื้อหาคอร์ส</h2>

      {chapters.length === 0 ? (
        <p className="text-body" style={{ color: "var(--ink-3)" }}>ยังไม่มีเนื้อหา</p>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter) => {
            const chCompleted = chapter.lessons.filter((l) => MOCK_PROGRESS[l.id]?.completedAt).length;
            return (
              <div key={chapter.id} className="rounded-xl border overflow-hidden"
                style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
                {/* Chapter header */}
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ background: "var(--cream-2)" }}>
                  <div>
                    <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>
                      {chapter.title}
                    </p>
                    <p className="text-caption" style={{ color: "var(--ink-3)" }}>
                      {chCompleted}/{chapter.lessons.length} บทเรียน
                    </p>
                  </div>
                  {chCompleted === chapter.lessons.length && chapter.lessons.length > 0 && (
                    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="var(--pine)">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                  )}
                </div>

                {/* Lessons */}
                <div className="divide-y" style={{ borderColor: "var(--line)" }}>
                  {chapter.lessons.map((lesson) => {
                    const done = !!MOCK_PROGRESS[lesson.id]?.completedAt;
                    const inProgress = !done && !!MOCK_PROGRESS[lesson.id]?.watchPosition;
                    return (
                      <Link key={lesson.id}
                        href={`/my-courses/${course.id}/learn/${lesson.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--cream-2)] transition-colors group">
                        {/* Status icon */}
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border"
                          style={{
                            background: done ? "var(--pine)" : inProgress ? "var(--mustard-soft, #FFF8E1)" : "transparent",
                            borderColor: done ? "var(--pine)" : inProgress ? "var(--mustard)" : "var(--line)",
                          }}>
                          {done ? (
                            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="white">
                              <path d="M2 6l2.5 2.5L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                          ) : inProgress ? (
                            <div className="w-2 h-2 rounded-full" style={{ background: "var(--mustard)" }} />
                          ) : null}
                        </div>

                        {/* Type icon */}
                        <span style={{ color: done ? "var(--pine)" : "var(--ink-3)" }}>
                          {LESSON_TYPE_ICON[lesson.type]}
                        </span>

                        {/* Title */}
                        <span className="flex-1 text-body-s group-hover:text-[var(--vermilion)] transition-colors"
                          style={{ color: done ? "var(--ink-3)" : "var(--ink)" }}>
                          {lesson.title}
                          {lesson.isFree && (
                            <span className="ml-2 text-xs font-medium" style={{ color: "var(--pine)" }}>ฟรี</span>
                          )}
                        </span>

                        {/* Meta */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                            {LESSON_TYPE_LABEL[lesson.type]}
                          </span>
                          {lesson.duration && (
                            <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                              {formatDuration(lesson.duration)}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Back link */}
      <div className="mt-8">
        <Link href="/my-courses" className="text-body-s" style={{ color: "var(--ink-3)" }}>
          ← กลับไปคอร์สของฉัน
        </Link>
      </div>
    </div>
  );
}
