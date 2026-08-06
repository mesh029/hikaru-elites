import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { programs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Programs",
};

export default function ProgramsPage() {
  return (
    <div className="pt-14">
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Programs
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">
            Train with intention
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Whether you are a parent, a school, or a player chasing sharper
            calculation, there is a Hikaru path for you.
          </p>
        </div>
      </section>

      {programs.map((program, index) => (
        <section
          key={program.id}
          className="border-b border-border"
          id={program.id}
        >
          <div
            className={`mx-auto grid max-w-7xl lg:grid-cols-2 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[480px]">
              <Image
                src={program.image}
                alt={program.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-12">
              <h2 className="text-3xl font-semibold tracking-wide sm:text-4xl">
                {program.title}
              </h2>
              <p className="mt-3 text-secondary">{program.line}</p>
              <p className="mt-5 max-w-lg text-muted-foreground">
                {program.body}
              </p>
              <ul className="mt-6 space-y-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                <li>· Clear session structure</li>
                <li>· Progress parents and schools can see</li>
                <li>· Coaching that respects real schedules</li>
              </ul>
              <Button render={<Link href="/contact" />} className="mt-8 w-fit">
                Inquire for {program.title.toLowerCase()}
              </Button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
