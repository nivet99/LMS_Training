import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import {
  MOCK_WEBBOARD_POSTS,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  type WebboardPost,
  type WebboardCategory,
} from "@/mock/webboard";

export const revalidate = 0;
export const metadata: Metadata = { title: "Webboard — Plearn" };

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff} วินาทีที่แล้ว`;
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(diff / 86400)} วันที่แล้ว`;
}

const CATEGORY_TABS: { value: string; label: string }[] = [
  { value: "ALL",      label: "ทั้งหมด" },
  { value: "GENERAL",  label: "ทั่วไป" },
  { value: "QA",       label: "ถาม-ตอบ" },
  { value: "SHOWCASE", label: "แสดงผลงาน" },
  { value: "FEEDBACK", label: "ข้อเสนอแนะ" },
];

export default function WebboardPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session  = getSession();
  const activeCategory = searchParams.category ?? "ALL";

  // Merge mock + cookie posts
  let cookiePosts: WebboardPost[] = [];
  try { cookiePosts = JSON.parse(cookies().get("webboard_posts")?.value ?? "[]"); } catch {}
  const allPosts = [...cookiePosts, ...MOCK_WEBBOARD_POSTS];

  const pinned  = allPosts.filter((p) => p.pinned);
  const regular = allPosts.filter((p) => !p.pinned);

  const filtered = activeCategory === "ALL"
    ? regular
    : regular.filter((p) => p.category === activeCategory);

  const totalPosts  = allPosts.length;
  const totalUsers  = new Set(allPosts.map((p) => p.authorId)).size;
  const totalReplies = allPosts.reduce((s, p) => s + p.replyCount, 0);

  return (
    <div className="plearn-container py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>ชุมชน PLEARN</p>
          <h1 className="text-display-m" style={{ color: "var(--ink)" }}>Webboard</h1>
          <p className="text-body mt-1" style={{ color: "var(--ink-3)" }}>
            พูดคุย ถามตอบ และแบ่งปันความรู้กับเพื่อนผู้เรียน
          </p>
        </div>
        {session ? (
          <Link href="/webboard/new" className="plearn-btn plearn-btn-primary shrink-0">
            + ตั้งกระทู้ใหม่
          </Link>
        ) : (
          <Link href="/login?callbackUrl=/webboard/new" className="plearn-btn plearn-btn-primary shrink-0">
            เข้าสู่ระบบเพื่อโพสต์
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "กระทู้ทั้งหมด", value: totalPosts },
          { label: "ผู้ร่วมสนทนา",  value: totalUsers },
          { label: "ความคิดเห็น",    value: totalReplies },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 text-center"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <p className="font-serif font-medium text-2xl" style={{ color: "var(--ink)" }}>
              {s.value}
            </p>
            <p className="text-caption mt-0.5" style={{ color: "var(--ink-3)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pinned posts */}
      {pinned.length > 0 && (
        <div className="mb-6">
          {pinned.map((post) => (
            <PostCard key={post.id} post={post} pinned />
          ))}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORY_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "ALL" ? "/webboard" : `/webboard?category=${tab.value}`}
            className="px-4 py-1.5 rounded-full text-body-s font-medium transition-colors"
            style={{
              background: activeCategory === tab.value ? "var(--ink)" : "var(--cream-2)",
              color:      activeCategory === tab.value ? "var(--paper)" : "var(--ink-3)",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border p-16 text-center"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
          <p className="text-h3 mb-2" style={{ color: "var(--ink)" }}>ยังไม่มีกระทู้</p>
          <p className="text-body-s mb-4" style={{ color: "var(--ink-3)" }}>
            เป็นคนแรกที่เริ่มบทสนทนาในหมวดนี้
          </p>
          <Link href="/webboard/new" className="plearn-btn plearn-btn-primary">
            ตั้งกระทู้ใหม่
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, pinned = false }: { post: WebboardPost; pinned?: boolean }) {
  const cc = CATEGORY_COLOR[post.category];
  return (
    <Link
      href={`/webboard/${post.id}`}
      className="flex items-start gap-4 rounded-xl border px-5 py-4 transition-colors hover:bg-[var(--cream-2)] group"
      style={{ background: "var(--paper)", borderColor: pinned ? "var(--vermilion)" : "var(--line)" }}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium shrink-0 mt-0.5"
        style={{ background: "var(--vermilion)", color: "white" }}>
        {post.authorName.charAt(0)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {pinned && (
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
        <p className="text-body font-medium truncate group-hover:text-[var(--vermilion)] transition-colors"
          style={{ color: "var(--ink)" }}>
          {post.title}
        </p>
        <p className="text-caption mt-0.5" style={{ color: "var(--ink-3)" }}>
          โดย {post.authorName} · {new Date(post.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>

      {/* Reply count */}
      <div className="flex items-center gap-1.5 shrink-0 mt-1"
        style={{ color: "var(--ink-4)" }}>
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-caption font-mono">{post.replyCount}</span>
      </div>
    </Link>
  );
}
