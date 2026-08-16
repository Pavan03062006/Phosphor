import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers doesn't run Next's built-in image-optimization
    // server (no sharp in that runtime). Assets here are small/pre-sized,
    // so serving them as-is costs nothing meaningful.
    unoptimized: true,
  },
};

export default nextConfig;
