"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { WebboardPost, WebboardCategory } from "@/mock/webboard";

export type CreatePostState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createPost(
  _prev: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const session = getSession();
  if (!session) redirect("/login?callbackUrl=/webboard/new");

  const title    = (formData.get("title") as string)?.trim();
  const content  = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as WebboardCategory) ?? "GENERAL";

  const fieldErrors: Record<string, string> = {};
  if (!title || title.length < 5)     fieldErrors.title   = "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร";
  if (!content || content.length < 10) fieldErrors.content = "เนื้อหาต้องมีอย่างน้อย 10 ตัวอักษร";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const id = `post_${Date.now()}`;
  const newPost: WebboardPost = {
    id,
    authorId:   session.id,
    authorName: session.name,
    category,
    title,
    content,
    createdAt:  new Date().toISOString(),
    replyCount: 0,
  };

  const key = "webboard_posts";
  let existing: WebboardPost[] = [];
  try { existing = JSON.parse(cookies().get(key)?.value ?? "[]"); } catch {}
  existing.unshift(newPost);

  cookies().set(key, JSON.stringify(existing.slice(0, 50)), {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });

  redirect(`/webboard/${id}`);
}
