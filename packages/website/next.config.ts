import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/KeyRote',
  images: {
    unoptimized: true, // Required for next export
  }
};

export default nextConfig;
