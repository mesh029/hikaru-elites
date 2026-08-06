import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="pt-14">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-24">
        <div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide sm:text-5xl">
            Make the first move
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            We train in schools and coach privately. Tell us what you need:
            kids program, campus club, or personal coaching.
          </p>
          <div className="mt-8 space-y-3 font-mono text-sm tracking-wide">
            <a
              href="mailto:info@hikaru-chess-elites.online"
              className="block text-accent hover:text-primary"
            >
              info@hikaru-chess-elites.online
            </a>
            <a
              href="mailto:hello@hikaru-chess-elites.online"
              className="block text-secondary hover:text-primary"
            >
              hello@hikaru-chess-elites.online
            </a>
            <a
              href="mailto:support@hikaru-chess-elites.online"
              className="block text-muted-foreground hover:text-primary"
            >
              support@hikaru-chess-elites.online
            </a>
            <p className="text-muted-foreground">Nairobi · partner schools</p>
          </div>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
