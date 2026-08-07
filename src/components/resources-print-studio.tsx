"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, ExternalLink, ImageDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_PRINT_PHOTO_ID,
  getPrintPhoto,
  printCards,
  printPhotos,
} from "@/lib/content";
import { cn } from "@/lib/utils";

export function ResourcesPrintStudio() {
  const [photoId, setPhotoId] = useState<string>(DEFAULT_PRINT_PHOTO_ID);
  const photo = useMemo(() => getPrintPhoto(photoId), [photoId]);

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
            Pick a Sirv field photo, then download parents, schools, or events
            A3 cards. Photos load from the CDN online — save a PDF from the
            print view, or download the source image.
          </p>
        </div>
      </section>

      <section className="border-b border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
                Choose photo
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-wide">
                {photo.label}
              </h2>
            </div>
            <Button
              render={<a href={`/api/download-image?id=${photo.id}`} />}
              variant="outline"
            >
              <ImageDown className="size-4" />
              Download selected photo
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {printPhotos.map((item) => {
              const selected = item.id === photo.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPhotoId(item.id)}
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
        <div className="grid gap-6 lg:grid-cols-3">
          {printCards.map((card) => {
            const previewHref = `/print/card/${card.id}?photo=${photo.id}`;
            const printHref = `${previewHref}&print=1`;
            return (
              <article
                key={card.id}
                className="flex flex-col overflow-hidden border border-border bg-card/30"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={photo.thumb}
                    alt={`${card.title} card with ${photo.label}`}
                    fill
                    className="object-cover"
                    style={{ objectPosition: photo.objectPosition }}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-mono text-[10px] tracking-[0.3em] text-secondary uppercase">
                      A3 · Front + back
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
                    <Button
                      render={<a href={printHref} target="_blank" rel="noreferrer" />}
                      className="w-full"
                    >
                      <Download className="size-4" />
                      Download / Print PDF
                    </Button>
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
            Print tip
          </p>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            In the print dialog choose A3, margins none, background graphics on.
            Use short-edge flip for double-sided. Photos are served from Sirv
            so the live site always uses the CDN originals.
          </p>
          <Button render={<Link href="/contact" />} className="mt-6">
            Ask for print support
          </Button>
        </div>
      </section>
    </div>
  );
}
