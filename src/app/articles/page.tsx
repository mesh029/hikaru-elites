import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Stories from Hikaru Chess Elites on kids training, coaching, and growing chess in Kenya.",
};

export default function ArticlesPage() {
  return (
    <div className="pt-14">
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Articles
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">
            Notes from the board
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Short reads about kids at the board, how we train, and the passion
            that keeps Hikaru Chess Elites moving chess forward in Kenya.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="pin-soft group overflow-hidden bg-card/30"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-[1rem]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5 sm:p-6">
                <p className="font-mono text-[10px] tracking-[0.25em] text-secondary uppercase">
                  {article.category} · {article.readMinutes} min read
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-wide group-hover:text-primary">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
