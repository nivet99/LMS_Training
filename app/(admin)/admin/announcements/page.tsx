import type { Metadata } from "next";

export const metadata: Metadata = { title: "ประกาศ — Admin" };

type Announcement = {
  id: string;
  title: string;
  body: string;
  target: "ALL" | "LEARNERS" | "INSTRUCTORS";
  status: "ACTIVE" | "DRAFT" | "EXPIRED";
  publishedAt: string | null;
  expiresAt: string | null;
};

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_01",
    title: "อัปเดตใหม่: ระบบ Certificate พร้อมใช้งานแล้ว",
    body: "ตั้งแต่วันนี้เป็นต้นไป ผู้เรียนที่เรียนจบคอร์สจะได้รับ Certificate อัตโนมัติ สามารถดาวน์โหลดได้ที่หน้า 'คอร์สของฉัน'",
    target: "ALL",
    status: "ACTIVE",
    publishedAt: "2026-05-20",
    expiresAt: null,
  },
  {
    id: "ann_02",
    title: "โปรโมชั่น: ลด 30% ทุกคอร์สในหมวด Technology",
    body: "ฉลองครบรอบ 1 ปี Plearn! ลด 30% ทุกคอร์สหมวด Technology ตลอดเดือนมิถุนายน ใช้โค้ด PLEARN1ST",
    target: "LEARNERS",
    status: "DRAFT",
    publishedAt: null,
    expiresAt: "2026-06-30",
  },
  {
    id: "ann_03",
    title: "แนวทางใหม่สำหรับการสร้างคอร์ส",
    body: "ผู้สอนทุกท่านโปรดอ่านแนวทางการสร้างเนื้อหาและมาตรฐานวิดีโอใหม่ก่อนอัปโหลดคอร์สหน้าจากนี้",
    target: "INSTRUCTORS",
    status: "ACTIVE",
    publishedAt: "2026-05-15",
    expiresAt: null,
  },
];

const TARGET_LABEL: Record<string, string>  = { ALL: "ทุกคน", LEARNERS: "ผู้เรียน", INSTRUCTORS: "ผู้สอน" };
const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE:  { bg: "var(--pine-soft, #E8F5E9)", text: "var(--pine)",      label: "เผยแพร่" },
  DRAFT:   { bg: "var(--cream-2)",             text: "var(--ink-3)",     label: "แบบร่าง" },
  EXPIRED: { bg: "var(--vermilion-soft)",      text: "var(--vermilion)", label: "หมดอายุ" },
};

export default function AdminAnnouncementsPage() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>PLATFORM ADMIN</p>
          <h1 className="text-display-m" style={{ color: "var(--ink)" }}>ประกาศ</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Announcement list */}
        <div className="space-y-4">
          <h2 className="text-h3" style={{ color: "var(--ink)" }}>ประกาศทั้งหมด ({MOCK_ANNOUNCEMENTS.length})</h2>
          {MOCK_ANNOUNCEMENTS.map((ann) => {
            const ss = STATUS_STYLE[ann.status];
            return (
              <div key={ann.id} className="rounded-xl border p-5"
                style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body font-medium mb-1" style={{ color: "var(--ink)" }}>
                      {ann.title}
                    </h3>
                    <p className="text-body-s line-clamp-2" style={{ color: "var(--ink-3)" }}>
                      {ann.body}
                    </p>
                  </div>
                  <span className="badge text-xs shrink-0" style={{ background: ss.bg, color: ss.text }}>
                    {ss.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="badge text-xs"
                    style={{ background: "var(--cream-2)", color: "var(--ink-3)" }}>
                    {TARGET_LABEL[ann.target]}
                  </span>
                  {ann.publishedAt && (
                    <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                      เผยแพร่: {ann.publishedAt}
                    </span>
                  )}
                  {ann.expiresAt && (
                    <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                      หมดอายุ: {ann.expiresAt}
                    </span>
                  )}
                  <div className="ml-auto flex gap-2">
                    <button className="px-3 py-1 rounded-lg text-xs font-medium"
                      style={{ background: "var(--cream-2)", color: "var(--ink-3)" }}>
                      แก้ไข
                    </button>
                    {ann.status === "DRAFT" && (
                      <button className="px-3 py-1 rounded-lg text-xs font-medium"
                        style={{ background: "var(--pine-soft, #E8F5E9)", color: "var(--pine)" }}>
                        เผยแพร่
                      </button>
                    )}
                    {ann.status === "ACTIVE" && (
                      <button className="px-3 py-1 rounded-lg text-xs font-medium"
                        style={{ background: "var(--vermilion-soft)", color: "var(--vermilion)" }}>
                        ถอนออก
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* New announcement form */}
        <div className="rounded-xl border p-6 sticky top-20"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
          <h2 className="text-h3 mb-5" style={{ color: "var(--ink)" }}>สร้างประกาศใหม่</h2>
          <div className="space-y-4">
            <div>
              <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                หัวข้อ
              </label>
              <input
                type="text"
                placeholder="หัวข้อประกาศ"
                className="w-full px-4 py-2.5 rounded-lg border text-body-s"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--cream)",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                เนื้อหา
              </label>
              <textarea
                placeholder="เนื้อหาประกาศ..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border text-body-s resize-none"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--cream)",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                กลุ่มเป้าหมาย
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border text-body-s"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--cream)",
                  color: "var(--ink)",
                  outline: "none",
                }}
              >
                <option value="ALL">ทุกคน</option>
                <option value="LEARNERS">ผู้เรียนเท่านั้น</option>
                <option value="INSTRUCTORS">ผู้สอนเท่านั้น</option>
              </select>
            </div>

            <div>
              <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                วันหมดอายุ (ไม่บังคับ)
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg border text-body-s"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--cream)",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button className="plearn-btn plearn-btn-line flex-1 justify-center">
                บันทึกแบบร่าง
              </button>
              <button className="plearn-btn plearn-btn-primary flex-1 justify-center">
                เผยแพร่ทันที
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
