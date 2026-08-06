"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import {
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/content";
import { cn } from "@/lib/utils";

const filters: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kids", label: "Kids" },
  { id: "schools", label: "Schools" },
  { id: "coaching", label: "Coaching" },
  { id: "events", label: "Events" },
];

const pinAspect: Record<GalleryItem["pin"], string> = {
  short: "aspect-[4/3]",
  medium: "aspect-[3/4]",
  tall: "aspect-[2/3]",
};

type GalleryCinemaProps = {
  preview?: boolean;
};

export function GalleryCinema({ preview = false }: GalleryCinemaProps) {
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const items = galleryItems.filter(
    (item) => filter === "all" || item.category === filter
  );
  const shown = preview ? items.slice(0, 12) : items;

  const openAt = useCallback((item: GalleryItem) => setActive(item), []);

  const move = useCallback(
    (dir: -1 | 1) => {
      if (!active) return;
      const list = preview ? shown : items;
      const idx = list.findIndex((i) => i.id === active.id);
      if (idx < 0) return;
      const next = list[(idx + dir + list.length) % list.length];
      setActive(next);
    },
    [active, items, preview, shown]
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, move]);

  return (
    <section id="gallery" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
              Proof
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
              Sessions. Boards. Real energy.
            </h2>
          </div>
          {preview ? (
            <Button render={<Link href="/gallery" />} variant="outline">
              Full gallery
            </Button>
          ) : null}
        </Reveal>

        {!preview ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "border px-3 py-1.5 font-mono text-xs tracking-[0.2em] uppercase transition-colors",
                  filter === f.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Pinterest-style masonry */}
        <div className="mt-10 columns-2 gap-4 sm:columns-3 sm:gap-5 lg:columns-4 lg:gap-6">
          {shown.map((item, index) => (
            <Reveal
              key={item.id}
              delay={(index % 6) * 0.04}
              className="mb-4 break-inside-avoid sm:mb-5 lg:mb-6"
            >
              <button
                type="button"
                onClick={() => openAt(item)}
                className="pin-soft group relative w-full text-left outline-none"
              >
                <div
                  className={cn(
                    "pin-soft-image relative w-full",
                    pinAspect[item.pin]
                  )}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 4}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-background/90 via-background/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 rounded-b-[inherit] p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:p-4">
                  <p className="text-sm font-medium sm:text-base">
                    {item.caption}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                    {item.category}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 text-muted-foreground">
            No photos in this filter yet.{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Inquire anyway →
            </Link>
          </p>
        ) : null}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 inline-flex size-10 items-center justify-center border border-border bg-card"
              onClick={() => setActive(null)}
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-3 inline-flex size-10 items-center justify-center border border-border bg-card sm:left-6"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="absolute right-3 inline-flex size-10 items-center justify-center border border-border bg-card sm:right-6"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
            >
              <ChevronRight className="size-5" />
            </button>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-border/40 shadow-[0_20px_60px_hsl(0_0%_0%/0.45)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-5">
                <p className="text-lg">{active.caption}</p>
                <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
                  {active.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
