import { cookies } from "next/headers";
import { MOCK_CHAPTERS, MOCK_PROGRESS } from "@/mock";
import type { MockLesson } from "@/mock";

// Pre-enrolled courses for demo accounts (simulates existing DB rows)
export const DEMO_ENROLLED: Record<string, string[]> = {
  demo_learner_01:    ["course_01", "course_02", "course_03"],
  demo_instructor_01: [],
  demo_admin_01:      [],
};

/** Returns all course IDs the user is enrolled in (demo + cookie). */
export function getEnrolledIds(userId: string): string[] {
  const demo = DEMO_ENROLLED[userId] ?? [];
  let cookie: string[] = [];
  try {
    cookie = JSON.parse(cookies().get(`enrollments_${userId}`)?.value ?? "[]");
  } catch {}
  return [...new Set([...demo, ...cookie])];
}

/** Returns true if the user is enrolled in the given course. */
export function isEnrolledIn(userId: string, courseId: string): boolean {
  return getEnrolledIds(userId).includes(courseId);
}

export type CourseProgressResult = {
  completedIds:  Set<string>;
  totalLessons:  number;
  progress:      number;   // 0–100
  nextLessonId:  string | null;
  allLessons:    MockLesson[];
};

/** Computes completion % for a course, merging MOCK_PROGRESS + progress_{courseId} cookie. */
export function getCourseProgress(courseId: string): CourseProgressResult {
  const chapters   = MOCK_CHAPTERS[courseId] ?? [];
  const allLessons = chapters.flatMap((ch) => ch.lessons);

  let cookieCompleted: string[] = [];
  try {
    cookieCompleted = JSON.parse(cookies().get(`progress_${courseId}`)?.value ?? "[]");
  } catch {}

  const mockCompleted = allLessons
    .filter((l) => MOCK_PROGRESS[l.id]?.completedAt)
    .map((l) => l.id);

  const completedIds  = new Set([...cookieCompleted, ...mockCompleted]);
  const totalLessons  = allLessons.length;
  const progress      = totalLessons > 0 ? Math.round((completedIds.size / totalLessons) * 100) : 0;
  const nextLesson    = allLessons.find((l) => !completedIds.has(l.id)) ?? allLessons[allLessons.length - 1] ?? null;

  return { completedIds, totalLessons, progress, nextLessonId: nextLesson?.id ?? null, allLessons };
}
