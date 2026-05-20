import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MOCK_COURSES, MOCK_CHAPTERS, MOCK_LESSONS, MOCK_PROGRESS } from "@/mock";
import { LessonPlayer } from "@/components/player/LessonPlayer";

interface Props {
  params: { courseId: string; lessonId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = MOCK_LESSONS.find((l) => l.id === params.lessonId);
  const course = MOCK_COURSES.find((c) => c.id === params.courseId);
  return {
    title: lesson ? `${lesson.title} — ${course?.title ?? "คอร์ส"}` : "บทเรียน",
  };
}

export default function LessonPage({ params }: Props) {
  const { courseId, lessonId } = params;

  const course = MOCK_COURSES.find((c) => c.id === courseId);
  if (!course) notFound();

  const chapters = MOCK_CHAPTERS[courseId] ?? [];
  const allLessons = chapters.flatMap((ch) => ch.lessons);
  const currentLesson = allLessons.find((l) => l.id === lessonId);
  if (!currentLesson) notFound();

  // Which lessons are already completed (mock)
  const completedLessonIds = allLessons
    .filter((l) => MOCK_PROGRESS[l.id]?.completedAt)
    .map((l) => l.id);

  return (
    <LessonPlayer
      courseId={courseId}
      courseTitle={course.title}
      currentLesson={currentLesson}
      chapters={chapters}
      completedLessonIds={completedLessonIds}
    />
  );
}
