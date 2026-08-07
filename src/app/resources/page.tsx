import type { Metadata } from "next";

import { ResourcesPrintStudio } from "@/components/resources-print-studio";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Choose a Sirv photo and download A3 print cards for parents, schools, and events.",
};

export default function ResourcesPage() {
  return <ResourcesPrintStudio />;
}
