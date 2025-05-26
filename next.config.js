// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['18.183.140.58'],
    unoptimized: true,
  },
  experimental: {
    // Vercel に SSG ではなく Node.js ランタイムでの実行を強制
    appDir: false,
    instrumentationHook: true,
    typedRoutes: true
  },
  output: 'standalone', // ← これが重要
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      tls: false,
      https: false,
      http: false,
    };
    return config;
  },
}

module.exports = nextConfig
