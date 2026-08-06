"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function StickyInquire() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.65);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !dismissed ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden"
        >
          <div className="flex items-center gap-2">
            <Button render={<Link href="/contact" />} className="flex-1">
              Train with us
            </Button>
            <button
              type="button"
              aria-label="Dismiss"
              className="inline-flex size-10 items-center justify-center border border-border"
              onClick={() => setDismissed(true)}
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
