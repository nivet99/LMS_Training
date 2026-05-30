import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { MOCK_COURSES, MOCK_CHAPTERS, MOCK_LESSONS, MOCK_PROGRESS } from "@/mock";
import { LessonPlayer } from "@/components/player/LessonPlayer";
import { getSession } from "@/lib/session";
import { isEnrolledIn, getCourseProgress } from "@/lib/enrollment";

interface Props {
  params: { courseId: string; lessonId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = MOCK_LESSONS.find((l) => l.id === params.lessonId);
  const course = MOCK_COURSES.find((c) => c.id === params.courseId);
  return { title: lesson ? `${lesson.title} — ${course?.title ?? "คอร์ส"}` : "บทเรียน" };
}

export default function LessonPage({ params }: Props) {
  const { courseId, lessonId } = params;

  const course = MOCK_COURSES.find((c) => c.id === courseId);
  if (!course) notFound();

  const chapters   = MOCK_CHAPTERS[courseId] ?? [];
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  const currentLesson = allLessons.find((l) => l.id === lessonId);
  if (!currentLesson) notFound();

  // ── Enrollment gate ──────────────────────────────────────────────────────
  const session = getSession();
  if (!session) redirect(`/login?callbackUrl=/my-courses/${courseId}/learn/${lessonId}`);

  const enrolled = isEnrolledIn(session.id, courseId);

  // Free preview lessons are accessible without enrollment
  if (!enrolled && !currentLesson.isFree) {
    redirect(`/courses/${course.slug}`);
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Merge MOCK_PROGRESS + cookie completions
  const { completedIds } = getCourseProgress(courseId);
  const completedLessonIds = Array.from(completedIds);

  // Merge instructor-saved YouTube URL / content override via cookie
  const lessonContentRaw = cookies().get(`lesson_content_${lessonId}`)?.value;
  const lessonOverride = lessonContentRaw ? JSON.parse(lessonContentRaw) : {};
  const enrichedLesson = { ...currentLesson, ...lessonOverride };

  return (
    <LessonPlayer
      courseId={courseId}
      courseTitle={course.title}
      currentLesson={enrichedLesson}
      chapters={chapters}
      completedLessonIds={completedLessonIds}
      userId={session.id}
    />
  );
}
