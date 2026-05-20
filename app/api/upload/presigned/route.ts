import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createMuxUploadUrl } from "@/lib/mux";
import { createPresignedUploadUrl } from "@/lib/s3";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mov", "video/quicktime"];
const ALLOWED_PDF_TYPES   = ["application/pdf"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].includes((session.user as { role?: string }).role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { fileType, fileName, contentType, courseId } = await req.json();

  if (fileType === "video") {
    if (!ALLOWED_VIDEO_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Invalid video type" }, { status: 400 });
    }
    const { uploadId, url } = await createMuxUploadUrl();
    return NextResponse.json({ uploadUrl: url, uploadId, type: "mux" });
  }

  if (fileType === "pdf") {
    if (!ALLOWED_PDF_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    const key = `courses/${courseId}/pdfs/${Date.now()}-${fileName}`;
    const uploadUrl = await createPresignedUploadUrl(key, contentType);
    return NextResponse.json({ uploadUrl, key, type: "s3" });
  }

  if (fileType === "image") {
    if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }
    const key = `courses/${courseId}/thumbnails/${Date.now()}-${fileName}`;
    const uploadUrl = await createPresignedUploadUrl(key, contentType);
    return NextResponse.json({ uploadUrl, key, type: "s3" });
  }

  return NextResponse.json({ error: "Unknown fileType" }, { status: 400 });
}
