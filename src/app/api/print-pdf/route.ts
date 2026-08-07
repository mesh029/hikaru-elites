import { NextResponse } from "next/server";

import { buildPrintCardPdf } from "@/lib/build-print-pdf";
import {
  printCards,
  resolvePrintPhoto,
  type PrintCardAudience,
} from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const audienceParam = requestUrl.searchParams.get("audience") ?? "parents";
  const audience = printCards.some((card) => card.id === audienceParam)
    ? (audienceParam as PrintCardAudience)
    : "parents";

  const photo = resolvePrintPhoto({
    photo: requestUrl.searchParams.get("photo"),
    img: requestUrl.searchParams.get("img"),
  });

  const origin = requestUrl.origin;
  const slug =
    photo.id === "custom" ? "custom" : photo.id.replace(/[^a-z0-9-]/gi, "");
  const filename = `hikaru-a3-${audience}-${slug}.pdf`;

  try {
    const bytes = await buildPrintCardPdf({ audience, photo, origin });
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not generate card PDF",
      },
      { status: 500 }
    );
  }
}
