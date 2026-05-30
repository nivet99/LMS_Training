"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { registerUser } from "@/actions/auth/register";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center mt-2"
    >
      {pending ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(registerUser, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h2 font-serif mb-1" style={{ color: "var(--ink)" }}>
          สมัครสมาชิก
        </h1>
        <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="underline" style={{ color: "var(--vermilion)" }}>
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { value: "LEARNER",    label: "ผู้เรียน",  desc: "เรียนคอร์สออนไลน์" },
          { value: "INSTRUCTOR", label: "ผู้สอน",    desc: "สร้างและขายคอร์ส" },
        ].map((role) => (
          <label
            key={role.value}
            className="rounded-xl border p-4 cursor-pointer transition-colors hover:border-[var(--ink-3)]"
            style={{ borderColor: "var(--line)", background: "var(--cream)" }}
          >
            <input
              type="radio"
              name="role"
              value={role.value}
              className="sr-only"
              defaultChecked={role.value === "LEARNER"}
            />
            <p className="font-medium text-body-s" style={{ color: "var(--ink)" }}>{role.label}</p>
            <p className="text-caption" style={{ color: "var(--ink-3)" }}>{role.desc}</p>
          </label>
        ))}
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && (
          <div
            className="p-3 rounded-lg text-sm"
            style={{ background: "var(--vermilion-soft)", color: "var(--vermilion-2)" }}
          >
            {state.error}
          </div>
        )}

        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            ชื่อ-นามสกุล
          </label>
          <input
            name="name"
            type="text"
            placeholder="ชื่อของคุณ"
            className="plearn-input"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="plearn-input"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            รหัสผ่าน
          </label>
          <input
            name="password"
            type="password"
            placeholder="อย่างน้อย 8 ตัวอักษร มีตัวพิมพ์ใหญ่และตัวเลข"
            className="plearn-input"
            required
          />
        </div>

        <SubmitButton />

        <p className="text-caption text-center" style={{ color: "var(--ink-4)" }}>
          การสมัครถือว่าคุณยอมรับ{" "}
          <Link href="/terms" className="underline">เงื่อนไขการใช้งาน</Link>{" "}และ{" "}
          <Link href="/privacy" className="underline">นโยบายความเป็นส่วนตัว</Link>
        </p>
      </form>
    </div>
  );
}
