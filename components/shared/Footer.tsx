import Link from "next/link";

const FOOTER_LINKS = {
  เรียนรู้: [
    { href: "/courses",     label: "คอร์สทั้งหมด" },
    { href: "/instructors", label: "ผู้สอน" },
    { href: "/pricing",     label: "แผนราคา" },
    { href: "/blog",        label: "บทความ" },
  ],
  บริษัท: [
    { href: "/about",   label: "เกี่ยวกับเรา" },
    { href: "/contact", label: "ติดต่อเรา" },
    { href: "/faq",     label: "คำถามที่พบบ่อย" },
  ],
  กฎหมาย: [
    { href: "/terms",   label: "เงื่อนไขการใช้งาน" },
    { href: "/privacy", label: "นโยบายความเป็นส่วนตัว" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t mt-24"
      style={{ borderColor: "var(--line)", backgroundColor: "var(--paper)" }}
    >
      <div className="plearn-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[var(--vermilion)] flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">P</span>
              </div>
              <span className="font-serif font-medium text-lg" style={{ color: "var(--ink)" }}>
                Plearn
              </span>
            </div>
            <p className="text-caption" style={{ color: "var(--ink-3)" }}>
              เรียนเพลิน เก่งจริงในงานที่ทำ
            </p>
            <p className="text-caption mt-4" style={{ color: "var(--ink-4)" }}>
              © {new Date().getFullYear()} Plearn Co., Ltd.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p
                className="text-label mb-4"
                style={{ color: "var(--ink-3)" }}
              >
                {group}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-s transition-colors hover:underline"
                      style={{ color: "var(--ink-3)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
