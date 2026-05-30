import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import {
  MOCK_WEBBOARD_POSTS,
  MOCK_WEBBOARD_REPLIES,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  type WebboardPost,
  type WebboardReply,
} from "@/mock/webboard";
import { ReplyForm } from "@/components/webboard/ReplyForm";

export const revalidate = 0;

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = MOCK_WEBBOARD_POSTS.find((p) => p.id === params.id);
  return { title: post ? `${post.title} — Webboard Plearn` : "กระทู้" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ name, size = 9 }: { name: string; size?: number }) {
  const px = size * 4;
  return (
    <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-sm font-medium shrink-0`}
      style={{ background: "var(--vermilion)", color: "white", width: px, height: px, minWidth: px }}>
      {name.charAt(0)}
    </div>
  );
}

export default function ThreadPage({ params }: Props) {
  const session = getSession();

  // Find post (cookie-created or mock)
  let cookiePosts: WebboardPost[] = [];
  try { cookiePosts = JSON.parse(cookies().get("webboard_posts")?.value ?? "[]"); } catch {}
  const post = cookiePosts.find((p) => p.id === params.id)
    ?? MOCK_WEBBOARD_POSTS.find((p) => p.id === params.id);
  if (!post) notFound();

  // Gather replies
  let cookieReplies: WebboardReply[] = [];
  try { cookieReplies = JSON.parse(cookies().get(`webboard_replies_${params.id}`)?.value ?? "[]"); } catch {}
  const mockReplies = MOCK_WEBBOARD_REPLIES.filter((r) => r.postId === params.id);
  const allReplies  = [...mockReplies, ...cookieReplies];

  const cc = CATEGORY_COLOR[post.category];

  return (
    <div className="plearn-container py-10 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-caption mb-6" style={{ color: "var(--ink-3)" }}>
        <Link href="/webboard" className="hover:underline">Webboard</Link>
        <span>/</span>
        <span className="truncate" style={{ color: "var(--ink)" }}>{post.title}</span>
      </div>

      {/* Original post */}
      <article className="rounded-xl border mb-6" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        {/* Post header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center gap-2 mb-3">
            {post.pinned && (
              <span className="text-caption font-medium px-2 py-0.5 rounded-full"
                style={{ background: "var(--vermilion-soft)", color: "var(--vermilion)" }}>
                📌 ปักหมุด
              </span>
            )}
            <span className="text-caption font-medium px-2 py-0.5 rounded-full"
              style={{ background: cc.bg, color: cc.text }}>
              {CATEGORY_LABEL[post.category]}
            </span>
          </div>
          <h1 className="text-h2 mb-4" style={{ color: "var(--ink)" }}>{post.title}</h1>
          <div className="flex items-center gap-3">
            <Avatar name={post.authorName} />
            <div>
              <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>{post.authorName}</p>
              <p className="text-caption" style={{ color: "var(--ink-3)" }}>{formatDate(post.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="px-6 py-5">
          <div className="text-body leading-relaxed whitespace-pre-wrap" style={{ color: "var(--ink-3)" }}>
            {post.content}
          </div>
        </div>
      </article>

      {/* Replies */}
      {allReplies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-h3 mb-4" style={{ color: "var(--ink)" }}>
            ความคิดเห็น ({allReplies.length})
          </h2>
          <div className="space-y-3">
            {allReplies.map((reply, i) => (
              <div key={reply.id} className="flex gap-3">
                {/* Thread line */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <Avatar name={reply.authorName} size={8} />
                  {i < allReplies.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: "var(--line)", minHeight: "12px" }} />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-body-s font-medium" style={{ color: "var(--ink)" }}>
                      {reply.authorName}
                    </span>
                    <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <div className="text-body-s leading-relaxed whitespace-pre-wrap rounded-xl px-4 py-3 border"
                    style={{ background: "var(--paper)", borderColor: "var(--line)", color: "var(--ink-3)" }}>
                    {reply.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply form */}
      <div className="rounded-xl border p-5" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        {session ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={session.name} />
              <p className="text-body-s font-medium" style={{ color: "var(--ink)" }}>{session.name}</p>
            </div>
            <ReplyForm postId={params.id} />
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-body-s mb-3" style={{ color: "var(--ink-3)" }}>
              เข้าสู่ระบบเพื่อแสดงความคิดเห็น
            </p>
            <Link href={`/login?callbackUrl=/webboard/${params.id}`} className="plearn-btn plearn-btn-primary">
              เข้าสู่ระบบ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
