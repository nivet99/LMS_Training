import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--cream)" }}>
      {/* Minimal header */}
      <header className="h-14 flex items-center px-8 border-b" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--vermilion)] flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">P</span>
          </div>
          <span className="font-serif font-medium text-lg" style={{ color: "var(--ink)" }}>Plearn</span>
        </Link>
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-2xl border p-8"
          style={{ background: "var(--paper)", borderColor: "var(--line)", boxShadow: "var(--shadow-lift)" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
