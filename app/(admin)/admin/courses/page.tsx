import type { Metadata } from "next";
import { MOCK_COURSES } from "@/mock";
import { formatCurrency } from "@/lib/utils";
import { CourseStatusBadge } from "@/components/course/CourseStatusBadge";

export const metadata: Metadata = { title: "ตรวจสอบคอร์ส — Admin" };

const STATUS_FILTER_LABELS: Record<string, string> = {
  ALL: "ทั้งหมด", DRAFT: "แบบร่าง", REVIEW: "รอตรวจสอบ", PUBLISHED: "เผยแพร่แล้ว", ARCHIVED: "เก็บถาวร",
};

export default function AdminCoursesPage() {
  const queue = MOCK_COURSES.filter((c) => c.status === "IN_REVIEW");
  const published = MOCK_COURSES.filter((c) => c.status === "PUBLISHED");
  const drafts = MOCK_COURSES.filter((c) => c.status === "DRAFT");

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>PLATFORM ADMIN</p>
          <h1 className="text-display-m" style={{ color: "var(--ink)" }}>ตรวจสอบคอร์ส</h1>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "ทั้งหมด",         value: MOCK_COURSES.length, color: "var(--ink)" },
          { label: "รอตรวจสอบ",       value: queue.length,       color: "var(--mustard)" },
          { label: "เผยแพร่แล้ว",     value: published.length,   color: "var(--pine)" },
          { label: "แบบร่าง",         value: drafts.length,      color: "var(--ink-3)" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 text-center"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <p className="font-serif font-medium text-2xl" style={{ color: s.color }}>{s.value}</p>
            <p className="text-caption mt-0.5" style={{ color: "var(--ink-3)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Moderation queue */}
      {queue.length > 0 && (
        <div className="mb-8">
          <h2 className="text-h3 mb-4 flex items-center gap-2" style={{ color: "var(--ink)" }}>
            คิวรอตรวจสอบ
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium"
              style={{ background: "var(--mustard)", color: "var(--ink)" }}>
              {queue.length}
            </span>
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
                  {["คอร์ส", "ผู้สอน", "หมวดหมู่", "ราคา", "สถานะ", "การดำเนินการ"].map((h) => (
                    <th key={h} className="px-4 py-3 text-caption font-medium" style={{ color: "var(--ink-3)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queue.map((course, i) => (
                  <tr key={course.id}
                    style={{
                      background: "var(--paper)",
                      borderTop: i > 0 ? "1px solid var(--line)" : undefined,
                    }}>
                    <td className="px-4 py-3">
                      <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>{course.title}</p>
                      <p className="text-caption" style={{ color: "var(--ink-4)" }}>{course.id}</p>
                    </td>
                    <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink-3)" }}>
                      {course.instructor.name}
                    </td>
                    <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink-3)" }}>
                      {course.category?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-body-s font-mono" style={{ color: "var(--ink)" }}>
                      {!course.price || Number(course.price) === 0
                        ? "ฟรี"
                        : formatCurrency(course.price!, course.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <CourseStatusBadge status={course.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          style={{ background: "var(--pine-soft, #E8F5E9)", color: "var(--pine)" }}
                        >
                          อนุมัติ
                        </button>
                        <button
                          className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          style={{ background: "var(--vermilion-soft)", color: "var(--vermilion)" }}
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All courses table */}
      <div>
        <h2 className="text-h3 mb-4" style={{ color: "var(--ink)" }}>คอร์สทั้งหมด</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
                {["คอร์ส", "ผู้สอน", "หมวดหมู่", "ราคา", "ผู้เรียน", "คะแนน", "สถานะ"].map((h) => (
                  <th key={h} className="px-4 py-3 text-caption font-medium" style={{ color: "var(--ink-3)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_COURSES.map((course, i) => (
                <tr key={course.id}
                  style={{
                    background: "var(--paper)",
                    borderTop: i > 0 ? "1px solid var(--line)" : undefined,
                  }}>
                  <td className="px-4 py-3">
                    <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>{course.title}</p>
                    <p className="text-caption" style={{ color: "var(--ink-4)" }}>{course.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink-3)" }}>
                    {course.instructor.name}
                  </td>
                  <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink-3)" }}>
                    {course.category?.name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-body-s font-mono" style={{ color: "var(--ink)" }}>
                    {!course.price || Number(course.price) === 0
                      ? "ฟรี"
                      : formatCurrency(course.price!, course.currency)}
                  </td>
                  <td className="px-4 py-3 text-body-s font-mono" style={{ color: "var(--ink)" }}>
                    {course.enrollmentCount?.toLocaleString() ?? "0"}
                  </td>
                  <td className="px-4 py-3 text-body-s font-mono" style={{ color: "var(--mustard)" }}>
                    {course.averageRating?.toFixed(1) ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <CourseStatusBadge status={course.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
