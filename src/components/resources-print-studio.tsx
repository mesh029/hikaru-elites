"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Link2, Moon, Sun } from "lucide-react";

import { DownloadCardPdfButton } from "@/components/download-card-pdf-button";
import { PrintCardMiniPreview } from "@/components/print-card-mini-preview";
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
  PRINT_THEME_CSS,
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

function ThemeSwitch({
  theme,
  onChange,
}: {
  theme: PrintTheme;
  onChange: (theme: PrintTheme) => void;
}) {
  return (
    <div
      className="inline-flex shrink-0 border border-border bg-background p-1"
      role="group"
      aria-label="Toggle card color"
    >
      <button
        type="button"
        onClick={() => onChange("dark")}
        aria-pressed={theme === "dark"}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
          theme === "dark"
            ? "bg-[#2c2c2c] text-[#e8e8e8]"
            : "text-muted-foreground hover:text-foreground"
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
          "inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
          theme === "light"
            ? "bg-[#f3f4f5] text-[#1a1c1e]"
            : "text-muted-foreground hover:text-foreground"
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

  const themeColors = PRINT_THEME_CSS[theme];

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
      {/* Sticky theme control — always visible, flips live previews */}
      <div
        className="sticky top-14 z-40 border-b transition-colors duration-300"
        style={{
          backgroundColor:
            theme === "light"
              ? "rgba(243,244,245,0.96)"
              : "rgba(26,26,26,0.96)",
          borderColor: themeColors.border,
          color: themeColors.fg,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p
              className="font-mono text-[10px] tracking-[0.28em] uppercase"
              style={{ color: themeColors.secondary }}
            >
              Card color
            </p>
            <p
              className="truncate text-sm"
              style={{ color: themeColors.muted }}
            >
              {theme === "light" ? "Light cards" : "Dark cards"} — previews
              flip instantly
            </p>
          </div>
          <ThemeSwitch theme={theme} onChange={setTheme} />
        </div>
      </div>

      <section className="border-b border-border px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Resources
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide sm:text-5xl">
            Print cards
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Toggle light or dark above, pick a photo, then download or preview
            an A5 front + back card.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                Live preview
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Watch the card recolor when you flip the toggle.
              </p>
              <div className="mt-4 max-w-xs">
                <PrintCardMiniPreview
                  audience="schools"
                  photo={photo}
                  theme={theme}
                  className="shadow-lg"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex-1 border px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                    theme === "dark"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Moon className="size-3.5" />
                    Dark
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex-1 border px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                    theme === "light"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Sun className="size-3.5" />
                    Light
                  </span>
                </button>
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                Photo
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-wide">
                {photo.label}
              </h2>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {printPhotos.map((item) => {
                  const selected = !customActive && item.id === photoId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectCatalogPhoto(item.id)}
                      className={cn(
                        "overflow-hidden border text-left transition-colors",
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
                          sizes="120px"
                        />
                      </div>
                      <p className="truncate border-t border-border px-1.5 py-1.5 font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase">
                        {item.label}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border border-border bg-card/20 p-3 sm:p-4">
                <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                  Or paste image URL
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
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
                      placeholder="https://…jpg"
                      className="h-10 w-full border border-border bg-background pr-3 pl-10 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <Button
                    type="button"
                    onClick={applyCustomUrl}
                    className="sm:w-auto"
                  >
                    Use URL
                  </Button>
                </div>
                {urlError ? (
                  <p className="mt-2 text-sm text-destructive">{urlError}</p>
                ) : customActive ? (
                  <p className="mt-2 font-mono text-xs tracking-wide text-secondary uppercase">
                    Custom URL active
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
              Download
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-wide">
              {theme === "light" ? "Light" : "Dark"} A5 cards
            </h2>
          </div>
          <ThemeSwitch theme={theme} onChange={setTheme} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {printCards.map((card) => {
            const query = buildCardQuery(card.id, photo, theme);
            const pdfHref = `/api/print-pdf?${query}`;
            const previewHref = `/api/print-card?${query}`;
            return (
              <article
                key={card.id}
                className="flex flex-col border border-border bg-card/20"
              >
                <PrintCardMiniPreview
                  audience={card.id}
                  photo={photo}
                  theme={theme}
                />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-wide">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm text-secondary">{card.line}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {card.body}
                    </p>
                  </div>
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
                    Preview {theme} card
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 border border-border bg-card/20 p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            PDFs are real A5 front + back files in the theme you selected.
            Need help with print runs?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
