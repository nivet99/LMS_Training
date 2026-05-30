"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { WebboardReply } from "@/mock/webboard";

export type CreateReplyState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createReply(
  postId: string,
  _prev: CreateReplyState,
  formData: FormData
): Promise<CreateReplyState> {
  const session = getSession();
  if (!session) redirect(`/login?callbackUrl=/webboard/${postId}`);

  const content = (formData.get("content") as string)?.trim();
  if (!content || content.length < 2) {
    return { fieldErrors: { content: "กรุณาพิมพ์ข้อความ" } };
  }

  const newReply: WebboardReply = {
    id:         `reply_${Date.now()}`,
    postId,
    authorId:   session.id,
    authorName: session.name,
    content,
    createdAt:  new Date().toISOString(),
  };

  // Save reply
  const replyKey = `webboard_replies_${postId}`;
  let replies: WebboardReply[] = [];
  try { replies = JSON.parse(cookies().get(replyKey)?.value ?? "[]"); } catch {}
  replies.push(newReply);
  cookies().set(replyKey, JSON.stringify(replies.slice(-100)), {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });

  // Increment reply count on user-created posts
  const postKey = "webboard_posts";
  let posts: { id: string; replyCount: number }[] = [];
  try { posts = JSON.parse(cookies().get(postKey)?.value ?? "[]"); } catch {}
  const postIdx = posts.findIndex((p) => p.id === postId);
  if (postIdx !== -1) {
    posts[postIdx].replyCount = (posts[postIdx].replyCount ?? 0) + 1;
    cookies().set(postKey, JSON.stringify(posts), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });
  }

  redirect(`/webboard/${postId}`);
}
