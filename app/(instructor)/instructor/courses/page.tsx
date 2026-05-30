import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_COURSES } from "@/mock";
import { CourseStatusBadge } from "@/components/course/CourseStatusBadge";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "คอร์สของฉัน" };

export default function InstructorCoursesPage() {
  const courses = MOCK_COURSES.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>INSTRUCTOR PORTAL</p>
          <h1 className="text-display-m" style={{ color: "var(--ink)" }}>คอร์สของฉัน</h1>
        </div>
        <Link href="/instructor/courses/new" className="plearn-btn plearn-btn-primary">
          + สร้างคอร์สใหม่
        </Link>
      </div>

      {/* Course table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
              <th className="text-left px-5 py-3 text-caption font-medium" style={{ color: "var(--ink-3)" }}>คอร์ส</th>
              <th className="text-left px-5 py-3 text-caption font-medium hidden md:table-cell" style={{ color: "var(--ink-3)" }}>สถานะ</th>
              <th className="text-right px-5 py-3 text-caption font-medium hidden lg:table-cell" style={{ color: "var(--ink-3)" }}>ผู้เรียน</th>
              <th className="text-right px-5 py-3 text-caption font-medium hidden lg:table-cell" style={{ color: "var(--ink-3)" }}>ราคา</th>
              <th className="text-right px-5 py-3 text-caption font-medium" style={{ color: "var(--ink-3)" }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, i) => (
              <tr
                key={course.id}
                style={{
                  borderBottom: i < courses.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-9 rounded-lg shrink-0 ${
                        { design: "thumb-design", marketing: "thumb-marketing", tech: "thumb-tech",
                          finance: "thumb-finance", language: "thumb-language", business: "thumb-business",
                          lifestyle: "thumb-lifestyle" }[course.category?.slug ?? ""] ?? "thumb-default"
                      }`}
                    />
                    <div>
                      <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>
                        {course.title}
                      </p>
                      <p className="text-caption" style={{ color: "var(--ink-3)" }}>
                        {course.category?.name ?? "ไม่มีหมวดหมู่"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <CourseStatusBadge status={course.status} />
                </td>
                <td className="px-5 py-4 text-right hidden lg:table-cell">
                  <span className="text-body-s font-mono" style={{ color: "var(--ink)" }}>
                    {formatNumber(course.enrollmentCount ?? 0)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right hidden lg:table-cell">
                  <span className="text-body-s font-mono" style={{ color: "var(--ink)" }}>
                    {course.price != null ? formatCurrency(Number(course.price), "THB") : "ฟรี"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/instructor/courses/${course.id}/edit`}
                      className="plearn-btn plearn-btn-ghost text-sm px-3"
                    >
                      จัดการเนื้อหา
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
