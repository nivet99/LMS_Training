"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--cream)" }}
    >
      <p className="text-label mb-4" style={{ color: "var(--ink-3)" }}>ข้อผิดพลาด</p>
      <h1 className="text-h1 font-serif mb-3" style={{ color: "var(--ink)" }}>
        เกิดข้อผิดพลาดบางอย่าง
      </h1>
      <p className="text-body mb-8 text-center max-w-sm" style={{ color: "var(--ink-3)" }}>
        {error.message || "กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมสนับสนุน"}
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="plearn-btn plearn-btn-primary">
          ลองใหม่
        </button>
        <Link href="/" className="plearn-btn plearn-btn-line">
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}
