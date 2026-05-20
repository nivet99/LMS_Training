import Link from "next/link";

const LEARNER_NAV = [
  { href: "/dashboard",       label: "แดชบอร์ด" },
  { href: "/my-courses",      label: "คอร์สของฉัน" },
  { href: "/my-certificates", label: "ใบรับรอง" },
  { href: "/community",       label: "ชุมชน" },
  { href: "/billing",         label: "การชำระเงิน" },
  { href: "/settings",        label: "ตั้งค่า" },
];

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: "var(--paper)", borderColor: "var(--line)" }}
      >
        <div className="plearn-container flex h-14 items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-[var(--vermilion)] flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">P</span>
            </div>
            <span className="font-serif font-medium text-lg" style={{ color: "var(--ink)" }}>Plearn</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {LEARNER_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="plearn-nav-item text-sm">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer"
              style={{ background: "var(--vermilion)", color: "var(--paper)" }}
            >
              P
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
