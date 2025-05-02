import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'build', 
  images: {
    unoptimized: true,
    domains: ['upload.wikimedia.org'],
  },
  basePath: '/chat-furioso',
  assetPrefix: '/chat-furioso/',
};

export default nextConfig;
