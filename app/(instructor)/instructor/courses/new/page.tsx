"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { createCourse } from "@/actions/courses/create";
import type { CreateCourseState } from "@/actions/courses/create";

const CATEGORIES = [
  { id: "cat_design",    name: "Design" },
  { id: "cat_marketing", name: "การตลาด" },
  { id: "cat_tech",      name: "เทคโนโลยี" },
  { id: "cat_finance",   name: "การเงิน" },
  { id: "cat_language",  name: "ภาษา" },
  { id: "cat_business",  name: "ธุรกิจ" },
  { id: "cat_lifestyle", name: "ไลฟ์สไตล์" },
];

const LEVELS = [
  { value: "BEGINNER",     label: "เริ่มต้น (Beginner)" },
  { value: "INTERMEDIATE", label: "กลาง (Intermediate)" },
  { value: "ADVANCED",     label: "ขั้นสูง (Advanced)" },
  { value: "ALL_LEVELS",   label: "ทุกระดับ" },
];

const initialState: CreateCourseState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="plearn-btn plearn-btn-primary plearn-btn-lg"
    >
      {pending ? "กำลังสร้าง..." : "สร้างคอร์ส"}
    </button>
  );
}

export default function NewCoursePage() {
  const [state, action] = useFormState(createCourse, initialState);

  const fe = state.fieldErrors ?? {};

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-caption mb-6" style={{ color: "var(--ink-3)" }}>
        <Link href="/instructor/courses" className="hover:underline">คอร์สของฉัน</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>สร้างคอร์สใหม่</span>
      </div>

      <div className="mb-8">
        <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>INSTRUCTOR PORTAL</p>
        <h1 className="text-display-m" style={{ color: "var(--ink)" }}>สร้างคอร์สใหม่</h1>
      </div>

      {state.error && (
        <div className="rounded-xl border px-5 py-4 mb-6"
          style={{ background: "var(--vermilion-soft)", borderColor: "var(--vermilion)" }}>
          <p className="text-body-s" style={{ color: "var(--vermilion)" }}>{state.error}</p>
        </div>
      )}

      <form action={action} className="space-y-6">
        {/* Title */}
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            ชื่อคอร์ส <span style={{ color: "var(--vermilion)" }}>*</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="เช่น UX Design ขั้นพื้นฐาน: จากศูนย์สู่ Figma"
            className="w-full px-4 py-2.5 rounded-lg border text-body-s"
            style={{
              borderColor: fe.title ? "var(--vermilion)" : "var(--line)",
              background: "var(--paper)",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          {fe.title && (
            <p className="text-caption mt-1.5" style={{ color: "var(--vermilion)" }}>{fe.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            คำอธิบายคอร์ส <span style={{ color: "var(--vermilion)" }}>*</span>
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="อธิบายว่าผู้เรียนจะได้เรียนรู้อะไร เหมาะสำหรับใคร และได้ประโยชน์อะไรจากคอร์สนี้"
            className="w-full px-4 py-2.5 rounded-lg border text-body-s resize-none"
            style={{
              borderColor: fe.description ? "var(--vermilion)" : "var(--line)",
              background: "var(--paper)",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          {fe.description && (
            <p className="text-caption mt-1.5" style={{ color: "var(--vermilion)" }}>{fe.description}</p>
          )}
        </div>

        {/* Category + Level (2 col) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
              หมวดหมู่ <span style={{ color: "var(--vermilion)" }}>*</span>
            </label>
            <select
              name="categoryId"
              className="w-full px-4 py-2.5 rounded-lg border text-body-s"
              style={{
                borderColor: fe.categoryId ? "var(--vermilion)" : "var(--line)",
                background: "var(--paper)",
                color: "var(--ink)",
                outline: "none",
              }}
              defaultValue=""
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {fe.categoryId && (
              <p className="text-caption mt-1.5" style={{ color: "var(--vermilion)" }}>{fe.categoryId}</p>
            )}
          </div>

          <div>
            <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
              ระดับ <span style={{ color: "var(--vermilion)" }}>*</span>
            </label>
            <select
              name="level"
              className="w-full px-4 py-2.5 rounded-lg border text-body-s"
              style={{
                borderColor: fe.level ? "var(--vermilion)" : "var(--line)",
                background: "var(--paper)",
                color: "var(--ink)",
                outline: "none",
              }}
              defaultValue=""
            >
              <option value="" disabled>เลือกระดับ</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            {fe.level && (
              <p className="text-caption mt-1.5" style={{ color: "var(--vermilion)" }}>{fe.level}</p>
            )}
          </div>
        </div>

        {/* Price + Language (2 col) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
              ราคา (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-s"
                style={{ color: "var(--ink-3)" }}>฿</span>
              <input
                name="price"
                type="number"
                min="0"
                step="10"
                placeholder="0 = ฟรี"
                className="w-full pl-8 pr-4 py-2.5 rounded-lg border text-body-s"
                style={{
                  borderColor: fe.price ? "var(--vermilion)" : "var(--line)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>
            {fe.price && (
              <p className="text-caption mt-1.5" style={{ color: "var(--vermilion)" }}>{fe.price}</p>
            )}
            <p className="text-caption mt-1" style={{ color: "var(--ink-4)" }}>ใส่ 0 สำหรับคอร์สฟรี</p>
          </div>

          <div>
            <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
              ภาษาหลัก
            </label>
            <select
              name="language"
              className="w-full px-4 py-2.5 rounded-lg border text-body-s"
              style={{
                borderColor: "var(--line)",
                background: "var(--paper)",
                color: "var(--ink)",
                outline: "none",
              }}
              defaultValue="th"
            >
              <option value="th">ภาษาไทย</option>
              <option value="en">English</option>
              <option value="th-en">ไทย + อังกฤษ</option>
            </select>
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-xl border px-5 py-4"
          style={{ background: "var(--cream-2)", borderColor: "var(--line)" }}>
          <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
            หลังจากสร้างคอร์ส คุณสามารถเพิ่มบทและบทเรียน อัปโหลดวิดีโอ
            และส่งให้ทีม Plearn ตรวจสอบก่อนเผยแพร่
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton />
          <Link href="/instructor/courses" className="plearn-btn plearn-btn-ghost plearn-btn-lg">
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}
