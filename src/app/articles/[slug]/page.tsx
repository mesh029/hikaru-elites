import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { articles, getArticle } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <article className="pt-14">
      <div className="relative min-h-[42vh] border-b border-border sm:min-h-[50vh]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <p className="font-mono text-[11px] tracking-[0.3em] text-secondary uppercase">
            {article.category} · {article.readMinutes} min · {article.date}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-wide sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{article.excerpt}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-6 text-base leading-relaxed text-foreground/90 sm:text-lg">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row">
          <Button render={<Link href="/contact" />}>Train with us</Button>
          <Button render={<Link href="/articles" />} variant="outline">
            More articles
          </Button>
        </div>

        {others.length > 0 ? (
          <div className="mt-16">
            <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Keep reading
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/articles/${item.slug}`}
                  className="border border-border p-4 transition-colors hover:border-primary/60"
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] text-secondary uppercase">
                    {item.category}
                  </p>
                  <p className="mt-2 font-semibold tracking-wide">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
