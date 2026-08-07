import { PDFDocument, PDFImage, rgb, StandardFonts } from "pdf-lib";
import sharp from "sharp";

import {
  getPrintCard,
  type PrintCardAudience,
  type PrintPhoto,
} from "@/lib/content";

/** A3 portrait in PDF points (1pt = 1/72") */
const A3_W = 841.89;
const A3_H = 1190.55;
const MARGIN = 42;

const COLORS = {
  bg: rgb(0.173, 0.173, 0.173),
  card: rgb(0.227, 0.227, 0.227),
  fg: rgb(0.91, 0.91, 0.91),
  muted: rgb(0.66, 0.66, 0.66),
  secondary: rgb(0.486, 0.702, 0.259),
  primary: rgb(0.886, 0.239, 0.18),
  accent: rgb(0.42, 0.639, 0.831),
  white: rgb(1, 1, 1),
  border: rgb(0.36, 0.36, 0.36),
};

/** Helvetica/WinAnsi-safe text */
function safeText(value: string) {
  return value
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("‘", "'")
    .replaceAll("’", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("·", "-")
    .replaceAll("…", "...")
    .replaceAll("\u00a0", " ");
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  size: number,
  maxWidth: number
) {
  const words = safeText(text).split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function sniffImageKind(bytes: Uint8Array, contentType: string, url: string) {
  const type = contentType.toLowerCase();
  const lowerUrl = url.toLowerCase();
  if (
    type.includes("jpeg") ||
    type.includes("jpg") ||
    lowerUrl.includes(".jpg") ||
    lowerUrl.includes(".jpeg") ||
    (bytes[0] === 0xff && bytes[1] === 0xd8)
  ) {
    return "jpeg" as const;
  }
  if (
    type.includes("png") ||
    lowerUrl.includes(".png") ||
    (bytes[0] === 0x89 && bytes[1] === 0x50)
  ) {
    return "png" as const;
  }
  return "other" as const;
}

async function embedRemoteImage(pdf: PDFDocument, url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: "image/jpeg,image/png,image/webp,image/*,*/*",
      "User-Agent":
        "HikaruChessElitesBot/1.0 (+https://hikaru-chess-elites.online)",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(
      `Could not fetch image (${res.status}). The host may block downloads - try a direct JPG/PNG link or a Sirv URL.`
    );
  }

  const raw = new Uint8Array(await res.arrayBuffer());
  if (raw.byteLength < 32) {
    throw new Error("Image download was empty or invalid.");
  }

  const contentType = res.headers.get("content-type") ?? "";
  const kind = sniffImageKind(raw, contentType, url);

  if (kind === "jpeg") {
    try {
      return await pdf.embedJpg(raw);
    } catch {
      // fall through to sharp conversion
    }
  }
  if (kind === "png") {
    try {
      return await pdf.embedPng(raw);
    } catch {
      // fall through to sharp conversion
    }
  }

  // WebP / AVIF / GIF / odd encodings → JPEG for pdf-lib
  try {
    const jpeg = await sharp(Buffer.from(raw))
      .rotate()
      .resize({ width: 2400, height: 3200, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();
    return pdf.embedJpg(jpeg);
  } catch (error) {
    throw new Error(
      `Unsupported image format for PDF (need JPG/PNG/WebP we can convert). ${
        error instanceof Error ? error.message : ""
      }`.trim()
    );
  }
}

function drawCoverImage(
  page: ReturnType<PDFDocument["addPage"]>,
  image: PDFImage,
  objectPosition: string
) {
  const imgAspect = image.width / image.height;
  const pageAspect = A3_W / A3_H;
  let drawW: number;
  let drawH: number;

  if (imgAspect > pageAspect) {
    drawH = A3_H;
    drawW = drawH * imgAspect;
  } else {
    drawW = A3_W;
    drawH = drawW / imgAspect;
  }

  const [posXRaw, posYRaw] = objectPosition.split(/\s+/);
  const posX = Number.parseFloat(posXRaw) || 50;
  const posY = Number.parseFloat(posYRaw) || 50;
  // CSS object-position % is from top-left; PDF y is from bottom-left.
  const x = ((50 - posX) / 100) * (drawW - A3_W) - (drawW - A3_W) / 2;
  const y = ((posY - 50) / 100) * (drawH - A3_H) - (drawH - A3_H) / 2;

  page.drawImage(image, { x, y, width: drawW, height: drawH });
}

export async function buildPrintCardPdf(options: {
  audience: PrintCardAudience;
  photo: PrintPhoto;
  origin: string;
}) {
  const { audience, photo, origin } = options;
  const card = getPrintCard(audience);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const photoImage = await embedRemoteImage(pdf, photo.src);
  let qrImage: Awaited<ReturnType<typeof embedRemoteImage>> | null = null;
  try {
    qrImage = await embedRemoteImage(pdf, `${origin}/print/assets/qr.png`);
  } catch {
    qrImage = null;
  }

  // —— FRONT ——
  const front = pdf.addPage([A3_W, A3_H]);
  front.drawRectangle({
    x: 0,
    y: 0,
    width: A3_W,
    height: A3_H,
    color: COLORS.bg,
  });
  drawCoverImage(front, photoImage, photo.objectPosition);

  for (let i = 0; i < 32; i++) {
    const t = i / 31;
    front.drawRectangle({
      x: 0,
      y: (i * A3_H * 0.58) / 32,
      width: A3_W,
      height: (A3_H * 0.58) / 32 + 1.5,
      color: COLORS.bg,
      opacity: 0.95 * (1 - t),
    });
  }

  // Text stack sits in the lower third (bottom-up layout)
  let y = 210;
  front.drawText(safeText(card.frontMeta).toUpperCase(), {
    x: MARGIN,
    y: 56,
    size: 10,
    font,
    color: COLORS.accent,
  });
  front.drawText("hikaru-chess-elites.online", {
    x: MARGIN + 160,
    y: 56,
    size: 10,
    font,
    color: COLORS.accent,
  });

  const tagLines = wrapText(card.tagline, font, 14, A3_W - MARGIN * 2 - 40);
  y = 90;
  for (let i = tagLines.length - 1; i >= 0; i--) {
    front.drawText(tagLines[i], {
      x: MARGIN,
      y,
      size: 14,
      font,
      color: COLORS.fg,
    });
    y += 18;
  }

  y += 14;
  front.drawText("CHESS ELITES", {
    x: MARGIN,
    y,
    size: 13,
    font,
    color: COLORS.muted,
  });

  y += 28;
  front.drawText("HIKARU", {
    x: MARGIN,
    y,
    size: 64,
    font: fontBold,
    color: COLORS.fg,
  });

  y += 56;
  front.drawText(safeText(card.eyebrow).toUpperCase(), {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.secondary,
  });

  // —— BACK ——
  const back = pdf.addPage([A3_W, A3_H]);
  back.drawRectangle({
    x: 0,
    y: 0,
    width: A3_W,
    height: A3_H,
    color: COLORS.bg,
  });

  let by = A3_H - MARGIN - 16;
  back.drawText(safeText(card.backEyebrow).toUpperCase(), {
    x: MARGIN,
    y: by,
    size: 11,
    font: fontBold,
    color: COLORS.muted,
  });

  by -= 38;
  for (const line of wrapText(card.backTitle, fontBold, 28, A3_W - MARGIN * 2)) {
    back.drawText(line, {
      x: MARGIN,
      y: by,
      size: 28,
      font: fontBold,
      color: COLORS.fg,
    });
    by -= 34;
  }

  by -= 6;
  for (const line of wrapText(card.backLede, font, 12, A3_W - MARGIN * 2)) {
    back.drawText(line, {
      x: MARGIN,
      y: by,
      size: 12,
      font,
      color: COLORS.muted,
    });
    by -= 17;
  }

  by -= 18;
  back.drawRectangle({
    x: MARGIN,
    y: by,
    width: A3_W - MARGIN * 2,
    height: 1,
    color: COLORS.border,
  });

  by -= 18;
  const pillarGap = 10;
  const pillarCount = card.pillars.length;
  const pillarW =
    (A3_W - MARGIN * 2 - pillarGap * (pillarCount - 1)) / pillarCount;
  const pillarH = 210;
  const pillarBottom = by - pillarH;

  card.pillars.forEach((pillar, index) => {
    const px = MARGIN + index * (pillarW + pillarGap);
    back.drawRectangle({
      x: px,
      y: pillarBottom,
      width: pillarW,
      height: pillarH,
      color: COLORS.card,
      borderColor: pillar.focus ? COLORS.primary : COLORS.border,
      borderWidth: pillar.focus ? 2.5 : 1,
    });

    let py = pillarBottom + pillarH - 26;
    back.drawText(safeText(pillar.label).toUpperCase(), {
      x: px + 12,
      y: py,
      size: 9,
      font: fontBold,
      color: COLORS.secondary,
    });
    py -= 24;
    back.drawText(safeText(pillar.title), {
      x: px + 12,
      y: py,
      size: 15,
      font: fontBold,
      color: COLORS.fg,
    });
    py -= 20;
    back.drawText(safeText(pillar.line), {
      x: px + 12,
      y: py,
      size: 10,
      font,
      color: COLORS.secondary,
    });
    py -= 18;
    for (const line of wrapText(pillar.body, font, 9.5, pillarW - 24).slice(
      0,
      9
    )) {
      back.drawText(line, {
        x: px + 12,
        y: py,
        size: 9.5,
        font,
        color: COLORS.muted,
      });
      py -= 13;
    }
  });

  by = pillarBottom - 26;
  for (const benefit of card.benefits) {
    back.drawText("-", {
      x: MARGIN,
      y: by,
      size: 11,
      font: fontBold,
      color: COLORS.primary,
    });
    for (const line of wrapText(
      benefit.toUpperCase(),
      font,
      9.5,
      A3_W - MARGIN * 2 - 24
    )) {
      back.drawText(line, {
        x: MARGIN + 14,
        y: by,
        size: 9.5,
        font,
        color: COLORS.muted,
      });
      by -= 14;
    }
    by -= 4;
  }

  by -= 12;
  back.drawRectangle({
    x: MARGIN,
    y: by,
    width: A3_W - MARGIN * 2,
    height: 1,
    color: COLORS.border,
  });

  by -= 26;
  back.drawText("NEXT STEP", {
    x: MARGIN,
    y: by,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });
  by -= 22;
  back.drawText(safeText(card.ctaTitle), {
    x: MARGIN,
    y: by,
    size: 15,
    font: fontBold,
    color: COLORS.fg,
  });
  by -= 20;
  back.drawText("hikaru-chess-elites.online", {
    x: MARGIN,
    y: by,
    size: 11,
    font,
    color: COLORS.accent,
  });
  by -= 16;
  back.drawText("info@hikaru-chess-elites.online", {
    x: MARGIN,
    y: by,
    size: 11,
    font,
    color: COLORS.muted,
  });

  if (qrImage) {
    const qrSize = 88;
    back.drawRectangle({
      x: A3_W - MARGIN - qrSize - 8,
      y: MARGIN + 22,
      width: qrSize + 8,
      height: qrSize + 8,
      color: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 1,
    });
    back.drawImage(qrImage, {
      x: A3_W - MARGIN - qrSize - 4,
      y: MARGIN + 26,
      width: qrSize,
      height: qrSize,
    });
  }

  back.drawText(
    "HIKARU CHESS ELITES - WE TRAIN MINDS. IN SCHOOLS. AT THE BOARD.",
    {
      x: MARGIN,
      y: MARGIN,
      size: 8,
      font,
      color: COLORS.border,
    }
  );

  return pdf.save();
}
