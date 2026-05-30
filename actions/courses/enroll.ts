"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { MOCK_CHAPTERS, MOCK_COURSES } from "@/mock";

export async function enrollCourse(courseId: string): Promise<void> {
  const session = getSession();
  if (!session) {
    const course = MOCK_COURSES.find((c) => c.id === courseId);
    redirect(`/login?callbackUrl=/courses/${course?.slug ?? courseId}`);
  }

  // Add courseId to this user's enrollment cookie
  const key = `enrollments_${session.id}`;
  let existing: string[] = [];
  try {
    existing = JSON.parse(cookies().get(key)?.value ?? "[]");
  } catch {}

  if (!existing.includes(courseId)) {
    existing.push(courseId);
    cookies().set(key, JSON.stringify(existing), {
      httpOnly: false,
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 365,
      path:     "/",
    });
  }

  // TODO Phase 2: db.enrollment.upsert({ where: { userId_courseId: ... }, create: { ... } })

  // Navigate to first lesson
  const chapters    = MOCK_CHAPTERS[courseId] ?? [];
  const firstLesson = chapters[0]?.lessons[0];
  redirect(
    firstLesson
      ? `/my-courses/${courseId}/learn/${firstLesson.id}`
      : `/my-courses/${courseId}`
  );
}
