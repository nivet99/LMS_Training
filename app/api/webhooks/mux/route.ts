import { NextResponse } from "next/server";

// Phase 2: Mux video webhooks not yet configured.
export async function POST() {
  return NextResponse.json({ received: true });
}
