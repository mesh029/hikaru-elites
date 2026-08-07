import { NextResponse } from "next/server";

import { getPrintPhoto, printPhotos } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const photo = getPrintPhoto(id);

  if (!printPhotos.some((item) => item.id === photo.id)) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const upstream = await fetch(photo.src, {
    headers: { Accept: "image/*" },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Could not fetch image from Sirv" },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const filename = `hikaru-${photo.id}-${photo.file}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
