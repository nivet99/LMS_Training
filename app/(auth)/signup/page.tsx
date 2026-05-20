import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default function SignupPage() {
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
            <input type="radio" name="role" value={role.value} className="sr-only" defaultChecked={role.value === "LEARNER"} />
            <p className="font-medium text-body-s" style={{ color: "var(--ink)" }}>{role.label}</p>
            <p className="text-caption" style={{ color: "var(--ink-3)" }}>{role.desc}</p>
          </label>
        ))}
      </div>

      {/* OAuth */}
      <div className="space-y-3 mb-6">
        {[
          { label: "สมัครด้วย Google",   icon: "G" },
          { label: "สมัครด้วย LINE",     icon: "L" },
        ].map((p) => (
          <button key={p.label} className="plearn-btn plearn-btn-line plearn-btn-lg w-full justify-start gap-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "var(--cream-2)", color: "var(--ink)" }}>
              {p.icon}
            </span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
        <span className="text-caption" style={{ color: "var(--ink-4)" }}>หรือใช้ Email</span>
        <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>ชื่อ-นามสกุล</label>
          <input type="text" placeholder="ชื่อของคุณ" className="plearn-input" autoComplete="name" />
        </div>
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>Email</label>
          <input type="email" placeholder="you@example.com" className="plearn-input" autoComplete="email" />
        </div>
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>รหัสผ่าน</label>
          <input type="password" placeholder="อย่างน้อย 8 ตัวอักษร มีตัวพิมพ์ใหญ่และตัวเลข" className="plearn-input" />
        </div>
        <button type="submit" className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center mt-2">
          สร้างบัญชี
        </button>
        <p className="text-caption text-center" style={{ color: "var(--ink-4)" }}>
          การสมัครถือว่าคุณยอมรับ{" "}
          <Link href="/terms" className="underline">เงื่อนไขการใช้งาน</Link>{" "}และ{" "}
          <Link href="/privacy" className="underline">นโยบายความเป็นส่วนตัว</Link>
        </p>
      </form>
    </div>
  );
}
