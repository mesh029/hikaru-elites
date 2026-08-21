import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrintCardSheets } from "@/components/print-card-sheets";
import {
  printCards,
  resolvePrintPhoto,
  type PrintCardAudience,
} from "@/lib/content";
import { resolvePrintTheme } from "@/lib/print-theme";

type PageProps = {
  params: Promise<{ audience: string }>;
  searchParams: Promise<{
    photo?: string;
    img?: string;
    print?: string;
    theme?: string;
  }>;
};

const audiences = new Set(printCards.map((card) => card.id));

export async function generateStaticParams() {
  return printCards.map((card) => ({ audience: card.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience } = await params;
  const card = printCards.find((item) => item.id === audience);
  return {
    title: card ? `A5 Card · ${card.title}` : "A5 Card",
  };
}

export default async function PrintCardPage({ params, searchParams }: PageProps) {
  const { audience } = await params;
  const query = await searchParams;

  if (!audiences.has(audience as PrintCardAudience)) {
    notFound();
  }

  const photo = resolvePrintPhoto({
    photo: query.photo,
    img: query.img,
  });
  const theme = resolvePrintTheme(query.theme);

  return (
    <PrintCardSheets
      audience={audience as PrintCardAudience}
      photo={photo}
      theme={theme}
      autoprint={query.print === "1"}
    />
  );
}
