import Link from "next/link";

const INSTRUCTOR_NAV = [
  { href: "/instructor/dashboard", label: "ภาพรวม" },
  { href: "/instructor/courses",   label: "คอร์สของฉัน" },
  { href: "/instructor/payouts",   label: "รายได้" },
  { href: "/instructor/settings",  label: "ตั้งค่า" },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <header className="sticky top-0 z-40 border-b" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        <div className="plearn-container flex h-14 items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-[var(--vermilion)] flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">P</span>
            </div>
            <span className="font-serif font-medium text-lg" style={{ color: "var(--ink)" }}>Plearn</span>
          </Link>
          <span className="text-label" style={{ color: "var(--ink-4)" }}>INSTRUCTOR</span>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {INSTRUCTOR_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="plearn-nav-item text-sm">{l.label}</Link>
            ))}
          </nav>
          <Link href="/instructor/courses/new" className="ml-auto plearn-btn plearn-btn-primary text-sm">
            + สร้างคอร์ส
          </Link>
        </div>
      </header>
      <main className="plearn-container py-8">{children}</main>
    </div>
  );
}
