import type { NextConfig } from "next";

const nextConfig: any = {
  serverExternalPackages: ["firebase-admin"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
