import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === "video.asset.ready") {
    const assetId    = body.data?.id as string | undefined;
    const playbackId = (body.data?.playback_ids as { id: string }[] | undefined)?.[0]?.id;

    if (assetId && playbackId) {
      await db.lesson.updateMany({
        where: { muxAssetId: assetId },
        data:  { muxPlaybackId: playbackId },
      });
      await inngest.send({ name: "mux/video.ready", data: { assetId, playbackId } });
    }
  }

  return NextResponse.json({ received: true });
}
