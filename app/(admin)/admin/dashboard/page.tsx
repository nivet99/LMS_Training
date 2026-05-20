import type { Metadata } from "next";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>PLATFORM ADMIN</p>
        <h1 className="text-display-m" style={{ color: "var(--ink)" }}>ภาพรวมแพลตฟอร์ม</h1>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "GMV (เดือนนี้)",       value: formatCurrency(1_250_000, "THB"), delta: "+12%",  up: true },
          { label: "MAU",                   value: formatNumber(18_400),             delta: "+8%",   up: true },
          { label: "ผู้สอนที่ active",     value: formatNumber(312),                delta: "+23",   up: true },
          { label: "คอร์สรอตรวจสอบ",       value: "7",                              delta: "ใหม่",  up: false },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border p-5"
            style={{ background: "var(--paper)", borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-caption mb-1" style={{ color: "var(--ink-3)" }}>{kpi.label}</p>
            <p className="font-serif font-medium" style={{ fontSize: "26px", color: "var(--ink)", lineHeight: 1.1 }}>
              {kpi.value}
            </p>
            <span className="text-caption font-mono" style={{ color: kpi.up ? "var(--pine)" : "var(--vermilion)" }}>
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Moderation queue placeholder */}
      <div className="rounded-xl border p-6" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        <h2 className="text-h3 mb-4" style={{ color: "var(--ink)" }}>คิวตรวจสอบคอร์ส</h2>
        <p className="text-body-s" style={{ color: "var(--ink-3)" }}>
          ไปที่{" "}
          <a href="/admin/courses" className="underline" style={{ color: "var(--vermilion)" }}>
            /admin/courses
          </a>{" "}
          เพื่อดูคิวทั้งหมด
        </p>
      </div>
    </div>
  );
}
