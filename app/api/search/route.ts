import { NextRequest, NextResponse } from "next/server";
import { searchClient, COURSES_INDEX } from "@/lib/meilisearch";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q        = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const level    = searchParams.get("level");
  const page     = parseInt(searchParams.get("page") ?? "1", 10);
  const limit    = parseInt(searchParams.get("limit") ?? "20", 10);

  const filter: string[] = ["status = PUBLISHED"];
  if (category) filter.push(`categorySlug = ${category}`);
  if (level)    filter.push(`level = ${level}`);

  try {
    const index   = searchClient.index(COURSES_INDEX);
    const results = await index.search(q, {
      filter: filter.join(" AND "),
      limit,
      offset: (page - 1) * limit,
      attributesToRetrieve: ["id", "title", "slug", "thumbnail", "price", "level", "language", "averageRating", "enrollmentCount", "instructorName"],
    });
    return NextResponse.json(results);
  } catch (err) {
    console.error("[search]", err);
    return NextResponse.json({ hits: [], estimatedTotalHits: 0 });
  }
}
