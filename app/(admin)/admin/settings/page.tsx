import type { Metadata } from "next";

export const metadata: Metadata = { title: "ตั้งค่าระบบ — Admin" };

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>PLATFORM ADMIN</p>
        <h1 className="text-display-m" style={{ color: "var(--ink)" }}>ตั้งค่าระบบ</h1>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Settings nav */}
        <nav className="space-y-1">
          {[
            { label: "ทั่วไป",            active: true  },
            { label: "การชำระเงิน",       active: false },
            { label: "อีเมลและการแจ้งเตือน", active: false },
            { label: "ความปลอดภัย",       active: false },
            { label: "SEO และ Meta",       active: false },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full text-left px-4 py-2.5 rounded-lg text-body-s transition-colors"
              style={{
                background: item.active ? "var(--vermilion-soft)" : "transparent",
                color: item.active ? "var(--vermilion)" : "var(--ink-3)",
                fontWeight: item.active ? 600 : 400,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Settings panels */}
        <div className="space-y-6">
          {/* General */}
          <div className="rounded-xl border p-6" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <h2 className="text-h3 mb-5" style={{ color: "var(--ink)" }}>ข้อมูลแพลตฟอร์ม</h2>
            <div className="space-y-4">
              {[
                { label: "ชื่อแพลตฟอร์ม",     value: "Plearn",           type: "text" },
                { label: "URL หลัก",           value: "https://plearn.co", type: "text" },
                { label: "อีเมลสำหรับติดต่อ", value: "hello@plearn.co",   type: "email" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full px-4 py-2.5 rounded-lg border text-body-s"
                    style={{
                      borderColor: "var(--line)",
                      background: "var(--cream)",
                      color: "var(--ink)",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
              <div>
                <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                  คำอธิบายแพลตฟอร์ม
                </label>
                <textarea
                  defaultValue="แพลตฟอร์มเรียนออนไลน์คุณภาพสูงสำหรับคนไทย"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border text-body-s resize-none"
                  style={{
                    borderColor: "var(--line)",
                    background: "var(--cream)",
                    color: "var(--ink)",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Commission */}
          <div className="rounded-xl border p-6" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <h2 className="text-h3 mb-5" style={{ color: "var(--ink)" }}>ค่าคอมมิชชั่น</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                    % แพลตฟอร์มได้รับจากการขายคอร์ส
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      defaultValue={30}
                      min={0}
                      max={100}
                      className="w-full px-4 py-2.5 rounded-lg border text-body-s"
                      style={{
                        borderColor: "var(--line)",
                        background: "var(--cream)",
                        color: "var(--ink)",
                        outline: "none",
                      }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-s"
                      style={{ color: "var(--ink-3)" }}>%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-body-s font-medium block mb-1.5" style={{ color: "var(--ink)" }}>
                    % ผู้สอนได้รับ
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      defaultValue={70}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg border text-body-s cursor-not-allowed"
                      style={{
                        borderColor: "var(--line)",
                        background: "var(--cream-2)",
                        color: "var(--ink-3)",
                        outline: "none",
                      }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-s"
                      style={{ color: "var(--ink-3)" }}>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="rounded-xl border p-6" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <h2 className="text-h3 mb-5" style={{ color: "var(--ink)" }}>ฟีเจอร์</h2>
            <div className="space-y-4">
              {[
                { label: "เปิดสมัครสมาชิกใหม่",             enabled: true },
                { label: "เปิดให้ผู้สอนสร้างคอร์สได้เอง",  enabled: true },
                { label: "ระบบใบรับรอง (Certificate)",       enabled: true },
                { label: "โหมดบำรุงรักษา",                  enabled: false },
              ].map((feat) => (
                <div key={feat.label} className="flex items-center justify-between py-2">
                  <span className="text-body-s" style={{ color: "var(--ink)" }}>{feat.label}</span>
                  <div
                    className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                    style={{ background: feat.enabled ? "var(--pine)" : "var(--line)" }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ left: feat.enabled ? "calc(100% - 20px)" : "4px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button className="plearn-btn plearn-btn-primary plearn-btn-lg">
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
