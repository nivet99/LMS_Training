"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  title?: string;
}

export function Sidebar({ links, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 shrink-0 hidden lg:block"
      style={{ borderRight: "1px solid var(--line)" }}
    >
      {title && (
        <p className="text-label px-4 pt-6 pb-3" style={{ color: "var(--ink-3)" }}>
          {title}
        </p>
      )}
      <nav className="flex flex-col gap-0.5 px-2 py-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-body-s font-medium transition-colors",
              pathname === link.href
                ? "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                : "text-[var(--ink-3)] hover:bg-[var(--cream-2)] hover:text-[var(--ink)]"
            )}
          >
            <span className="w-4 h-4 shrink-0">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
