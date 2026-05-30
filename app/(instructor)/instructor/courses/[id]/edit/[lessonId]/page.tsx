import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { MOCK_COURSES, MOCK_CHAPTERS } from "@/mock";
import { LessonEditor } from "@/components/instructor/LessonEditor";
import type { MockLesson } from "@/mock";

interface Props { params: { id: string; lessonId: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chapters = MOCK_CHAPTERS[params.id] ?? [];
  const lesson = chapters.flatMap((ch) => ch.lessons).find((l) => l.id === params.lessonId);
  return { title: lesson ? `แก้ไข: ${lesson.title}` : "แก้ไขบทเรียน" };
}

export default function LessonEditPage({ params }: Props) {
  const course = MOCK_COURSES.find((c) => c.id === params.id);
  if (!course) notFound();

  const chapters = MOCK_CHAPTERS[params.id] ?? [];
  const lesson = chapters.flatMap((ch) => ch.lessons).find((l) => l.id === params.lessonId);
  if (!lesson) notFound();

  // อ่าน YouTube URL ที่บันทึกไว้ผ่าน saveLessonContent
  const saved = cookies().get(`lesson_content_${params.lessonId}`)?.value;
  const savedContent: Partial<MockLesson> = saved ? JSON.parse(saved) : {};

  const mergedLesson: MockLesson = {
    ...lesson,
    ...savedContent,
  };

  return (
    <LessonEditor
      lesson={mergedLesson}
      courseId={params.id}
      courseTitle={course.title}
    />
  );
}
