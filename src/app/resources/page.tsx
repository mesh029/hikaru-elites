import type { Metadata } from "next";

import { ResourcesPrintStudio } from "@/components/resources-print-studio";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Choose a photo and light or dark theme, then download A5 print cards for parents, kids, schools, coaching, and events.",
};

export default function ResourcesPage() {
  return <ResourcesPrintStudio />;
}
