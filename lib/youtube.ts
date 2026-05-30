// YouTube URL utilities

const YT_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
];

/** Extract 11-char video ID from any YouTube URL format */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  for (const pattern of YT_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/** Validate that a string is a usable YouTube URL */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/** Return the embed URL for a YouTube video ID */
export function toEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

/** Return the thumbnail URL for a YouTube video ID */
export function toThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
