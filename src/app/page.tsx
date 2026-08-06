import { ArticlesTeaser } from "@/components/articles-teaser";
import { ContactCta } from "@/components/contact-cta";
import { GalleryCinema } from "@/components/gallery-cinema";
import { Hero } from "@/components/hero";
import { MomentSection } from "@/components/moment-section";
import { ProgramsTriad } from "@/components/programs-triad";
import { Testimonials } from "@/components/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProgramsTriad />
      <MomentSection />
      <Testimonials />
      <ArticlesTeaser />
      <GalleryCinema preview />
      <ContactCta />
    </>
  );
}
