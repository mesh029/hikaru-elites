import Link from "next/link";

import { navLinks } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="text-2xl font-semibold tracking-[0.16em]">HIKARU</p>
          <p className="mt-1 text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Chess Elites
          </p>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Training kids, partnering with schools, and coaching anyone ready to
            think sharper at the board.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-4 text-center font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        © {new Date().getFullYear()} Hikaru Chess Elites · Prototype
      </div>
    </footer>
  );
}
