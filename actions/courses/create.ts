"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export type CreateCourseState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createCourse(
  _prev: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const session = getSession();
  if (!session) redirect("/login");
  if (!["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].includes(session.role)) {
    return { error: "ไม่มีสิทธิ์สร้างคอร์ส" };
  }

  const title       = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const categoryId  = formData.get("categoryId") as string;
  const level       = formData.get("level") as string;
  const priceStr    = formData.get("price") as string;
  const language    = (formData.get("language") as string) || "th";

  const fieldErrors: Record<string, string> = {};
  if (!title || title.length < 5)          fieldErrors.title = "ชื่อคอร์สต้องมีอย่างน้อย 5 ตัวอักษร";
  if (!description || description.length < 20) fieldErrors.description = "คำอธิบายต้องมีอย่างน้อย 20 ตัวอักษร";
  if (!categoryId)                          fieldErrors.categoryId = "กรุณาเลือกหมวดหมู่";
  if (!level)                               fieldErrors.level = "กรุณาเลือกระดับ";

  const price = priceStr !== "" ? Number(priceStr) : 0;
  if (isNaN(price) || price < 0)           fieldErrors.price = "ราคาต้องเป็นตัวเลขที่ >= 0";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  // TODO Phase 2: db.course.create({ data: { title, description, categoryId, level, price, language, instructorId: session.id, status: "DRAFT" } })

  // Prototype: just redirect back with success param
  redirect("/instructor/courses?created=1");
}
