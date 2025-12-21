import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔧 Fix dev source-map issues (Turbopack)
  productionBrowserSourceMaps: false,

  // ✅ Recommended explicit settings
  reactStrictMode: true,

  // (Optional) future-proof
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
