"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const interests = ["Kids", "School", "Coaching"] as const;

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [interest, setInterest] = useState<(typeof interests)[number]>("Kids");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="border border-secondary/50 bg-secondary/10 p-6">
        <p className="text-lg font-semibold text-secondary">Inquiry staged</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Prototype only for now. We can wire this to email or WhatsApp later. Nice move,{" "}
          {name || "friend"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-border bg-card/30 p-5 sm:p-7">
      <div className="mb-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1",
              i <= step ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="who"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-4"
          >
            <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Step 1 · Who
            </p>
            <label className="block">
              <span className="text-sm">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border border-border bg-background px-3 py-3 outline-none focus:border-primary"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-sm">Phone or email</span>
              <input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-2 w-full border border-border bg-background px-3 py-3 outline-none focus:border-primary"
                placeholder="+254… or email"
              />
            </label>
            <Button type="button" onClick={next} className="w-full sm:w-auto">
              Continue
            </Button>
          </motion.div>
        ) : null}

        {step === 1 ? (
          <motion.div
            key="interest"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-4"
          >
            <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Step 2 · Interest
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {interests.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setInterest(item)}
                  className={cn(
                    "border px-3 py-4 text-left transition-colors",
                    interest === item
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border hover:border-primary/60"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={back}>
                Back
              </Button>
              <Button type="button" onClick={next}>
                Continue
              </Button>
            </div>
          </motion.div>
        ) : null}

        {step === 2 ? (
          <motion.div
            key="message"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-4"
          >
            <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Step 3 · Message
            </p>
            <label className="block">
              <span className="text-sm">How can we help?</span>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full resize-none border border-border bg-background px-3 py-3 outline-none focus:border-primary"
                placeholder="School name, age group, preferred days…"
              />
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={back}>
                Back
              </Button>
              <Button type="submit">Send inquiry</Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
