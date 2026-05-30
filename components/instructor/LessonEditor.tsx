"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import Link from "next/link";
import { saveLessonContent } from "@/actions/instructor/lesson";
import { extractYouTubeId, toEmbedUrl, toThumbnailUrl } from "@/lib/youtube";
import type { MockLesson } from "@/mock";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="plearn-btn plearn-btn-primary plearn-btn-lg"
    >
      {pending ? "กำลังบันทึก..." : "บันทึกบทเรียน"}
    </button>
  );
}

interface LessonEditorProps {
  lesson: MockLesson;
  courseId: string;
  courseTitle: string;
}

export function LessonEditor({ lesson, courseId, courseTitle }: LessonEditorProps) {
  const [state, formAction] = useFormState(saveLessonContent, {});
  const [lessonType, setLessonType] = useState<"VIDEO" | "TEXT" | "QUIZ">(lesson.type);
  const [youtubeInput, setYoutubeInput] = useState(lesson.youtubeUrl ?? "");
  const [previewId, setPreviewId] = useState<string | null>(
    lesson.youtubeUrl ? extractYouTubeId(lesson.youtubeUrl) : null
  );

  useEffect(() => {
    const id = extractYouTubeId(youtubeInput);
    const timer = setTimeout(() => setPreviewId(id), 600); // debounce 600 ms
    return () => clearTimeout(timer);
  }, [youtubeInput]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-caption mb-6" style={{ color: "var(--ink-3)" }}>
        <Link href="/instructor/courses" className="hover:underline">คอร์สของฉัน</Link>
        <span>/</span>
        <Link href={`/instructor/courses/${courseId}/edit`} className="hover:underline">{courseTitle}</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>แก้ไขบทเรียน</span>
      </div>

      <div className="mb-8">
        <h1 className="text-h2 font-serif mb-1" style={{ color: "var(--ink)" }}>แก้ไขบทเรียน</h1>
        <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
          แก้ไขเนื้อหาและแนบ YouTube URL สำหรับวิดีโอบทเรียน
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Hidden fields */}
        <input type="hidden" name="lessonId" value={lesson.id} />
        <input type="hidden" name="courseId" value={courseId} />

        {/* Success / Error banner */}
        {state.success && (
          <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ background: "var(--pine-soft)", color: "var(--pine)" }}
          >
            <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">บันทึกบทเรียนสำเร็จแล้ว</span>
          </div>
        )}
        {state.error && (
          <div
            className="p-4 rounded-xl"
            style={{ background: "var(--vermilion-soft)", color: "var(--vermilion-2)" }}
          >
            {state.error}
          </div>
        )}

        {/* ── ชื่อบทเรียน ── */}
        <div className="rounded-xl border p-5 space-y-4"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
          <h2 className="text-body font-medium" style={{ color: "var(--ink)" }}>ข้อมูลพื้นฐาน</h2>

          <div>
            <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
              ชื่อบทเรียน <span style={{ color: "var(--vermilion)" }}>*</span>
            </label>
            <input
              name="title"
              type="text"
              defaultValue={lesson.title}
              placeholder="ชื่อบทเรียน"
              className="plearn-input"
              required
            />
          </div>

          <div>
            <label className="text-body-s font-medium block mb-2" style={{ color: "var(--ink)" }}>
              ประเภทบทเรียน
            </label>
            <div className="flex gap-2 flex-wrap">
              {(["VIDEO", "TEXT", "QUIZ"] as const).map((t) => {
                const labels: Record<string, string> = { VIDEO: "วิดีโอ", TEXT: "บทความ", QUIZ: "แบบทดสอบ" };
                const icons: Record<string, string> = { VIDEO: "▶", TEXT: "📄", QUIZ: "✏️" };
                return (
                  <label
                    key={t}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all"
                    style={{
                      borderColor: lessonType === t ? "var(--vermilion)" : "var(--line)",
                      background: lessonType === t ? "var(--vermilion-soft)" : "var(--cream)",
                      color: lessonType === t ? "var(--vermilion)" : "var(--ink-3)",
                    }}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={lessonType === t}
                      onChange={() => setLessonType(t)}
                      className="sr-only"
                    />
                    <span>{icons[t]}</span>
                    <span className="text-body-s font-medium">{labels[t]}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFree"
                value="true"
                defaultChecked={lesson.isFree}
                className="w-4 h-4 accent-[var(--vermilion)]"
              />
              <span className="text-body-s" style={{ color: "var(--ink)" }}>
                บทเรียนฟรี (ผู้ที่ยังไม่ลงทะเบียนสามารถดูได้)
              </span>
            </label>
          </div>
        </div>

        {/* ── YouTube URL section (VIDEO only) ── */}
        {lessonType === "VIDEO" && (
          <div className="rounded-xl border p-5 space-y-4"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <div>
              <h2 className="text-body font-medium mb-0.5" style={{ color: "var(--ink)" }}>วิดีโอ YouTube</h2>
              <p className="text-caption" style={{ color: "var(--ink-3)" }}>
                วางลิงก์ YouTube ที่ต้องการนำมาเป็นเนื้อหาบทเรียน
              </p>
            </div>

            <div>
              <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                YouTube URL
              </label>
              <div className="flex gap-2">
                <input
                  name="youtubeUrl"
                  type="url"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
                  className="plearn-input flex-1"
                />
                {youtubeInput && (
                  <button
                    type="button"
                    onClick={() => { setYoutubeInput(""); setPreviewId(null); }}
                    className="plearn-btn plearn-btn-ghost px-3 shrink-0"
                    style={{ color: "var(--ink-3)" }}
                  >
                    ล้าง
                  </button>
                )}
              </div>

              {/* URL format hints */}
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "youtube.com/watch?v=XXXXXXXXXXX",
                  "youtu.be/XXXXXXXXXXX",
                  "youtube.com/shorts/XXXXXXXXXXX",
                ].map((hint) => (
                  <span
                    key={hint}
                    className="px-2 py-0.5 rounded text-caption font-mono"
                    style={{ background: "var(--cream-2)", color: "var(--ink-3)" }}
                  >
                    {hint}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview */}
            {youtubeInput && (
              <div>
                <p className="text-body-s font-medium mb-2" style={{ color: "var(--ink)" }}>
                  ตัวอย่างวิดีโอ
                  {previewId ? (
                    <span className="ml-2 text-caption font-normal" style={{ color: "var(--pine)" }}>
                      ✓ URL ถูกต้อง (ID: {previewId})
                    </span>
                  ) : (
                    <span className="ml-2 text-caption font-normal" style={{ color: "var(--vermilion)" }}>
                      URL ไม่ถูกต้อง
                    </span>
                  )}
                </p>

                {previewId ? (
                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--line)" }}>
                    <div className="w-full aspect-video">
                      <iframe
                        src={toEmbedUrl(previewId)}
                        title="YouTube preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                    {/* Thumbnail fallback info */}
                    <div className="px-4 py-3 flex items-center gap-3"
                      style={{ background: "var(--cream-2)", borderTop: "1px solid var(--line)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toThumbnailUrl(previewId)}
                        alt="thumbnail"
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-caption" style={{ color: "var(--ink-3)" }}>YouTube Video ID</p>
                        <p className="text-body-s font-mono" style={{ color: "var(--ink)" }}>{previewId}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full aspect-video rounded-xl flex items-center justify-center border"
                    style={{ background: "var(--cream-2)", borderColor: "var(--line)" }}
                  >
                    <p className="text-body-s" style={{ color: "var(--ink-4)" }}>
                      รูปแบบ URL ไม่ถูกต้อง
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Duration field */}
            <div>
              <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                ความยาววิดีโอ (วินาที) — ไม่บังคับ
              </label>
              <input
                name="duration"
                type="number"
                min="0"
                defaultValue={lesson.duration}
                placeholder="เช่น 720 (= 12 นาที)"
                className="plearn-input"
                style={{ maxWidth: "200px" }}
              />
            </div>
          </div>
        )}

        {/* ── TEXT content ── */}
        {lessonType === "TEXT" && (
          <div className="rounded-xl border p-5 space-y-4"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <div>
              <h2 className="text-body font-medium mb-0.5" style={{ color: "var(--ink)" }}>เนื้อหาบทเรียน</h2>
              <p className="text-caption" style={{ color: "var(--ink-3)" }}>ใส่เนื้อหาบทเรียนแบบข้อความ</p>
            </div>
            <div>
              <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                เนื้อหา (Markdown รองรับ)
              </label>
              <textarea
                name="content"
                rows={12}
                defaultValue={lesson.content}
                placeholder="เขียนเนื้อหาบทเรียนที่นี่..."
                className="plearn-input font-mono text-sm"
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
        )}

        {/* ── QUIZ placeholder ── */}
        {lessonType === "QUIZ" && (
          <div
            className="rounded-xl border p-8 text-center"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}
          >
            <p className="text-h3 mb-2" style={{ color: "var(--ink)" }}>Quiz Builder</p>
            <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
              ระบบสร้างแบบทดสอบกำลังพัฒนา — จะพร้อมใช้งานใน Phase 2
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton />
          <Link
            href={`/instructor/courses/${courseId}/edit`}
            className="plearn-btn plearn-btn-ghost plearn-btn-lg"
          >
            ยกเลิก
          </Link>

          {/* Preview link */}
          <Link
            href={`/my-courses/${courseId}/learn/${lesson.id}`}
            target="_blank"
            className="ml-auto plearn-btn plearn-btn-line plearn-btn-lg"
          >
            ดูตัวอย่าง ↗
          </Link>
        </div>
      </form>
    </div>
  );
}
