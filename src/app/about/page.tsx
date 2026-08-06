import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pt-14">
      <section className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[70vh]">
          <Image
            src="https://images.unsplash.com/photo-1560785496-3e4a7dd6d06d?auto=format&fit=crop&w=1600&q=80"
            alt="Coach guiding a student"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center px-4 py-14 sm:px-8 lg:px-14">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            About
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide sm:text-5xl">
            Elite standards. Human coaching.
          </h1>
          <p className="mt-5 max-w-lg text-muted-foreground">
            Hikaru Chess Elites is a chess training enterprise focused on kids,
            school partnerships, and coaching for anyone who wants to improve.
            We care about discipline, joy at the board, and results you can
            feel in focus, confidence, and competitive readiness.
          </p>
          <p className="mt-4 max-w-lg text-muted-foreground">
            This prototype uses placeholder photography. Swap in your real
            session photos and the site becomes your living portfolio.
          </p>
          <Button render={<Link href="/contact" />} className="mt-8 w-fit">
            Start a conversation
          </Button>
        </div>
      </section>
    </div>
  );
}
