import type { Metadata } from "next";
import { Oxanium, Source_Code_Pro } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyInquire } from "@/components/sticky-inquire";

import "./globals.css";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Hikaru Chess Elites",
    template: "%s · Hikaru Chess Elites",
  },
  description:
    "Chess training for kids, school programs, and coaching for anyone ready to improve.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${oxanium.variable} ${sourceCodePro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <StickyInquire />
      </body>
    </html>
  );
}
