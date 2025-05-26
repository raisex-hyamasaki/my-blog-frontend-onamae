// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', ← この行を削除 or コメントアウト

  images: {
    domains: ['18.183.140.58'],
    unoptimized: true,
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      tls: false,
      https: false,
      http: false,
    };
    return config;
  },
};

module.exports = nextConfig;

