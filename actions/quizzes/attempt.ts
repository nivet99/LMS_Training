"use server";

import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export type QuizAttemptInput = {
  quizId:    string;
  score:     number;
  passed:    boolean;
  timeTaken: number;
};

export type QuizAttemptState = { success?: boolean; attemptId?: string; error?: string };

export async function submitQuizAttempt(
  input: QuizAttemptInput
): Promise<QuizAttemptState> {
  const session = getSession();
  if (!session) return { error: "กรุณาเข้าสู่ระบบก่อน" };

  // TODO: เมื่อ DATABASE_URL พร้อม:
  // const attempt = await db.quizAttempt.create({
  //   data: {
  //     quizId:      input.quizId,
  //     userId:      session.id,
  //     score:       input.score,
  //     passed:      input.passed,
  //     submittedAt: new Date(),
  //   },
  // })
  // if (input.passed) {
  //   await db.xPTransaction.create({ data: { userId: session.id, amount: 50, reason: "QUIZ_PASS", referenceId: input.quizId } })
  // }
  // return { success: true, attemptId: attempt.id }

  // Prototype: บันทึกลง cookie
  const key = `quiz_attempts_${session.id}`;
  const existing = cookies().get(key)?.value ?? "[]";
  const attempts: QuizAttemptInput[] = JSON.parse(existing);
  const attemptId = `attempt_${Date.now()}`;
  attempts.push(input);
  cookies().set(key, JSON.stringify(attempts.slice(-20)), {
    httpOnly: false,
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 30,
    path:     "/",
  });

  return { success: true, attemptId };
}
