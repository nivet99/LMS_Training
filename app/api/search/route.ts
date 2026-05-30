import { NextRequest, NextResponse } from "next/server";
import { MOCK_COURSES } from "@/mock";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q        = (searchParams.get("q") ?? "").toLowerCase().trim();
  const category = searchParams.get("category");
  const level    = searchParams.get("level");
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit    = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));

  let results = MOCK_COURSES.filter((c) => c.status === "PUBLISHED");

  if (q) {
    results = results.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.instructor.name ?? "").toLowerCase().includes(q) ||
      (c.category?.name ?? "").toLowerCase().includes(q)
    );
  }
  if (category) results = results.filter((c) => c.category?.slug === category);
  if (level)    results = results.filter((c) => c.level === level);

  const total  = results.length;
  const offset = (page - 1) * limit;
  const hits   = results.slice(offset, offset + limit).map((c) => ({
    id:              c.id,
    title:           c.title,
    slug:            c.slug,
    thumbnail:       c.thumbnail,
    price:           c.price,
    level:           c.level,
    language:        c.language,
    averageRating:   c.averageRating,
    enrollmentCount: c.enrollmentCount,
    instructorName:  c.instructor.name,
  }));

  return NextResponse.json({ hits, estimatedTotalHits: total, page, limit });
}
