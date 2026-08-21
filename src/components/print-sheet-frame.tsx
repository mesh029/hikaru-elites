"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

/** CSS px width of 148mm in the current browser (A5 short side). */
function measureA5WidthPx() {
  if (typeof document === "undefined") return 559.37;
  const probe = document.createElement("div");
  probe.style.cssText =
    "width:148mm;height:0;position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const width = probe.offsetWidth || 559.37;
  probe.remove();
  return width;
}

type PrintSheetFrameProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Scales a fixed A5 sheet to the frame width. Avoids CSS `cqw / mm` calc,
 * which many browsers treat as invalid — leaving the sheet at full A5 width
 * and overflowing the viewport.
 */
export function PrintSheetFrame({ children, className }: PrintSheetFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const a5Px = measureA5WidthPx();
    const update = () => {
      const width = frame.clientWidth;
      setScale(a5Px > 0 ? Math.min(1, width / a5Px) : 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={cn("print-sheet-frame", className)}
      style={{ "--print-scale": String(scale) } as CSSProperties}
    >
      {children}
    </div>
  );
}
