import type { Metadata } from "next";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "ผู้ใช้งาน — Admin" };

type MockUser = {
  id: string;
  name: string;
  email: string;
  role: "LEARNER" | "INSTRUCTOR" | "ADMIN";
  enrolledCourses: number;
  joinedAt: string;
  status: "ACTIVE" | "SUSPENDED";
};

const MOCK_USERS: MockUser[] = [
  { id: "demo_learner_01",    name: "ปาริชาต วรรณกรรม",  email: "learner@plearn.co",    role: "LEARNER",    enrolledCourses: 3,  joinedAt: "2026-01-15", status: "ACTIVE" },
  { id: "demo_instructor_01", name: "ดร.วิชาญ สอนดี",     email: "instructor@plearn.co", role: "INSTRUCTOR", enrolledCourses: 0,  joinedAt: "2025-11-01", status: "ACTIVE" },
  { id: "demo_admin_01",      name: "ผู้ดูแลระบบ",         email: "admin@plearn.co",      role: "ADMIN",      enrolledCourses: 0,  joinedAt: "2025-10-01", status: "ACTIVE" },
  { id: "user_0001",          name: "สมชาย ใจดี",           email: "somchai@example.com",  role: "LEARNER",    enrolledCourses: 5,  joinedAt: "2026-02-20", status: "ACTIVE" },
  { id: "user_0002",          name: "มาลี สวัสดิ์",         email: "malee@example.com",    role: "LEARNER",    enrolledCourses: 2,  joinedAt: "2026-03-10", status: "ACTIVE" },
  { id: "user_0003",          name: "อรุณ รุ่งเรือง",       email: "arun@example.com",     role: "INSTRUCTOR", enrolledCourses: 0,  joinedAt: "2026-01-08", status: "SUSPENDED" },
  { id: "user_0004",          name: "นภา ฝันดี",            email: "napa@example.com",     role: "LEARNER",    enrolledCourses: 8,  joinedAt: "2025-12-25", status: "ACTIVE" },
  { id: "user_0005",          name: "กิตติ มั่นคง",         email: "kitti@example.com",    role: "LEARNER",    enrolledCourses: 1,  joinedAt: "2026-04-01", status: "ACTIVE" },
];

const ROLE_LABEL: Record<string, string> = { LEARNER: "ผู้เรียน", INSTRUCTOR: "ผู้สอน", ADMIN: "ผู้ดูแล" };
const ROLE_COLOR: Record<string, { bg: string; text: string }> = {
  LEARNER:    { bg: "var(--cream-2)", text: "var(--ink-3)" },
  INSTRUCTOR: { bg: "#EEF2FF",        text: "#4338CA" },
  ADMIN:      { bg: "rgba(255,77,46,0.08)", text: "var(--vermilion)" },
};

export default function AdminUsersPage() {
  const total      = MOCK_USERS.length;
  const learners   = MOCK_USERS.filter((u) => u.role === "LEARNER").length;
  const instructors = MOCK_USERS.filter((u) => u.role === "INSTRUCTOR").length;
  const suspended  = MOCK_USERS.filter((u) => u.status === "SUSPENDED").length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>PLATFORM ADMIN</p>
        <h1 className="text-display-m" style={{ color: "var(--ink)" }}>ผู้ใช้งาน</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "ผู้ใช้ทั้งหมด",   value: total,      color: "var(--ink)" },
          { label: "ผู้เรียน",         value: learners,   color: "var(--ink)" },
          { label: "ผู้สอน",           value: instructors, color: "#4338CA" },
          { label: "ถูกระงับ",         value: suspended,  color: "var(--vermilion)" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 text-center"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <p className="font-serif font-medium text-2xl" style={{ color: s.color }}>{formatNumber(s.value)}</p>
            <p className="text-caption mt-0.5" style={{ color: "var(--ink-3)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
              {["ผู้ใช้", "อีเมล", "บทบาท", "คอร์สที่เรียน", "วันที่สมัคร", "สถานะ", "การดำเนินการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-caption font-medium" style={{ color: "var(--ink-3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user, i) => {
              const rc = ROLE_COLOR[user.role];
              return (
                <tr key={user.id}
                  style={{
                    background: "var(--paper)",
                    borderTop: i > 0 ? "1px solid var(--line)" : undefined,
                  }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
                        style={{ background: "var(--vermilion)", color: "white" }}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-body-s font-medium" style={{ color: "var(--ink)" }}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink-3)" }}>
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge text-xs" style={{ background: rc.bg, color: rc.text }}>
                      {ROLE_LABEL[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-s font-mono text-center" style={{ color: "var(--ink)" }}>
                    {user.enrolledCourses}
                  </td>
                  <td className="px-4 py-3 text-caption" style={{ color: "var(--ink-3)" }}>
                    {user.joinedAt}
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge text-xs"
                      style={{
                        background: user.status === "ACTIVE" ? "var(--pine-soft, #E8F5E9)" : "var(--vermilion-soft)",
                        color: user.status === "ACTIVE" ? "var(--pine)" : "var(--vermilion)",
                      }}>
                      {user.status === "ACTIVE" ? "ใช้งานอยู่" : "ถูกระงับ"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== "ADMIN" && (
                      <button
                        className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          background: user.status === "ACTIVE" ? "var(--vermilion-soft)" : "var(--pine-soft, #E8F5E9)",
                          color: user.status === "ACTIVE" ? "var(--vermilion)" : "var(--pine)",
                        }}
                      >
                        {user.status === "ACTIVE" ? "ระงับ" : "เปิดใช้งาน"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
