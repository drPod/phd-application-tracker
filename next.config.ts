import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Skip static optimization for pages that require authentication
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
