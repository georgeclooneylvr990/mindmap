import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack for dev is fine, but use webpack for builds for better Prisma compatibility
};

export default nextConfig;
