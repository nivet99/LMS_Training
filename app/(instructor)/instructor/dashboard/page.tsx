import type { Metadata } from "next";
import { MOCK_COURSES } from "@/mock";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { CourseStatusBadge } from "@/components/course/CourseStatusBadge";
import Link from "next/link";

export const metadata: Metadata = { title: "Instructor Dashboard" };

const REVENUE_DATA = [
  { month: "พ.ย.", amount: 12400 },
  { month: "ธ.ค.", amount: 18900 },
  { month: "ม.ค.", amount: 15200 },
  { month: "ก.พ.", amount: 22100 },
  { month: "มี.ค.", amount: 19800 },
  { month: "เม.ย.", amount: 28400 },
  { month: "พ.ค.", amount: 31200 },
];

const max = Math.max(...REVENUE_DATA.map((d) => d.amount));

export default function InstructorDashboardPage() {
  const myCourses = MOCK_COURSES.slice(0, 4);

  return (
    <div>
      <div className="mb-8">
        <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>INSTRUCTOR PORTAL</p>
        <h1 className="text-display-m" style={{ color: "var(--ink)" }}>ภาพรวม</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "รายได้เดือนนี้",   value: formatCurrency(31200, "THB") },
          { label: "ผู้เรียนทั้งหมด", value: formatNumber(4660) },
          { label: "คอร์สที่เผยแพร่",  value: "4" },
          { label: "คะแนนเฉลี่ย",     value: "4.8 ★" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border p-5"
            style={{ background: "var(--paper)", borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-caption mb-1" style={{ color: "var(--ink-3)" }}>{kpi.label}</p>
            <p className="font-serif font-medium" style={{ fontSize: "26px", color: "var(--ink)", lineHeight: 1.1 }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        {/* Revenue chart */}
        <div className="rounded-xl border p-6"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
          <h2 className="text-h3 mb-6" style={{ color: "var(--ink)" }}>รายได้รายเดือน</h2>
          <div className="flex items-end gap-3 h-40">
            {REVENUE_DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-caption-s" style={{ color: "var(--ink-4)" }}>
                  {formatNumber(d.amount / 1000)}k
                </span>
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${(d.amount / max) * 128}px`,
                    background: "var(--vermilion)",
                    opacity: d.month === "พ.ค." ? 1 : 0.4,
                  }}
                />
                <span className="text-label-xs" style={{ color: "var(--ink-3)" }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* My courses list */}
        <div className="rounded-xl border p-6"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-h3" style={{ color: "var(--ink)" }}>คอร์สของฉัน</h2>
            <Link href="/instructor/courses" className="text-caption" style={{ color: "var(--vermilion)" }}>
              ดูทั้งหมด
            </Link>
          </div>
          <div className="space-y-3">
            {myCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-3 py-2 border-b last:border-0"
                style={{ borderColor: "var(--line)" }}>
                <div className={`w-10 h-10 rounded-lg shrink-0 ${
                  { design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
                    finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
                    lifestyle: "thumb-lifestyle" }[course.category?.slug ?? ""] ?? "thumb-default"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-body-s font-medium truncate" style={{ color: "var(--ink)" }}>
                    {course.title}
                  </p>
                  <p className="text-caption" style={{ color: "var(--ink-3)" }}>
                    {formatNumber(course.enrollmentCount ?? 0)} ผู้เรียน
                  </p>
                </div>
                <CourseStatusBadge status={course.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
