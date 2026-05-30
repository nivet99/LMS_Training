"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { UpdateLessonContentSchema } from "@/lib/validations/course";

export type LessonContentState = { error?: string; success?: boolean };

export async function saveLessonContent(
  _prev: LessonContentState,
  formData: FormData
): Promise<LessonContentState> {
  const session = getSession();
  if (!session) return { error: "กรุณาเข้าสู่ระบบก่อน" };
  if (!["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].includes(session.role)) {
    return { error: "ไม่มีสิทธิ์แก้ไขบทเรียน" };
  }

  const raw = {
    lessonId:   formData.get("lessonId")   as string,
    courseId:   formData.get("courseId")   as string,
    title:      formData.get("title")      as string,
    type:       formData.get("type")       as string,
    youtubeUrl: (formData.get("youtubeUrl") as string) || undefined,
    content:    (formData.get("content")    as string) || undefined,
    isFree:     formData.get("isFree") === "true",
    duration:   formData.get("duration") ? Number(formData.get("duration")) : undefined,
  };

  const parsed = UpdateLessonContentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // TODO: เมื่อ DATABASE_URL พร้อม:
  // await db.lesson.update({
  //   where: { id: parsed.data.lessonId },
  //   data: {
  //     title:      parsed.data.title,
  //     youtubeUrl: parsed.data.youtubeUrl ?? null,
  //     content:    parsed.data.content ?? null,
  //     isFree:     parsed.data.isFree,
  //     duration:   parsed.data.duration ?? null,
  //   },
  // })

  // Prototype: บันทึกลง cookie
  const key = `lesson_content_${parsed.data.lessonId}`;
  cookies().set(
    key,
    JSON.stringify({
      title:      parsed.data.title,
      youtubeUrl: parsed.data.youtubeUrl,
      content:    parsed.data.content,
      isFree:     parsed.data.isFree,
      duration:   parsed.data.duration,
    }),
    { httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" }
  );

  revalidatePath(`/my-courses/${parsed.data.courseId}/learn/${parsed.data.lessonId}`);
  revalidatePath(`/instructor/courses/${parsed.data.courseId}/edit/${parsed.data.lessonId}`);

  return { success: true };
}
