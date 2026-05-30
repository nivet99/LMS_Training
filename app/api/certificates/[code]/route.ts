import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

// Phase 2: Certificate verification requires a real database.
// Returns 404 for all codes in prototype mode.
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  if (!params.code) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
  return NextResponse.json({ valid: false }, { status: 404 });
}
