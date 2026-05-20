import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Plearn — เรียนเพลิน เก่งจริงในงานที่ทำ", template: "%s | Plearn" },
  description: "แพลตฟอร์มเรียนออนไลน์ภาษาไทย คอร์สคุณภาพจากผู้เชี่ยวชาญ พร้อมใบรับรองที่นายจ้างยอมรับ",
  keywords: ["เรียนออนไลน์", "คอร์สออนไลน์", "LMS", "การศึกษา", "ทักษะ"],
  authors: [{ name: "Plearn Team" }],
  creator: "Plearn",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Plearn",
    title: "Plearn — เรียนเพลิน เก่งจริงในงานที่ทำ",
    description: "แพลตฟอร์มเรียนออนไลน์ภาษาไทย คอร์สคุณภาพจากผู้เชี่ยวชาญ",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FF4D2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body style={{ background: "var(--cream)", color: "var(--ink)" }}>
        {children}
      </body>
    </html>
  );
}
