"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRef } from "react";
import Link from "next/link";
import { loginUser } from "@/actions/auth/login";

const DEMO_ACCOUNTS = [
  {
    role:     "ผู้เรียน",
    email:    "learner@plearn.co",
    password: "Password123",
    color:    "var(--pine)",
    bg:       "var(--pine-soft)",
    icon:     "🎓",
  },
  {
    role:     "ผู้สอน",
    email:    "instructor@plearn.co",
    password: "Password123",
    color:    "var(--vermilion)",
    bg:       "var(--vermilion-soft)",
    icon:     "📚",
  },
  {
    role:     "แอดมิน",
    email:    "admin@plearn.co",
    password: "Admin1234",
    color:    "var(--ink-2)",
    bg:       "var(--cream-2)",
    icon:     "⚙️",
  },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center mt-2"
    >
      {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
    </button>
  );
}

export function LoginForm({ registered }: { registered?: boolean }) {
  const [state, formAction] = useFormState(loginUser, {});
  const emailRef    = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function fillAccount(email: string, password: string) {
    if (emailRef.current)    emailRef.current.value    = email;
    if (passwordRef.current) passwordRef.current.value = password;
    emailRef.current?.focus();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h2 font-serif mb-1" style={{ color: "var(--ink)" }}>
          เข้าสู่ระบบ
        </h1>
        <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
          ยังไม่มีบัญชี?{" "}
          <Link href="/signup" className="underline" style={{ color: "var(--vermilion)" }}>
            สมัครสมาชิก
          </Link>
        </p>
      </div>

      {registered && (
        <div
          className="mb-4 p-3 rounded-lg text-sm"
          style={{ background: "var(--pine-soft)", color: "var(--pine)" }}
        >
          สมัครสมาชิกสำเร็จแล้ว กรุณาเข้าสู่ระบบ
        </div>
      )}

      {/* Demo accounts — คลิกเพื่อกรอกอัตโนมัติ */}
      <div
        className="mb-6 rounded-xl p-4 space-y-3"
        style={{ background: "var(--cream-2)", border: "1px solid var(--line)" }}
      >
        <p className="text-caption font-medium" style={{ color: "var(--ink-3)" }}>
          บัญชีทดลองใช้ — คลิกเพื่อกรอกอัตโนมัติ
        </p>
        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => fillAccount(acc.email, acc.password)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all hover:opacity-80 active:scale-[0.98]"
              style={{ background: acc.bg, border: `1px solid ${acc.color}20` }}
            >
              <span className="text-base shrink-0">{acc.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-body-s font-medium" style={{ color: acc.color }}>
                  {acc.role}
                </p>
                <p className="text-caption font-mono truncate" style={{ color: "var(--ink-3)" }}>
                  {acc.email}
                </p>
              </div>
              <span className="text-caption shrink-0" style={{ color: "var(--ink-4)" }}>
                คลิก →
              </span>
            </button>
          ))}
        </div>
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
            Email
          </label>
          <input
            ref={emailRef}
            name="email"
            type="email"
            placeholder="you@example.com"
            className="plearn-input"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-body-s font-medium" style={{ color: "var(--ink)" }}>
              รหัสผ่าน
            </label>
            <Link href="/forgot-password" className="text-caption" style={{ color: "var(--vermilion)" }}>
              ลืมรหัสผ่าน?
            </Link>
          </div>
          <input
            ref={passwordRef}
            name="password"
            type="password"
            placeholder="••••••••"
            className="plearn-input"
            autoComplete="current-password"
            required
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
