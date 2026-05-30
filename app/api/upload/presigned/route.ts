import { NextResponse } from "next/server";

// Phase 2: S3/Mux upload not yet configured.
export async function POST() {
  return NextResponse.json(
    { error: "Video upload not available in prototype — add YouTube URL directly." },
    { status: 501 }
  );
}
