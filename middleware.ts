import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/my-courses", "/my-certificates", "/billing", "/settings", "/community"];
const INSTRUCTOR_PREFIXES = ["/instructor"];
const ADMIN_PREFIXES     = ["/admin"];
const AUTH_PAGES         = ["/login", "/signup", "/forgot-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const raw = req.cookies.get("plearn_user")?.value;
  let session: { role: string } | null = null;
  if (raw) {
    try { session = JSON.parse(raw); } catch { /* invalid cookie */ }
  }

  // ถ้า login แล้ว อย่าให้กลับไปหน้า auth
  if (session && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Guard learner routes
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Guard instructor routes
  if (INSTRUCTOR_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!session || !["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].includes(session.role)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Guard admin routes
  if (ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|og).*)" ],
};
