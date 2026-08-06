"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-[0.14em] sm:text-xl">
            HIKARU
          </span>
          <span className="hidden text-[10px] tracking-[0.28em] text-muted-foreground uppercase sm:inline">
            Chess Elites
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm tracking-wide transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button render={<Link href="/contact" />} size="sm" className="ml-2">
            Inquire
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border border-transparent px-3 py-3 text-base tracking-wide",
                    pathname === link.href
                      ? "border-primary/40 text-primary"
                      : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                render={<Link href="/contact" />}
                className="mt-2 w-full"
                onClick={() => setOpen(false)}
              >
                Inquire
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
