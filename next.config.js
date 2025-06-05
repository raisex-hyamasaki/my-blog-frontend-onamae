// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // ✅ 追加：静的HTML出力対応
  images: {
    domains: ['18.183.140.58'],
    unoptimized: true, // ✅ next/image → 通常の <img> に変換
  },
  experimental: {
    instrumentationHook: true,
    typedRoutes: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      tls: false,
      https: false,
      http: false,
    };

    // ✅ '@/components/xxx' → プロジェクトルートにマップ
    config.resolve.alias['@'] = path.resolve(__dirname);

    return config;
  },
};

module.exports = nextConfig;

