import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 3600;

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const cert = await db.certificate.findUnique({
    where:   { verifyCode: params.code },
    include: {
      user:   { select: { name: true } },
      course: { include: { instructor: { select: { name: true } } } },
    },
  });

  if (!cert) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  return NextResponse.json(
    {
      valid:          !cert.revokedAt,
      learnerName:    cert.user.name,
      courseName:     cert.course.title,
      instructorName: cert.course.instructor.name,
      issuedAt:       cert.issuedAt,
      revokedAt:      cert.revokedAt ?? null,
    },
    {
      headers: { "Cache-Control": "public, max-age=3600" },
    }
  );
}
