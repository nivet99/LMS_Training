"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import type { MockChapter, MockLesson } from "@/mock";
import { formatDuration } from "@/lib/utils";
import { markLessonComplete } from "@/actions/lessons/progress";
import { YouTubePlayer } from "@/components/player/YouTubePlayer";

interface LessonPlayerProps {
  courseId: string;
  courseTitle: string;
  currentLesson: MockLesson;
  chapters: MockChapter[];
  completedLessonIds: string[];
  userId: string;
}

const THUMB_GRADIENTS: Record<string, string> = {
  design: "linear-gradient(135deg,#7C3AED,#DB2777)",
  marketing: "linear-gradient(135deg,#059669,#065F46)",
  tech: "linear-gradient(135deg,#1D4ED8,#7C3AED)",
  finance: "linear-gradient(135deg,#B45309,#92400E)",
  language: "linear-gradient(135deg,#0369A1,#075985)",
  business: "linear-gradient(135deg,#374151,#111827)",
  lifestyle: "linear-gradient(135deg,#DC2626,#9D174D)",
};

export function LessonPlayer({
  courseId,
  courseTitle,
  currentLesson,
  chapters,
  completedLessonIds,
  userId,
}: LessonPlayerProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(
    completedLessonIds.includes(currentLesson.id)
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Flat lesson list for prev/next navigation
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  function navigate(lessonId: string) {
    router.push(`/my-courses/${courseId}/learn/${lessonId}`);
  }

  const handleMarkComplete = useCallback(async () => {
    setCompleted(true);
    await markLessonComplete(currentLesson.id, courseId);
  }, [currentLesson.id, courseId]);

  const handleQuizComplete = useCallback(
    (passed: boolean, score: number) => {
      if (passed) {
        setCompleted(true);
        if (nextLesson) {
          setTimeout(() => navigate(nextLesson.id), 1500);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextLesson, courseId]
  );

  const chapterOfLesson = chapters.find((ch) =>
    ch.lessons.some((l) => l.id === currentLesson.id)
  );

  return (
    <div className="flex h-full min-h-screen" style={{ background: "var(--cream)" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 flex-col border-r flex overflow-hidden transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--paper)", borderColor: "var(--line)" }}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "var(--line)" }}>
          <Link
            href={`/my-courses/${courseId}`}
            className="flex items-center gap-2 text-body-s font-medium mb-3 hover:opacity-70 transition-opacity"
            style={{ color: "var(--ink)" }}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 13L5 8l5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {courseTitle}
          </Link>
          {/* Overall progress */}
          <div className="plearn-progress mb-1">
            <div
              className="plearn-progress__bar"
              style={{
                width: `${Math.round((completedLessonIds.length / allLessons.length) * 100)}%`,
              }}
            />
          </div>
          <p className="text-caption-s" style={{ color: "var(--ink-4)" }}>
            {completedLessonIds.length}/{allLessons.length} บทเรียน
          </p>
        </div>

        {/* Chapter/lesson list */}
        <div className="flex-1 overflow-y-auto">
          {chapters.map((ch) => (
            <div key={ch.id}>
              <div className="px-4 py-2.5 sticky top-0" style={{ background: "var(--cream-2)" }}>
                <p className="text-caption font-medium" style={{ color: "var(--ink-3)" }}>
                  {ch.title}
                </p>
              </div>
              {ch.lessons.map((lesson) => {
                const isCurrent = lesson.id === currentLesson.id;
                const isDone = completedLessonIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => { navigate(lesson.id); setSidebarOpen(false); }}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-[var(--cream-2)]"
                    style={{
                      background: isCurrent ? "var(--vermilion-soft)" : "transparent",
                      borderLeft: isCurrent ? "3px solid var(--vermilion)" : "3px solid transparent",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        borderColor: isDone ? "var(--pine)" : isCurrent ? "var(--vermilion)" : "var(--line)",
                        background: isDone ? "var(--pine)" : "transparent",
                      }}
                    >
                      {isDone && (
                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="1.5">
                          <path d="M2 5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-body-s truncate"
                        style={{ color: isCurrent ? "var(--vermilion)" : isDone ? "var(--ink-3)" : "var(--ink)", fontWeight: isCurrent ? 600 : 400 }}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-caption-s" style={{ color: "var(--ink-4)" }}>
                        {lesson.type === "VIDEO" ? "วิดีโอ" : lesson.type === "TEXT" ? "บทความ" : "แบบทดสอบ"}
                        {lesson.duration ? ` · ${formatDuration(lesson.duration)}` : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--cream-2)]"
              onClick={() => setSidebarOpen(true)}
            >
              <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="var(--ink)" strokeWidth="1.5">
                <path d="M4 6h12M4 10h12M4 14h12" strokeLinecap="round"/>
              </svg>
            </button>
            <div>
              <p className="text-caption" style={{ color: "var(--ink-3)" }}>{chapterOfLesson?.title}</p>
              <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>
                {currentLesson.title}
              </p>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              disabled={!prevLesson}
              onClick={() => prevLesson && navigate(prevLesson.id)}
              className="plearn-btn plearn-btn-ghost px-3 disabled:opacity-30"
            >
              ← ก่อนหน้า
            </button>
            <button
              disabled={!nextLesson}
              onClick={() => nextLesson && navigate(nextLesson.id)}
              className="plearn-btn plearn-btn-ghost px-3 disabled:opacity-30"
            >
              ถัดไป →
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {/* ── VIDEO ── */}
          {currentLesson.type === "VIDEO" && (
            <div>
              {currentLesson.youtubeUrl ? (
                /* YouTube player */
                <YouTubePlayer url={currentLesson.youtubeUrl} title={currentLesson.title} />
              ) : (
                /* Placeholder — ยังไม่มี YouTube URL */
                <div
                  className="w-full aspect-video flex flex-col items-center justify-center relative"
                  style={{ background: "#111" }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: THUMB_GRADIENTS["tech"] }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
                    <svg viewBox="0 0 48 48" className="w-12 h-12 opacity-40" fill="none" stroke="white" strokeWidth="1.5">
                      <rect x="4" y="10" width="40" height="28" rx="3"/>
                      <polygon points="19,17 33,24 19,31" fill="white" stroke="none"/>
                    </svg>
                    <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                      ยังไม่มีวิดีโอ
                    </p>
                    <a
                      href={`/instructor/courses/${courseId}/edit/${currentLesson.id}`}
                      className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                      style={{ background: "var(--vermilion)", color: "white" }}
                    >
                      + เพิ่ม YouTube URL
                    </a>
                  </div>
                  {currentLesson.duration && (
                    <span
                      className="absolute bottom-4 right-4 px-2 py-1 rounded text-xs font-mono"
                      style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
                    >
                      {formatDuration(currentLesson.duration)}
                    </span>
                  )}
                </div>
              )}

              {/* Below video */}
              <div className="max-w-3xl mx-auto px-6 py-8">
                <h1 className="text-h2 mb-3" style={{ color: "var(--ink)" }}>
                  {currentLesson.title}
                </h1>
                {currentLesson.content && (
                  <p className="text-body mb-8" style={{ color: "var(--ink-3)" }}>
                    {currentLesson.content}
                  </p>
                )}
                <button
                  onClick={handleMarkComplete}
                  disabled={completed}
                  className={`plearn-btn plearn-btn-lg ${completed ? "plearn-btn-ghost" : "plearn-btn-primary"}`}
                  style={completed ? { color: "var(--pine)", borderColor: "var(--pine)" } : {}}
                >
                  {completed ? (
                    <span className="flex items-center gap-2">
                      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      สำเร็จแล้ว
                    </span>
                  ) : "ทำเครื่องหมายว่าเรียนจบแล้ว"}
                </button>
              </div>
            </div>
          )}

          {/* ── TEXT ── */}
          {currentLesson.type === "TEXT" && (
            <div className="max-w-3xl mx-auto px-6 py-8">
              <h1 className="text-h2 mb-6" style={{ color: "var(--ink)" }}>
                {currentLesson.title}
              </h1>
              {currentLesson.content && (
                <div
                  className="prose max-w-none text-body leading-relaxed space-y-4"
                  style={{ color: "var(--ink-3)" }}
                >
                  {currentLesson.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("## ")) {
                      return (
                        <h2 key={i} className="text-h2 mt-8 mb-3" style={{ color: "var(--ink)" }}>
                          {para.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (para.startsWith("### ")) {
                      return (
                        <h3 key={i} className="text-h3 mt-6 mb-2" style={{ color: "var(--ink)" }}>
                          {para.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (para.startsWith("> ")) {
                      return (
                        <blockquote
                          key={i}
                          className="border-l-4 pl-4 italic"
                          style={{ borderColor: "var(--vermilion)", color: "var(--ink-3)" }}
                        >
                          {para.replace("> ", "")}
                        </blockquote>
                      );
                    }
                    return (
                      <p key={i}>{para}</p>
                    );
                  })}
                </div>
              )}
              <div className="mt-10">
                <button
                  onClick={handleMarkComplete}
                  disabled={completed}
                  className={`plearn-btn plearn-btn-lg ${completed ? "plearn-btn-ghost" : "plearn-btn-primary"}`}
                  style={completed ? { color: "var(--pine)", borderColor: "var(--pine)" } : {}}
                >
                  {completed ? (
                    <span className="flex items-center gap-2">
                      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      สำเร็จแล้ว
                    </span>
                  ) : "อ่านเสร็จแล้ว ทำเครื่องหมาย"}
                </button>
              </div>
            </div>
          )}

          {/* ── QUIZ ── */}
          {currentLesson.type === "QUIZ" && currentLesson.quiz && (
            <div className="px-6 py-8">
              <QuizEngine
                quiz={currentLesson.quiz}
                lessonTitle={currentLesson.title}
                onComplete={handleQuizComplete}
                userId={userId}
              />
            </div>
          )}
        </main>

        {/* Bottom nav */}
        <footer
          className="border-t px-4 py-3 flex items-center justify-between"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}
        >
          <button
            disabled={!prevLesson}
            onClick={() => prevLesson && navigate(prevLesson.id)}
            className="plearn-btn plearn-btn-line disabled:opacity-30"
          >
            ← บทเรียนก่อนหน้า
          </button>

          <span className="text-caption" style={{ color: "var(--ink-3)" }}>
            {currentIdx + 1} / {allLessons.length}
          </span>

          <button
            disabled={!nextLesson}
            onClick={() => nextLesson && navigate(nextLesson.id)}
            className="plearn-btn plearn-btn-primary disabled:opacity-30"
          >
            บทเรียนถัดไป →
          </button>
        </footer>
      </div>
    </div>
  );
}
