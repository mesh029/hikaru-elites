"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Link2, Moon, Sun } from "lucide-react";

import { DownloadCardPdfButton } from "@/components/download-card-pdf-button";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_PRINT_PHOTO_ID,
  customPrintPhoto,
  getPrintPhoto,
  printCards,
  printPhotos,
  sanitizeImageUrl,
  type PrintPhoto,
} from "@/lib/content";
import {
  DEFAULT_PRINT_THEME,
  type PrintTheme,
} from "@/lib/print-theme";
import { cn } from "@/lib/utils";

function buildCardQuery(
  audience: string,
  photo: PrintPhoto,
  theme: PrintTheme
) {
  const params = new URLSearchParams({ audience, theme });
  if (photo.id === "custom") params.set("img", photo.src);
  else params.set("photo", photo.id);
  return params.toString();
}

function ThemeToggle({
  theme,
  onChange,
  size = "default",
}: {
  theme: PrintTheme;
  onChange: (theme: PrintTheme) => void;
  size?: "default" | "compact";
}) {
  return (
    <div
      className={cn(
        "inline-flex border border-border",
        size === "compact" ? "w-full" : ""
      )}
      role="group"
      aria-label="Card color"
    >
      <button
        type="button"
        onClick={() => onChange("dark")}
        aria-pressed={theme === "dark"}
        className={cn(
          "inline-flex flex-1 items-center justify-center gap-2 font-mono uppercase transition-colors",
          size === "compact"
            ? "px-3 py-2 text-[10px] tracking-[0.14em]"
            : "px-4 py-2.5 text-[11px] tracking-[0.16em]",
          theme === "dark"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="size-3.5" />
        Dark
      </button>
      <button
        type="button"
        onClick={() => onChange("light")}
        aria-pressed={theme === "light"}
        className={cn(
          "inline-flex flex-1 items-center justify-center gap-2 font-mono uppercase transition-colors",
          size === "compact"
            ? "px-3 py-2 text-[10px] tracking-[0.14em]"
            : "px-4 py-2.5 text-[11px] tracking-[0.16em]",
          theme === "light"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="size-3.5" />
        Light
      </button>
    </div>
  );
}

export function ResourcesPrintStudio() {
  const [photoId, setPhotoId] = useState<string>(DEFAULT_PRINT_PHOTO_ID);
  const [customUrl, setCustomUrl] = useState("");
  const [customActive, setCustomActive] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [theme, setTheme] = useState<PrintTheme>(DEFAULT_PRINT_THEME);

  const photo = useMemo<PrintPhoto>(() => {
    if (customActive) {
      const clean = sanitizeImageUrl(customUrl);
      if (clean) return customPrintPhoto(clean);
    }
    return getPrintPhoto(photoId);
  }, [customActive, customUrl, photoId]);

  function applyCustomUrl() {
    const clean = sanitizeImageUrl(customUrl);
    if (!clean) {
      setUrlError("Paste a full http(s) image URL.");
      setCustomActive(false);
      return;
    }
    setUrlError(null);
    setCustomActive(true);
  }

  function selectCatalogPhoto(id: string) {
    setPhotoId(id);
    setCustomActive(false);
    setUrlError(null);
  }

  return (
    <div className="pt-14">
      <div className="sticky top-14 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-secondary uppercase">
              Card color for downloads
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Selected: <span className="text-foreground">{theme}</span> mode —
              applies to every PDF below
            </p>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>
      </div>

      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Resources
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">
            Print cards
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Use the Dark / Light bar at the top, pick a photo, then download an
            A5 card PDF — the PDF is the designed card, not the raw photo.
          </p>

          <div
            id="print-theme"
            className="mt-10 max-w-xl border border-border bg-card/40 p-5 sm:p-6"
          >
            <p className="font-mono text-[11px] tracking-[0.28em] text-secondary uppercase">
              Step 1 · Card color
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-wide sm:text-2xl">
              Dark or light PDF?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Same control as the sticky bar — pick once for all downloads.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
                className={cn(
                  "flex flex-col gap-3 border p-4 text-left transition-colors",
                  theme === "dark"
                    ? "border-primary bg-primary/15"
                    : "border-border hover:border-primary/60"
                )}
              >
                <span
                  className="block h-14 w-full border border-border"
                  style={{
                    background:
                      "linear-gradient(135deg,#2c2c2c 55%,#1a1a1a 55%)",
                  }}
                  aria-hidden
                />
                <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
                  <Moon className="size-3.5" />
                  Dark
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
                className={cn(
                  "flex flex-col gap-3 border p-4 text-left transition-colors",
                  theme === "light"
                    ? "border-primary bg-primary/15"
                    : "border-border hover:border-primary/60"
                )}
              >
                <span
                  className="block h-14 w-full border border-border"
                  style={{
                    background:
                      "linear-gradient(135deg,#f3f4f5 55%,#dde1e5 55%)",
                  }}
                  aria-hidden
                />
                <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
                  <Sun className="size-3.5" />
                  Light
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
              Step 2 · Choose photo for the card
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-wide">
              {photo.label}
            </h2>
          </div>

          <div className="mt-8 border border-border bg-card/20 p-4 sm:p-5">
            <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
              Or paste image URL
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Image URL</span>
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  <Link2 className="size-4" />
                </span>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(event) => {
                    setCustomUrl(event.target.value);
                    if (customActive) setCustomActive(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      applyCustomUrl();
                    }
                  }}
                  placeholder="https://meshackariri.sirv.com/chess101/chess/IMG-....jpg"
                  className="h-11 w-full border border-border bg-background pr-3 pl-10 text-sm outline-none focus:border-primary"
                />
              </label>
              <Button type="button" onClick={applyCustomUrl} className="sm:w-auto">
                Use this URL
              </Button>
            </div>
            {urlError ? (
              <p className="mt-2 text-sm text-destructive">{urlError}</p>
            ) : customActive ? (
              <p className="mt-2 font-mono text-xs tracking-wide text-secondary uppercase">
                Custom URL active — card PDFs below use this image
              </p>
            ) : null}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {printPhotos.map((item) => {
              const selected = !customActive && item.id === photoId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCatalogPhoto(item.id)}
                  className={cn(
                    "group overflow-hidden border text-left transition-colors",
                    selected
                      ? "border-primary"
                      : "border-border hover:border-primary/60"
                  )}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={item.thumb}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <div className="border-t border-border px-2 py-2">
                    <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                      {item.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
              Step 3 · Download or preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-wide">
              Cards in {theme} mode
            </h2>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {printCards.map((card) => {
            const query = buildCardQuery(card.id, photo, theme);
            const pdfHref = `/api/print-pdf?${query}`;
            const previewHref = `/api/print-card?${query}`;
            return (
              <article
                key={card.id}
                className="flex flex-col overflow-hidden border border-border bg-card/30"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumb}
                    alt={`${card.title} card with ${photo.label}`}
                    className="absolute inset-0 size-full object-cover"
                    style={{ objectPosition: photo.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-mono text-[10px] tracking-[0.3em] text-secondary uppercase">
                      A5 card PDF · Front + back · {theme}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-wide">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-sm text-secondary">{card.line}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <p className="text-sm text-muted-foreground">{card.body}</p>
                  <ThemeToggle
                    theme={theme}
                    onChange={setTheme}
                    size="compact"
                  />
                  <DownloadCardPdfButton
                    href={pdfHref}
                    filenameHint={`hikaru-a5-${card.id}-${photo.id}-${theme}.pdf`}
                  />
                  <Button
                    render={
                      <a href={previewHref} target="_blank" rel="noreferrer" />
                    }
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="size-4" />
                    Preview card
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 border border-border bg-card/20 p-6 sm:p-8">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Note
          </p>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Download card PDF builds a real A5 front + back PDF with your chosen
            photo and theme. Preview opens the live layout if you want to check
            it first.
          </p>
          <Button render={<Link href="/contact" />} className="mt-6">
            Ask for print support
          </Button>
        </div>
      </section>
    </div>
  );
}
