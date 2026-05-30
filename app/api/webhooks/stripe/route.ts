import { NextResponse } from "next/server";

// Phase 2: Stripe webhooks not yet configured.
// Returns 200 so Stripe doesn't mark the endpoint as failing.
export async function POST() {
  return NextResponse.json({ received: true });
}
