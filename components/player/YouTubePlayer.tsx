"use client";

import { extractYouTubeId, toEmbedUrl } from "@/lib/youtube";

interface YouTubePlayerProps {
  url: string;
  title?: string;
}

export function YouTubePlayer({ url, title }: YouTubePlayerProps) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <div
        className="w-full aspect-video flex items-center justify-center"
        style={{ background: "#111" }}
      >
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          YouTube URL ไม่ถูกต้อง
        </p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video">
      <iframe
        src={toEmbedUrl(videoId)}
        title={title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0"
        style={{ display: "block" }}
      />
    </div>
  );
}
