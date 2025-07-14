import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disables ALL ESLint checks during build
  },
  reactStrictMode: false,
};

export default nextConfig;
