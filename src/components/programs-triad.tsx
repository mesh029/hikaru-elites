"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { programs } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ProgramsTriad() {
  const [active, setActive] = useState(0);

  return (
    <section id="programs" className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            What we do
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
            Three ways to train with Hikaru
          </h2>
        </Reveal>

        {/* Mobile: snap carousel */}
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:hidden">
          {programs.map((program) => (
            <article
              key={program.id}
              className="relative min-w-[85%] snap-center overflow-hidden border border-border"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover"
                  sizes="85vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-2xl font-semibold tracking-wide">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm text-secondary">{program.line}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {program.body}
                </p>
                <Button
                  render={<Link href="/contact" />}
                  size="sm"
                  className="mt-5"
                >
                  Inquire for this
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop: expandable triad */}
        <div className="mt-12 hidden h-[min(70vh,640px)] md:flex">
          {programs.map((program, index) => {
            const expanded = active === index;
            return (
              <motion.article
                key={program.id}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                tabIndex={0}
                animate={{ flexGrow: expanded ? 2.2 : 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative min-w-0 flex-1 overflow-hidden border border-border",
                  index > 0 && "border-l-0"
                )}
              >
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-700"
                  style={{ transform: expanded ? "scale(1.04)" : "scale(1)" }}
                  sizes="40vw"
                />
                <div
                  className={cn(
                    "absolute inset-0 transition-colors duration-500",
                    expanded
                      ? "bg-gradient-to-t from-background via-background/70 to-background/10"
                      : "bg-background/55"
                  )}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <h3 className="text-3xl font-semibold tracking-wide lg:text-4xl">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-secondary">{program.line}</p>
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: expanded ? 1 : 0,
                      y: expanded ? 0 : 12,
                      height: expanded ? "auto" : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 max-w-md text-sm text-muted-foreground lg:text-base">
                      {program.body}
                    </p>
                    <Button
                      render={<Link href="/contact" />}
                      className="mt-6"
                      size="sm"
                    >
                      Inquire for this
                    </Button>
                  </motion.div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <Link
            href="/programs"
            className="font-mono text-xs tracking-[0.25em] text-accent uppercase hover:text-primary"
          >
            Full program details →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
