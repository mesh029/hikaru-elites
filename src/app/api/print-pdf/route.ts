import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextResponse } from "next/server";

import {
  printCards,
  resolvePrintPhoto,
  type PrintCardAudience,
} from "@/lib/content";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean) as string[];

async function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // try next
    }
  }
  return null;
}

function runChromePdf(chromePath: string, pageUrl: string, outPath: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      chromePath,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--virtual-time-budget=25000",
        `--print-to-pdf=${outPath}`,
        pageUrl,
      ],
      { stdio: ["ignore", "ignore", "pipe"] }
    );

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `Chrome exited with code ${code}`));
    });
  });
}

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

  const params = new URLSearchParams({ audience });
  if (photo.id === "custom") params.set("img", photo.src);
  else params.set("photo", photo.id);

  const origin = requestUrl.origin;
  const pageUrl = `${origin}/api/print-card?${params.toString()}`;

  const chromePath = await findChrome();
  if (!chromePath) {
    // No headless browser available — open printable sheet instead.
    return NextResponse.redirect(`${pageUrl}&print=1`, 302);
  }

  const dir = await mkdtemp(join(tmpdir(), "hikaru-pdf-"));
  const outPath = join(dir, `hikaru-a3-${audience}.pdf`);

  try {
    await runChromePdf(chromePath, pageUrl, outPath);
    const pdf = await readFile(outPath);
    const slug =
      photo.id === "custom" ? "custom" : photo.id.replace(/[^a-z0-9-]/gi, "");
    const filename = `hikaru-a3-${audience}-${slug}.pdf`;

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.redirect(`${pageUrl}&print=1`, 302);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}
