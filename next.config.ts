import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {

  experimental: {
    cacheComponents: false,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "nhatapbytpujtgzkgalp.supabase.co" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Redirect www to apex domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.outora.co.il" }],
        destination: "https://outora.co.il/:path*",
        permanent: true,
      },
      // Legacy /protected → /account
      { source: "/protected", destination: "/account", permanent: true },
      // /map → /locations (navbar was updated)
      { source: "/map", destination: "/locations", permanent: true },
    ];
  },
};

export default nextConfig;
