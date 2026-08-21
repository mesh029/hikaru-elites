"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { PrintSheetFrame } from "@/components/print-sheet-frame";
import type { PrintCardAudience, PrintPhoto } from "@/lib/content";
import { getPrintCard } from "@/lib/content";
import {
  DEFAULT_PRINT_THEME,
  type PrintTheme,
} from "@/lib/print-theme";
import { cn } from "@/lib/utils";

import "./print-card.css";

type PrintCardSheetsProps = {
  audience: PrintCardAudience;
  photo: PrintPhoto;
  theme?: PrintTheme;
  autoprint?: boolean;
};

export function PrintCardSheets({
  audience,
  photo,
  theme = DEFAULT_PRINT_THEME,
  autoprint = false,
}: PrintCardSheetsProps) {
  const card = getPrintCard(audience);

  const photoQuery =
    photo.id === "custom"
      ? `img=${encodeURIComponent(photo.src)}`
      : `photo=${encodeURIComponent(photo.id)}`;
  const query = `${photoQuery}&theme=${theme}`;

  const standaloneHref = `/api/print-card?audience=${audience}&${query}`;
  const pdfHref = `/api/print-pdf?audience=${audience}&${query}`;

  useEffect(() => {
    if (!autoprint) return;
    window.location.replace(pdfHref);
  }, [autoprint, pdfHref]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("print-preview-active");
    body.classList.add("print-preview-active");
    return () => {
      html.classList.remove("print-preview-active");
      body.classList.remove("print-preview-active");
    };
  }, []);

  return (
    <div className="print-root" data-print-theme={theme}>
      <nav className="print-screen-nav no-print">
        <div className="print-nav-row">
          <Link href="/resources">← Resources</Link>
          <span className="print-theme-toggle" aria-label="Card color">
            <Link
              href={`/print/card/${audience}?${photoQuery}&theme=dark`}
              className={cn(theme === "dark" && "is-active")}
            >
              Dark
            </Link>
            <Link
              href={`/print/card/${audience}?${photoQuery}&theme=light`}
              className={cn(theme === "light" && "is-active")}
            >
              Light
            </Link>
          </span>
          <span className="print-hint">
            A5 · {photo.label} · {theme}
          </span>
        </div>
        <div className="print-nav-row print-nav-audiences">
          <Link href={`/print/card/parents?${query}`}>Parents</Link>
          <Link href={`/print/card/kids?${query}`}>Kids</Link>
          <Link href={`/print/card/schools?${query}`}>Schools</Link>
          <Link href={`/print/card/coaching?${query}`}>Coaching</Link>
          <Link href={`/print/card/events?${query}`}>Events</Link>
        </div>
        <div className="print-nav-row print-nav-actions">
          <a className="print-download-btn" href={pdfHref}>
            Download card PDF
          </a>
          <a
            className="print-secondary-btn"
            href={standaloneHref}
            target="_blank"
            rel="noreferrer"
          >
            Preview / print
          </a>
        </div>
      </nav>

      <div className="print-stage">
        <PrintSheetFrame>
          <article
            className="print-sheet print-sheet--front"
            aria-label={`${card.title} card front`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="print-front-photo"
              src={photo.src}
              alt={photo.alt}
              style={{ objectPosition: photo.objectPosition }}
            />
            <div className="print-front-veil" aria-hidden />
            <div className="print-front-grid" aria-hidden />
            <div className="print-front-content">
              <p className="print-eyebrow">{card.eyebrow}</p>
              <h1 className="print-wordmark">Hikaru</h1>
              <p className="print-wordmark-sub">Chess Elites</p>
              <p className="print-tagline">{card.tagline}</p>
              <p className="print-front-meta">
                <span>hikaru-chess-elites.online</span>
                <span>{card.frontMeta}</span>
              </p>
            </div>
          </article>
        </PrintSheetFrame>

        <PrintSheetFrame>
          <article
            className="print-sheet print-sheet--back"
            aria-label={`${card.title} card back`}
          >
            <div className="print-back-inner">
              <header className="print-back-header">
                <p className="print-eyebrow print-eyebrow--muted">
                  {card.backEyebrow}
                </p>
                <h2 className="print-back-title">{card.backTitle}</h2>
                <p className="print-back-lede">{card.backLede}</p>
              </header>

              <div className="print-pillars">
                {card.pillars.map((pillar) => (
                  <section
                    key={pillar.title}
                    className={cn("print-pillar", pillar.focus && "is-focus")}
                  >
                    <p className="print-pillar-label">{pillar.label}</p>
                    <h3 className="print-pillar-title">{pillar.title}</h3>
                    <p className="print-pillar-line">{pillar.line}</p>
                    <p className="print-pillar-body">{pillar.body}</p>
                  </section>
                ))}
              </div>

              <ul className="print-benefits">
                {card.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="print-cta-block">
                <div>
                  <p className="print-cta-label">Next step</p>
                  <p className="print-cta-title">{card.ctaTitle}</p>
                  <div className="print-cta-links">
                    <div>
                      <strong>hikaru-chess-elites.online</strong>
                    </div>
                    <div>info@hikaru-chess-elites.online</div>
                  </div>
                </div>
                <div className="print-qr-slot">
                  <Image
                    src="/print/assets/qr.png"
                    alt="QR code to Hikaru Chess Elites"
                    width={200}
                    height={200}
                    unoptimized
                  />
                </div>
              </div>

              <p className="print-back-foot">
                Hikaru Chess Elites · We train minds. In schools. At the board.
              </p>
            </div>
          </article>
        </PrintSheetFrame>
      </div>
    </div>
  );
}
