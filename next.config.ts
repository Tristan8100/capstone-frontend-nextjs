import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disables ALL ESLint checks during build
  },
  images: {
    domains: [
      '127.0.0.1',       // Laravel local
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
