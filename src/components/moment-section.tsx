"use client";

import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { momentImage } from "@/lib/content";

export function MomentSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
        <Reveal className="relative min-h-[320px] lg:min-h-[520px]">
          <Image
            src={momentImage.src}
            alt={momentImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
        <Reveal
          delay={0.1}
          className="flex flex-col justify-center bg-card/30 px-4 py-14 sm:px-8 lg:px-12"
        >
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Why us
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl">
            Chess that builds character, not just ratings
          </h2>
          <p className="mt-5 max-w-lg text-muted-foreground">
            Hikaru Chess Elites exists to put serious chess training where it
            matters: kids discovering the game, schools building clubs, and
            anyone who wants a coach who actually cares about progress.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
