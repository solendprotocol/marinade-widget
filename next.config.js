const libs = ['@solana/wallet-adapter-base'];
const withTM = require('next-transpile-modules')(libs);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    if (!isServer) config.resolve.fallback.fs = false;
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
});

module.exports = nextConfig;
