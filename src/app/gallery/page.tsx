import type { Metadata } from "next";

import { GalleryCinema } from "@/components/gallery-cinema";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <div className="pt-14">
      <GalleryCinema />
    </div>
  );
}
