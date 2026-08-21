"use client";

import type { CSSProperties } from "react";

import type { PrintPhoto } from "@/lib/content";
import { getPrintCard, type PrintCardAudience } from "@/lib/content";
import { PRINT_THEME_CSS, type PrintTheme } from "@/lib/print-theme";
import { cn } from "@/lib/utils";

type PrintCardMiniPreviewProps = {
  audience: PrintCardAudience;
  photo: PrintPhoto;
  theme: PrintTheme;
  className?: string;
};

/** Live A5-front miniature that flips colors with print theme. */
export function PrintCardMiniPreview({
  audience,
  photo,
  theme,
  className,
}: PrintCardMiniPreviewProps) {
  const card = getPrintCard(audience);
  const colors = PRINT_THEME_CSS[theme];

  return (
    <div
      className={cn(
        "relative aspect-[148/210] w-full overflow-hidden border transition-colors duration-300",
        className
      )}
      style={
        {
          borderColor: colors.border,
          backgroundColor: colors.bg,
          color: colors.fg,
          ["--mini-veil" as string]: colors.veil,
          ["--mini-secondary" as string]: colors.secondary,
          ["--mini-muted" as string]: colors.muted,
          ["--mini-accent" as string]: colors.accent,
          ["--mini-tag" as string]: colors.tagOpacity,
        } as CSSProperties
      }
      data-print-theme={theme}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.thumb}
        alt=""
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: photo.objectPosition }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--mini-veil)" }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col justify-end p-3 sm:p-4">
        <p
          className="font-mono text-[8px] tracking-[0.22em] uppercase sm:text-[9px]"
          style={{ color: "var(--mini-secondary)" }}
        >
          {card.eyebrow}
        </p>
        <p className="mt-1 text-lg font-semibold tracking-[0.08em] uppercase sm:text-xl">
          Hikaru
        </p>
        <p
          className="mt-0.5 font-mono text-[8px] tracking-[0.28em] uppercase"
          style={{ color: "var(--mini-muted)" }}
        >
          Chess Elites
        </p>
        <p
          className="mt-2 line-clamp-3 text-[10px] leading-snug sm:text-[11px]"
          style={{ color: "var(--mini-tag)" }}
        >
          {card.tagline}
        </p>
        <p
          className="mt-2 font-mono text-[8px] tracking-[0.12em] uppercase"
          style={{ color: "var(--mini-accent)" }}
        >
          {card.frontMeta} · {theme}
        </p>
      </div>
    </div>
  );
}
