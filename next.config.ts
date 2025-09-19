import type { NextConfig } from "next"
const url = new URL(process.env.NEXT_PUBLIC_API_URL)
const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disables ALL ESLint checks during build
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port || "", // include port if needed (like 8000)
        pathname: "/**", // allow all image paths
      } as any,
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

export default nextConfig
