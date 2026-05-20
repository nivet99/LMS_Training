import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
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

      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
        {[
          { label: "เข้าสู่ระบบด้วย Google",   icon: "G" },
          { label: "เข้าสู่ระบบด้วย LINE",     icon: "L" },
          { label: "เข้าสู่ระบบด้วย Facebook", icon: "f" },
        ].map((p) => (
          <button
            key={p.label}
            className="plearn-btn plearn-btn-line plearn-btn-lg w-full justify-start gap-3"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "var(--cream-2)", color: "var(--ink)" }}
            >
              {p.icon}
            </span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
        <span className="text-caption" style={{ color: "var(--ink-4)" }}>หรือใช้ Email</span>
        <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
      </div>

      {/* Credentials form */}
      <form className="space-y-4">
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="plearn-input"
            autoComplete="email"
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
            type="password"
            placeholder="••••••••"
            className="plearn-input"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center mt-2">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}
