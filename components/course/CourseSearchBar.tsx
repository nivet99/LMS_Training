"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function CourseSearchBar({ initialQ = "" }: { initialQ?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQ);

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      // Reset to page 1 on new search
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); handleSearch(q); }}
      className="relative flex-1 max-w-xl"
    >
      <svg
        viewBox="0 0 20 20"
        className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none"
        stroke="var(--ink-4)"
        strokeWidth="1.5"
      >
        <circle cx="8.5" cy="8.5" r="5.5"/>
        <path d="M13 13l3 3" strokeLinecap="round"/>
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นหาคอร์ส เช่น Python, UX Design, การตลาด..."
        className="plearn-input pl-10 pr-12"
      />
      {q && (
        <button
          type="button"
          onClick={() => { setQ(""); handleSearch(""); }}
          className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-[var(--cream-2)]"
        >
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="var(--ink-3)" strokeWidth="1.5">
            <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 plearn-btn plearn-btn-primary px-3 py-1.5 text-sm"
      >
        ค้น
      </button>
    </form>
  );
}
