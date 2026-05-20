import Mux from "@mux/mux-node";

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function createMuxUploadUrl() {
  const upload = await mux.video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_APP_URL ?? "*",
    new_asset_settings: {
      playback_policy: ["signed"],
      encoding_tier: "smart",
    },
  });
  return { uploadId: upload.id, url: upload.url };
}

export async function deleteMuxAsset(assetId: string) {
  await mux.video.assets.delete(assetId);
}
