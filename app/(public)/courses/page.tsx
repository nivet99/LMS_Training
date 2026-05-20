import { Suspense } from "react";
import { CourseGrid } from "@/components/course/CourseGrid";
import { CourseSearchBar } from "@/components/course/CourseSearchBar";
import { MOCK_COURSES, MOCK_CATEGORIES } from "@/mock";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "คอร์สทั้งหมด" };
export const revalidate = 300;

interface SearchParams {
  category?: string;
  level?: string;
  q?: string;
}

export default function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, level, q } = searchParams;

  let courses = MOCK_COURSES.filter((c) => c.status === "PUBLISHED");

  if (category) courses = courses.filter((c) => c.category?.slug === category);
  if (level)    courses = courses.filter((c) => c.level === level);
  if (q)        courses = courses.filter((c) =>
    c.title.toLowerCase().includes(q.toLowerCase()) ||
    c.description.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="plearn-container py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-label mb-2" style={{ color: "var(--ink-3)" }}>
          คอร์สทั้งหมด
        </p>
        <h1 className="text-h1 mb-5" style={{ color: "var(--ink)" }}>
          {q
            ? `ผลการค้นหา "${q}"`
            : category
            ? MOCK_CATEGORIES.find((c) => c.slug === category)?.name ?? "หมวดหมู่"
            : "ค้นพบ 247 คอร์สที่ใช่"}
        </h1>
        {/* Search bar */}
        <Suspense>
          <CourseSearchBar initialQ={q ?? ""} />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="sticky top-20">
            <p className="text-label mb-3" style={{ color: "var(--ink-3)" }}>หมวดหมู่</p>
            <div className="space-y-0.5">
              <Link
                href="/courses"
                className={`block px-3 py-2 rounded-lg text-body-s transition-colors ${!category ? "bg-[var(--vermilion-soft)] text-[var(--vermilion)]" : "text-[var(--ink-3)] hover:bg-[var(--cream-2)]"}`}
              >
                ทั้งหมด
              </Link>
              {MOCK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/courses?category=${cat.slug}`}
                  className={`block px-3 py-2 rounded-lg text-body-s transition-colors ${category === cat.slug ? "bg-[var(--vermilion-soft)] text-[var(--vermilion)]" : "text-[var(--ink-3)] hover:bg-[var(--cream-2)]"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <p className="text-label mb-3 mt-6" style={{ color: "var(--ink-3)" }}>ระดับ</p>
            <div className="space-y-0.5">
              {[
                { value: "", label: "ทุกระดับ" },
                { value: "BEGINNER",     label: "เริ่มต้น" },
                { value: "INTERMEDIATE", label: "กลาง" },
                { value: "ADVANCED",     label: "ขั้นสูง" },
              ].map((l) => (
                <Link
                  key={l.value}
                  href={`/courses${l.value ? `?level=${l.value}` : ""}${category ? `${l.value ? "&" : "?"}category=${category}` : ""}`}
                  className={`block px-3 py-2 rounded-lg text-body-s transition-colors ${level === l.value || (!level && !l.value) ? "bg-[var(--vermilion-soft)] text-[var(--vermilion)]" : "text-[var(--ink-3)] hover:bg-[var(--cream-2)]"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <p className="text-caption mb-6" style={{ color: "var(--ink-3)" }}>
            {courses.length} คอร์ส
          </p>
          <CourseGrid courses={courses} columns={3} />
        </div>
      </div>
    </div>
  );
}
