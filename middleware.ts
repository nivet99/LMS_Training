import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth middleware is a stub until next-auth is added back in Phase 1 auth wiring.
// All routes are publicly accessible during development.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|og).*)",
  ],
};
