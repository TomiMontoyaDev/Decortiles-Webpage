import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['decorcolombiatiles.com', 'www.decorcolombiatiles.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'decorcolombiatiles.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.decorcolombiatiles.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Note: rewrites don't work with static export
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/wordpress/:path*',
  //       destination: 'https://www.decorcolombiatiles.com/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
