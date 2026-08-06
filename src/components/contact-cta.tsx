"use client";

import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function ContactCta() {
  return (
    <section className="border-t border-border bg-card/25">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Next move
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-wide sm:text-4xl">
            Ready to train kids, launch a school club, or book coaching?
          </h2>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button render={<Link href="/contact" />} size="lg">
            Inquire now
          </Button>
          <Button
            render={
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noreferrer"
              />
            }
            variant="outline"
            size="lg"
          >
            WhatsApp
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
