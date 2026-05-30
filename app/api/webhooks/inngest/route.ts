import { NextResponse } from "next/server";

// Phase 2: Inngest event bus not yet configured.
// Returns 200 so any accidental calls don't trigger retries.
export async function GET()  { return NextResponse.json({ ok: true }); }
export async function POST() { return NextResponse.json({ ok: true }); }
export async function PUT()  { return NextResponse.json({ ok: true }); }
