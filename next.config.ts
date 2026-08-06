import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve CDN URLs directly. Next's optimizer was failing to fetch
    // Sirv/Unsplash (500 / fetch failed), which broke images in the browser.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "meshackariri.sirv.com",
      },
      {
        protocol: "https",
        hostname: "meshackariri-direct.sirv.com",
      },
    ],
  },
};

export default nextConfig;
