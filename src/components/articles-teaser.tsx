"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { articles } from "@/lib/content";

type ArticlesTeaserProps = {
  limit?: number;
};

export function ArticlesTeaser({ limit = 3 }: ArticlesTeaserProps) {
  const shown = articles.slice(0, limit);

  return (
    <section className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
              Articles
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
              Notes from the board
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Cute reads on kids training, how we coach, and why we are growing
              chess in Kenya.
            </p>
          </div>
          <Button render={<Link href="/articles" />} variant="outline">
            All articles
          </Button>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {shown.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.06}>
              <Link
                href={`/articles/${article.slug}`}
                className="pin-soft group flex h-full flex-col overflow-hidden bg-card/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-[1rem]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-secondary uppercase">
                    {article.category} · {article.readMinutes} min
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-wide group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <span className="mt-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
                    Read →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
