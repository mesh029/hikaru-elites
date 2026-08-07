"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type DownloadCardPdfButtonProps = {
  href: string;
  filenameHint?: string;
  className?: string;
};

export function DownloadCardPdfButton({
  href,
  filenameHint = "hikaru-a5-card.pdf",
  className,
}: DownloadCardPdfButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDownload() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(href);
      const type = res.headers.get("content-type") ?? "";
      if (!res.ok || !type.includes("application/pdf")) {
        const payload = type.includes("json")
          ? ((await res.json()) as { error?: string })
          : null;
        throw new Error(payload?.error || "PDF download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filenameHint;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        className="w-full"
        disabled={busy}
        onClick={onDownload}
      >
        {busy ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        {busy ? "Building PDF..." : "Download card PDF"}
      </Button>
      {error ? (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
