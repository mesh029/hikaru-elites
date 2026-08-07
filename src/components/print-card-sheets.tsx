"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import type { PrintCardAudience, PrintPhoto } from "@/lib/content";
import { getPrintCard } from "@/lib/content";
import { cn } from "@/lib/utils";

import "./print-card.css";

type PrintCardSheetsProps = {
  audience: PrintCardAudience;
  photo: PrintPhoto;
  autoprint?: boolean;
};

export function PrintCardSheets({
  audience,
  photo,
  autoprint = false,
}: PrintCardSheetsProps) {
  const card = getPrintCard(audience);

  const photoQuery =
    photo.id === "custom"
      ? `img=${encodeURIComponent(photo.src)}`
      : `photo=${encodeURIComponent(photo.id)}`;

  const standaloneHref = `/api/print-card?audience=${audience}&${photoQuery}`;
  const pdfHref = `/api/print-pdf?audience=${audience}&${photoQuery}`;
  const downloadPhotoHref =
    photo.id === "custom"
      ? `/api/download-image?url=${encodeURIComponent(photo.src)}`
      : `/api/download-image?id=${photo.id}`;

  useEffect(() => {
    if (!autoprint) return;
    window.location.replace(pdfHref);
  }, [autoprint, pdfHref]);

  return (
    <div className="print-root">
      <nav className="print-screen-nav no-print">
        <Link href="/resources">← Resources</Link>
        <Link href={`/print/card/parents?${photoQuery}`}>Parents</Link>
        <Link href={`/print/card/kids?${photoQuery}`}>Kids</Link>
        <Link href={`/print/card/schools?${photoQuery}`}>Schools</Link>
        <Link href={`/print/card/coaching?${photoQuery}`}>Coaching</Link>
        <Link href={`/print/card/events?${photoQuery}`}>Events</Link>
        <a className="print-download-btn" href={pdfHref}>
          Download card PDF
        </a>
        <a className="print-secondary-btn" href={standaloneHref} target="_blank" rel="noreferrer">
          Preview / print
        </a>
        <span className="print-hint">A3 · front + back · {photo.label}</span>
      </nav>

      <article className="print-sheet print-sheet--front" aria-label={`${card.title} card front`}>
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

      <article className="print-sheet print-sheet--back" aria-label={`${card.title} card back`}>
        <div className="print-back-inner">
          <header className="print-back-header">
            <p className="print-eyebrow print-eyebrow--muted">{card.backEyebrow}</p>
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
    </div>
  );
}
