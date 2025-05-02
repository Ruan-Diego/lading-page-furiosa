import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['upload.wikimedia.org'],
  },
  basePath: '/lading-page-furiosa',
  assetPrefix: '/lading-page-furiosa/',
};

export default nextConfig;
