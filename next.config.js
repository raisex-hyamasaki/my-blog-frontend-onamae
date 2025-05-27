// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['18.183.140.58'],
    unoptimized: true,
  },
  experimental: {
    instrumentationHook: true,
    typedRoutes: true,
  },
  // ✅ 明示的に削除してビルド時に `export` されないようにする
  // output: 'standalone', ← 一時的に削除 ※getServerSidePropsがあればSSRに強制される

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

