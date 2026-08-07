import { NextResponse } from "next/server";

import {
  getPrintPhoto,
  printPhotos,
  sanitizeImageUrl,
} from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customUrl = sanitizeImageUrl(searchParams.get("url"));
  const id = searchParams.get("id");

  const photo = customUrl
    ? {
        id: "custom",
        file: "custom.jpg",
        src: customUrl,
      }
    : getPrintPhoto(id);

  if (!customUrl && !printPhotos.some((item) => item.id === photo.id)) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const upstream = await fetch(photo.src, {
    headers: { Accept: "image/*" },
    next: { revalidate: customUrl ? 0 : 60 * 60 * 24 },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Could not fetch image" },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const filename =
    photo.id === "custom"
      ? "hikaru-custom-image.jpg"
      : `hikaru-${photo.id}-${"file" in photo ? photo.file : "image.jpg"}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": customUrl ? "no-store" : "public, max-age=86400",
    },
  });
}
