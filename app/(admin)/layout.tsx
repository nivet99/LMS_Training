import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { signOutUser } from "@/actions/auth/signout";

const ADMIN_NAV = [
  { href: "/admin/dashboard",     label: "ภาพรวม" },
  { href: "/admin/courses",       label: "ตรวจสอบคอร์ส" },
  { href: "/admin/users",         label: "ผู้ใช้งาน" },
  { href: "/admin/payments",      label: "การชำระเงิน" },
  { href: "/admin/settings",      label: "ตั้งค่าระบบ" },
  { href: "/admin/announcements", label: "ประกาศ" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  if (!session) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.role)) redirect("/dashboard");

  const initial = session.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: "var(--ink)", borderColor: "rgba(255,252,246,0.1)" }}
      >
        <div className="plearn-container flex h-14 items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-[var(--vermilion)] flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">P</span>
            </div>
            <span className="font-serif font-medium text-lg" style={{ color: "var(--paper)" }}>
              Plearn
            </span>
          </Link>
          <span
            className="text-label px-2 py-0.5 rounded"
            style={{ background: "rgba(255,77,46,0.25)", color: "var(--vermilion)" }}
          >
            ADMIN
          </span>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {ADMIN_NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
                style={{ color: "rgba(255,252,246,0.65)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-caption hidden md:block" style={{ color: "rgba(255,252,246,0.5)" }}>
              {session.name}
            </span>
            <form action={signOutUser} className="flex items-center">
              <button
                type="submit"
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: "var(--vermilion)", color: "white" }}
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
