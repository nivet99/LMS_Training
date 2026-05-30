import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { signOutUser } from "@/actions/auth/signout";

const INSTRUCTOR_NAV = [
  { href: "/instructor/dashboard", label: "ภาพรวม" },
  { href: "/instructor/courses",   label: "คอร์สของฉัน" },
  { href: "/instructor/payouts",   label: "รายได้" },
  { href: "/instructor/settings",  label: "ตั้งค่า" },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  if (!session) redirect("/login");
  if (!["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].includes(session.role)) redirect("/dashboard");

  const initial = session.name.charAt(0).toUpperCase();

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
          <span
            className="text-label px-2 py-0.5 rounded"
            style={{ background: "var(--pine-soft)", color: "var(--pine)" }}
          >
            INSTRUCTOR
          </span>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {INSTRUCTOR_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="plearn-nav-item text-sm">{l.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-caption hidden md:block" style={{ color: "var(--ink-3)" }}>
              {session.name}
            </span>
            <form action={signOutUser} className="flex items-center">
              <button
                type="submit"
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: "var(--pine)", color: "var(--paper)" }}
                title="ออกจากระบบ"
              >
                {initial}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="plearn-container py-8">{children}</main>
    </div>
  );
}
