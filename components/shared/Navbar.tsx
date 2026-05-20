"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/courses",     label: "คอร์สทั้งหมด" },
  { href: "/instructors", label: "ผู้สอน" },
  { href: "/pricing",     label: "แผนราคา" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="plearn-nav">
      {/* Promo bar */}
      <div className="plearn-promo-bar">
        <span>เรียนเพลิน เก่งจริงในงานที่ทำ</span>
        <Link
          href="/courses"
          className="ml-3 underline underline-offset-2 font-semibold hover:no-underline"
        >
          ดูคอร์สทั้งหมด →
        </Link>
      </div>

      {/* Main nav */}
      <div className="plearn-container flex h-14 items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-[var(--vermilion)] flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">P</span>
          </div>
          <span
            className="font-serif font-medium text-lg tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Plearn
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "plearn-nav-item",
                pathname?.startsWith(link.href) && "active"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="plearn-btn plearn-btn-ghost text-sm">
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/signup"
            className="plearn-btn plearn-btn-primary text-sm"
          >
            เริ่มเรียน
          </Link>
        </div>
      </div>
    </header>
  );
}
