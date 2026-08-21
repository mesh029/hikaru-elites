import { NextResponse } from "next/server";

import {
  printCards,
  resolvePrintPhoto,
  type PrintCardAudience,
} from "@/lib/content";
import { buildPrintCardHtml } from "@/lib/print-html";
import { resolvePrintTheme } from "@/lib/print-theme";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const audienceParam = searchParams.get("audience") ?? "parents";
  const audience = printCards.some((card) => card.id === audienceParam)
    ? (audienceParam as PrintCardAudience)
    : "parents";

  const photo = resolvePrintPhoto({
    photo: searchParams.get("photo"),
    img: searchParams.get("img"),
  });
  const theme = resolvePrintTheme(searchParams.get("theme"));

  const origin = new URL(request.url).origin;
  const autoprint = searchParams.get("print") === "1";

  const html = buildPrintCardHtml({
    audience,
    photo,
    origin,
    theme,
    autoprint,
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
