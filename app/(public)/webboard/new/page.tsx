"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { createPost } from "@/actions/webboard/post";
import type { CreatePostState } from "@/actions/webboard/post";

const CATEGORIES = [
  { value: "GENERAL",  label: "ทั่วไป",         desc: "พูดคุยทั่วไปเกี่ยวกับการเรียน" },
  { value: "QA",       label: "ถาม-ตอบ",         desc: "มีคำถามหรือปัญหา มาถามได้เลย" },
  { value: "SHOWCASE", label: "แสดงผลงาน",       desc: "แชร์ผลงานที่ทำจากคอร์ส" },
  { value: "FEEDBACK", label: "ข้อเสนอแนะ",     desc: "เสนอแนะเพื่อพัฒนาแพลตฟอร์ม" },
];

const initialState: CreatePostState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="plearn-btn plearn-btn-primary plearn-btn-lg"
    >
      {pending ? "กำลังโพสต์..." : "ตั้งกระทู้"}
    </button>
  );
}

export default function NewPostPage() {
  const [state, action] = useFormState(createPost, initialState);
  const fe = state.fieldErrors ?? {};

  return (
    <div className="plearn-container py-10 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-caption mb-6" style={{ color: "var(--ink-3)" }}>
        <Link href="/webboard" className="hover:underline">Webboard</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>ตั้งกระทู้ใหม่</span>
      </div>

      <h1 className="text-display-m mb-8" style={{ color: "var(--ink)" }}>ตั้งกระทู้ใหม่</h1>

      {state.error && (
        <div className="rounded-xl border px-5 py-4 mb-6"
          style={{ background: "var(--vermilion-soft)", borderColor: "var(--vermilion)" }}>
          <p className="text-body-s" style={{ color: "var(--vermilion)" }}>{state.error}</p>
        </div>
      )}

      <form action={action} className="space-y-6">
        {/* Category */}
        <div>
          <label className="text-body-s font-medium block mb-2" style={{ color: "var(--ink)" }}>
            หมวดหมู่ <span style={{ color: "var(--vermilion)" }}>*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.value}
                className="flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors hover:bg-[var(--cream-2)]"
                style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                <input type="radio" name="category" value={cat.value}
                  defaultChecked={cat.value === "GENERAL"}
                  className="mt-0.5 accent-[var(--vermilion)]" />
                <div>
                  <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>{cat.label}</p>
                  <p className="text-caption" style={{ color: "var(--ink-3)" }}>{cat.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            หัวข้อกระทู้ <span style={{ color: "var(--vermilion)" }}>*</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="หัวข้อที่ชัดเจนช่วยให้ได้รับคำตอบเร็วขึ้น"
            className="w-full px-4 py-2.5 rounded-lg border text-body-s"
            style={{
              borderColor: fe.title ? "var(--vermilion)" : "var(--line)",
              background: "var(--paper)", color: "var(--ink)", outline: "none",
            }}
          />
          {fe.title && (
            <p className="text-caption mt-1.5" style={{ color: "var(--vermilion)" }}>{fe.title}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            เนื้อหา <span style={{ color: "var(--vermilion)" }}>*</span>
          </label>
          <textarea
            name="content"
            rows={8}
            placeholder="อธิบายรายละเอียด ยิ่งละเอียดยิ่งได้รับความช่วยเหลือได้ดีขึ้น..."
            className="w-full px-4 py-3 rounded-lg border text-body-s resize-none"
            style={{
              borderColor: fe.content ? "var(--vermilion)" : "var(--line)",
              background: "var(--paper)", color: "var(--ink)", outline: "none", lineHeight: 1.6,
            }}
          />
          {fe.content && (
            <p className="text-caption mt-1.5" style={{ color: "var(--vermilion)" }}>{fe.content}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton />
          <Link href="/webboard" className="plearn-btn plearn-btn-ghost plearn-btn-lg">
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}
