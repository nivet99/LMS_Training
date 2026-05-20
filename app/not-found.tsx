import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--cream)" }}
    >
      <p
        className="font-mono font-medium mb-4"
        style={{ fontSize: "80px", color: "var(--line-2)", lineHeight: 1 }}
      >
        404
      </p>
      <h1 className="text-h2 font-serif mb-3" style={{ color: "var(--ink)" }}>
        ไม่พบหน้าที่ต้องการ
      </h1>
      <p className="text-body mb-8" style={{ color: "var(--ink-3)" }}>
        หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือลบไปแล้ว
      </p>
      <div className="flex gap-3">
        <Link href="/" className="plearn-btn plearn-btn-primary">กลับหน้าแรก</Link>
        <Link href="/courses" className="plearn-btn plearn-btn-line">ดูคอร์ส</Link>
      </div>
    </div>
  );
}
