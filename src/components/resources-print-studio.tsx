"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Link2 } from "lucide-react";

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
import { cn } from "@/lib/utils";

function buildCardQuery(audience: string, photo: PrintPhoto) {
  const params = new URLSearchParams({ audience });
  if (photo.id === "custom") params.set("img", photo.src);
  else params.set("photo", photo.id);
  return params.toString();
}

export function ResourcesPrintStudio() {
  const [photoId, setPhotoId] = useState<string>(DEFAULT_PRINT_PHOTO_ID);
  const [customUrl, setCustomUrl] = useState("");
  const [customActive, setCustomActive] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

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
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Resources
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">
            Print cards
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Pick a photo (or paste an image URL), then download an A3 card PDF
            for parents, schools, or events — the PDF is the designed card, not
            the raw photo.
          </p>
        </div>
      </section>

      <section className="border-b border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
              Choose photo for the card
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {printCards.map((card) => {
            const query = buildCardQuery(card.id, photo);
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
                      A3 card PDF · Front + back
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-wide">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-sm text-secondary">{card.line}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm text-muted-foreground">{card.body}</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <DownloadCardPdfButton
                      href={pdfHref}
                      filenameHint={`hikaru-a3-${card.id}-${photo.id}.pdf`}
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
            Download card PDF builds a real A3 front + back PDF with your chosen
            photo. Preview opens the live layout if you want to check it first.
          </p>
          <Button render={<Link href="/contact" />} className="mt-6">
            Ask for print support
          </Button>
        </div>
      </section>
    </div>
  );
}
