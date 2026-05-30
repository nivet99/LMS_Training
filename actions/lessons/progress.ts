"use server";

import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export type ProgressState = { success?: boolean; error?: string };

export async function markLessonComplete(
  lessonId: string,
  courseId: string
): Promise<ProgressState> {
  const session = getSession();
  if (!session) return { error: "กรุณาเข้าสู่ระบบก่อน" };

  // TODO: เมื่อ DATABASE_URL พร้อม:
  // await db.lessonProgress.upsert({
  //   where: { userId_lessonId: { userId: session.id, lessonId } },
  //   create: { userId: session.id, lessonId, courseId, completedAt: new Date() },
  //   update: { completedAt: new Date() },
  // })
  // ตรวจสอบ course completion + trigger XP reward

  // Prototype: บันทึกลง cookie จนกว่า DB จะพร้อม
  const key = `progress_${courseId}`;
  const existing = cookies().get(key)?.value ?? "[]";
  const completed: string[] = JSON.parse(existing);
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    cookies().set(key, JSON.stringify(completed), {
      httpOnly: false,
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 30,
      path:     "/",
    });
  }

  return { success: true };
}

export async function saveWatchPosition(
  lessonId: string,
  position: number
): Promise<void> {
  const session = getSession();
  if (!session) return;

  // TODO: เมื่อ DATABASE_URL พร้อม:
  // await db.lessonProgress.upsert({
  //   where: { userId_lessonId: { userId: session.id, lessonId } },
  //   create: { userId: session.id, lessonId, courseId: "", watchPosition: position },
  //   update: { watchPosition: position },
  // })
}
