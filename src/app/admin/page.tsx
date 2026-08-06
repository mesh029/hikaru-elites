"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SENDERS = [
  { id: "info", label: "info@hikaru-chess-elites.online" },
  { id: "hello", label: "hello@hikaru-chess-elites.online" },
  { id: "support", label: "support@hikaru-chess-elites.online" },
] as const;

type SenderId = (typeof SENDERS)[number]["id"];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);

  const [from, setFrom] = useState<SenderId>("info");

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("hikaru-admin");
    if (saved === "1") setUnlocked(true);
  }, []);

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim() !== "lcwaikiki") {
      setGateError("Wrong passphrase.");
      return;
    }
    sessionStorage.setItem("hikaru-admin", "1");
    setUnlocked(true);
    setGateError(null);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passphrase: "lcwaikiki",
          from,
          to,
          subject,
          body,
        }),
      });
      const payload = (await res.json()) as {
        ok?: boolean;
        error?: string;
        from?: string;
        desk?: string;
        usedFallback?: boolean;
      };

      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "Send failed.");
      }

      setStatus(
        payload.usedFallback
          ? `Sent to ${to}. Desk ${payload.desk} set as Reply-To (enable Zoho Send Mail As to From that address directly).`
          : `Sent from ${payload.from} to ${to}`
      );
      setBody("");
      setSubject("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setSending(false);
    }
  };

  if (!unlocked) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 pt-14">
        <form
          onSubmit={unlock}
          className="w-full max-w-md border border-border bg-card/30 p-6"
        >
          <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-wide">
            Hikaru desk
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the short passphrase to send themed mail.
          </p>
          <label className="mt-6 block">
            <span className="text-sm">Passphrase</span>
            <input
              type="password"
              required
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="mt-2 w-full border border-border bg-background px-3 py-3 outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </label>
          {gateError ? (
            <p className="mt-3 text-sm text-destructive">{gateError}</p>
          ) : null}
          <Button type="submit" className="mt-5 w-full">
            Unlock
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-14">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
          Admin · Mail desk
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-wide">
          Send from Hikaru
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick hello or support, write the message, and we wrap it in the Hikaru
          theme before Zoho sends it.
        </p>

        <form onSubmit={send} className="mt-8 space-y-5 border border-border bg-card/25 p-5 sm:p-7">
          <div>
            <p className="mb-2 text-sm">Send from</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {SENDERS.map((sender) => (
                <button
                  key={sender.id}
                  type="button"
                  onClick={() => setFrom(sender.id)}
                  className={cn(
                    "border px-3 py-3 text-left text-sm transition-colors",
                    from === sender.id
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/60"
                  )}
                >
                  {sender.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm">To</span>
            <input
              required
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-2 w-full border border-border bg-background px-3 py-3 outline-none focus:border-primary"
              placeholder="recipient@email.com"
            />
          </label>

          <label className="block">
            <span className="text-sm">Subject</span>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 w-full border border-border bg-background px-3 py-3 outline-none focus:border-primary"
              placeholder="Subject line"
            />
          </label>

          <label className="block">
            <span className="text-sm">Body</span>
            <textarea
              required
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-2 w-full resize-y border border-border bg-background px-3 py-3 outline-none focus:border-primary"
              placeholder="Write the email body. Use blank lines between paragraphs."
            />
          </label>

          {error ? (
            <p className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="border border-secondary/40 bg-secondary/10 px-3 py-2 text-sm text-secondary">
              {status}
            </p>
          ) : null}

          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? "Sending…" : "Send themed email"}
          </Button>
        </form>
      </section>
    </div>
  );
}
