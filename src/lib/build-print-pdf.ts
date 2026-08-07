import { PDFDocument, PDFImage, rgb, StandardFonts } from "pdf-lib";
import sharp from "sharp";

import {
  getPrintCard,
  type PrintCardAudience,
  type PrintPhoto,
} from "@/lib/content";

/** A5 portrait in PDF points (148mm x 210mm) */
const PAGE_W = 419.53;
const PAGE_H = 595.28;
const MARGIN = 22;

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
      // fall through
    }
  }
  if (kind === "png") {
    try {
      return await pdf.embedPng(raw);
    } catch {
      // fall through
    }
  }

  try {
    const jpeg = await sharp(Buffer.from(raw))
      .rotate()
      .resize({
        width: 1600,
        height: 2200,
        fit: "inside",
        withoutEnlargement: true,
      })
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
  const pageAspect = PAGE_W / PAGE_H;
  let drawW: number;
  let drawH: number;

  if (imgAspect > pageAspect) {
    drawH = PAGE_H;
    drawW = drawH * imgAspect;
  } else {
    drawW = PAGE_W;
    drawH = drawW / imgAspect;
  }

  const [posXRaw, posYRaw] = objectPosition.split(/\s+/);
  const posX = Number.parseFloat(posXRaw) || 50;
  const posY = Number.parseFloat(posYRaw) || 50;
  const x = ((50 - posX) / 100) * (drawW - PAGE_W) - (drawW - PAGE_W) / 2;
  const y = ((posY - 50) / 100) * (drawH - PAGE_H) - (drawH - PAGE_H) / 2;

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
  const front = pdf.addPage([PAGE_W, PAGE_H]);
  front.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: PAGE_H,
    color: COLORS.bg,
  });
  drawCoverImage(front, photoImage, photo.objectPosition);

  for (let i = 0; i < 28; i++) {
    const t = i / 27;
    front.drawRectangle({
      x: 0,
      y: (i * PAGE_H * 0.56) / 28,
      width: PAGE_W,
      height: (PAGE_H * 0.56) / 28 + 1,
      color: COLORS.bg,
      opacity: 0.95 * (1 - t),
    });
  }

  front.drawText(safeText(card.frontMeta).toUpperCase(), {
    x: MARGIN,
    y: 28,
    size: 7,
    font,
    color: COLORS.accent,
  });
  front.drawText("hikaru-chess-elites.online", {
    x: MARGIN + 95,
    y: 28,
    size: 7,
    font,
    color: COLORS.accent,
  });

  const tagLines = wrapText(card.tagline, font, 9, PAGE_W - MARGIN * 2 - 12);
  let y = 46;
  for (let i = tagLines.length - 1; i >= 0; i--) {
    front.drawText(tagLines[i], {
      x: MARGIN,
      y,
      size: 9,
      font,
      color: COLORS.fg,
    });
    y += 12;
  }

  y += 8;
  front.drawText("CHESS ELITES", {
    x: MARGIN,
    y,
    size: 8,
    font,
    color: COLORS.muted,
  });

  y += 18;
  front.drawText("HIKARU", {
    x: MARGIN,
    y,
    size: 34,
    font: fontBold,
    color: COLORS.fg,
  });

  y += 30;
  front.drawText(safeText(card.eyebrow).toUpperCase(), {
    x: MARGIN,
    y,
    size: 7,
    font: fontBold,
    color: COLORS.secondary,
  });

  // —— BACK ——
  const back = pdf.addPage([PAGE_W, PAGE_H]);
  back.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: PAGE_H,
    color: COLORS.bg,
  });

  let by = PAGE_H - MARGIN - 8;
  back.drawText(safeText(card.backEyebrow).toUpperCase(), {
    x: MARGIN,
    y: by,
    size: 7,
    font: fontBold,
    color: COLORS.muted,
  });

  by -= 20;
  for (const line of wrapText(card.backTitle, fontBold, 15, PAGE_W - MARGIN * 2)) {
    back.drawText(line, {
      x: MARGIN,
      y: by,
      size: 15,
      font: fontBold,
      color: COLORS.fg,
    });
    by -= 18;
  }

  by -= 4;
  for (const line of wrapText(card.backLede, font, 8, PAGE_W - MARGIN * 2)) {
    back.drawText(line, {
      x: MARGIN,
      y: by,
      size: 8,
      font,
      color: COLORS.muted,
    });
    by -= 11;
  }

  by -= 10;
  back.drawRectangle({
    x: MARGIN,
    y: by,
    width: PAGE_W - MARGIN * 2,
    height: 1,
    color: COLORS.border,
  });

  by -= 10;
  const pillarGap = 6;
  const pillarCount = card.pillars.length;
  const pillarW =
    (PAGE_W - MARGIN * 2 - pillarGap * (pillarCount - 1)) / pillarCount;
  const pillarH = 118;
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
      borderWidth: pillar.focus ? 1.5 : 0.75,
    });

    let py = pillarBottom + pillarH - 14;
    back.drawText(safeText(pillar.label).toUpperCase(), {
      x: px + 6,
      y: py,
      size: 6,
      font: fontBold,
      color: COLORS.secondary,
    });
    py -= 13;
    back.drawText(safeText(pillar.title), {
      x: px + 6,
      y: py,
      size: 9,
      font: fontBold,
      color: COLORS.fg,
    });
    py -= 11;
    back.drawText(safeText(pillar.line), {
      x: px + 6,
      y: py,
      size: 6.5,
      font,
      color: COLORS.secondary,
    });
    py -= 10;
    for (const line of wrapText(pillar.body, font, 6.5, pillarW - 12).slice(
      0,
      7
    )) {
      back.drawText(line, {
        x: px + 6,
        y: py,
        size: 6.5,
        font,
        color: COLORS.muted,
      });
      py -= 8.5;
    }
  });

  by = pillarBottom - 14;
  for (const benefit of card.benefits.slice(0, 5)) {
    back.drawText("-", {
      x: MARGIN,
      y: by,
      size: 8,
      font: fontBold,
      color: COLORS.primary,
    });
    for (const line of wrapText(
      benefit.toUpperCase(),
      font,
      6.5,
      PAGE_W - MARGIN * 2 - 70
    )) {
      back.drawText(line, {
        x: MARGIN + 10,
        y: by,
        size: 6.5,
        font,
        color: COLORS.muted,
      });
      by -= 9;
    }
    by -= 2;
  }

  by -= 8;
  back.drawRectangle({
    x: MARGIN,
    y: by,
    width: PAGE_W - MARGIN * 2 - 70,
    height: 1,
    color: COLORS.border,
  });

  by -= 14;
  back.drawText("NEXT STEP", {
    x: MARGIN,
    y: by,
    size: 7,
    font: fontBold,
    color: COLORS.primary,
  });
  by -= 13;
  back.drawText(safeText(card.ctaTitle), {
    x: MARGIN,
    y: by,
    size: 10,
    font: fontBold,
    color: COLORS.fg,
  });
  by -= 12;
  back.drawText("hikaru-chess-elites.online", {
    x: MARGIN,
    y: by,
    size: 7.5,
    font,
    color: COLORS.accent,
  });
  by -= 10;
  back.drawText("info@hikaru-chess-elites.online", {
    x: MARGIN,
    y: by,
    size: 7.5,
    font,
    color: COLORS.muted,
  });

  if (qrImage) {
    const qrSize = 48;
    back.drawRectangle({
      x: PAGE_W - MARGIN - qrSize - 4,
      y: MARGIN + 14,
      width: qrSize + 4,
      height: qrSize + 4,
      color: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 0.75,
    });
    back.drawImage(qrImage, {
      x: PAGE_W - MARGIN - qrSize - 2,
      y: MARGIN + 16,
      width: qrSize,
      height: qrSize,
    });
  }

  back.drawText("HIKARU CHESS ELITES - WE TRAIN MINDS. IN SCHOOLS. AT THE BOARD.", {
    x: MARGIN,
    y: MARGIN,
    size: 5.5,
    font,
    color: COLORS.border,
  });

  return pdf.save();
}
