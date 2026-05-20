import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ลืมรหัสผ่าน" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h2 font-serif mb-1" style={{ color: "var(--ink)" }}>
          รีเซ็ตรหัสผ่าน
        </h1>
        <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
          ใส่ Email แล้วเราจะส่งลิงก์รีเซ็ตให้คุณ
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>Email</label>
          <input type="email" placeholder="you@example.com" className="plearn-input" autoComplete="email" />
        </div>
        <button type="submit" className="plearn-btn plearn-btn-primary plearn-btn-lg w-full justify-center">
          ส่งลิงก์รีเซ็ต
        </button>
        <Link href="/login" className="plearn-btn plearn-btn-ghost w-full justify-center text-sm">
          ← กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </form>
    </div>
  );
}
