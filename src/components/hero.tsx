"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { heroImage, presenceLines } from "@/lib/content";
import { useEffect, useState } from "react";

export function Hero() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % presenceLines.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "12.5% 12.5%",
          animation: "board-grid-in 1.4s ease-out both",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-24 pt-28 sm:px-6 sm:pb-28 lg:px-8 lg:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-mono text-[11px] tracking-[0.35em] text-secondary uppercase"
        >
          Academy · Schools · Coaching
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mt-3 font-semibold tracking-[0.08em] text-[clamp(3.4rem,14vw,9rem)] leading-[0.9]"
        >
          HIKARU
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mt-2 text-sm tracking-[0.42em] text-muted-foreground uppercase sm:text-base"
        >
          Chess Elites
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-6 max-w-xl text-base text-foreground/90 sm:text-lg"
        >
          We train minds. In schools. At the board.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button render={<Link href="/programs" />} size="lg">
            See programs
          </Button>
          <Button
            render={<Link href="/gallery" />}
            variant="outline"
            size="lg"
          >
            View gallery
          </Button>
        </motion.div>

        <motion.p
          key={lineIndex}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-8 font-mono text-xs tracking-wider text-accent"
        >
          {presenceLines[lineIndex]}
        </motion.p>
      </div>
    </section>
  );
}
