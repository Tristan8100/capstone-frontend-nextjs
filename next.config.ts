import type { NextConfig } from "next";
const url = new URL(process.env.NEXT_PUBLIC_API_URL);
const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disables ALL ESLint checks during build
  },
  images: {
    remotePatterns: [
      {
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname,
        port: url.port || '', // include port if needed (like 8000)
        pathname: '/**',       // allow all image paths
      } as any,
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
