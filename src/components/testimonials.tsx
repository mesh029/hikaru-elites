"use client";

import { Reveal } from "@/components/reveal";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Voices from the board
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
            What trainers and players say
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Friends of Hikaru across Nairobi chess: coaches, competitors, and
            people building the game.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => {
            const pending = !item.quote;
            return (
              <Reveal key={item.id} delay={index * 0.06}>
                <figure
                  className={cn(
                    "flex h-full flex-col border border-border/50 bg-card/25 p-6 sm:p-7",
                    pending && "border-dashed opacity-80"
                  )}
                >
                  <blockquote className="flex-1 text-base leading-relaxed text-foreground/90 sm:text-lg">
                    {pending ? (
                      <span className="italic text-muted-foreground">
                        “{item.pendingLabel ?? "Testimonial coming soon"}”
                      </span>
                    ) : (
                      <span>“{item.quote}”</span>
                    )}
                  </blockquote>
                  <figcaption className="mt-8 border-t border-border/60 pt-4">
                    <p className="font-semibold tracking-wide">{item.name}</p>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-secondary uppercase">
                      {item.role}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
