import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(5, "ชื่อคอร์สต้องมีอย่างน้อย 5 ตัวอักษร").max(120),
  categoryId: z.string().cuid().optional(),
});

export const UpdateCourseSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(5).max(120).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]).optional(),
  language: z.string().optional(),
  categoryId: z.string().cuid().nullable().optional(),
  thumbnail: z.string().url().nullable().optional(),
  publishAt: z.date().nullable().optional(),
});

export const CreateChapterSchema = z.object({
  courseId: z.string().cuid(),
  title: z.string().min(2).max(200),
});

export const CreateLessonSchema = z.object({
  chapterId: z.string().cuid(),
  courseId: z.string().cuid(),
  title: z.string().min(2).max(200),
  type: z.enum(["VIDEO", "PDF", "TEXT", "QUIZ", "SCORM", "EMBED"]),
});

export const ReorderLessonsSchema = z.object({
  chapterId: z.string().cuid(),
  orderedIds: z.array(z.string().cuid()),
});

export type CreateCourseInput  = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput  = z.infer<typeof UpdateCourseSchema>;
export type CreateChapterInput = z.infer<typeof CreateChapterSchema>;
export type CreateLessonInput  = z.infer<typeof CreateLessonSchema>;
export type ReorderLessonsInput = z.infer<typeof ReorderLessonsSchema>;
