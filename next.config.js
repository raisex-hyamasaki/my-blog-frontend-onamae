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
    typedRoutes: true
  },
  output: 'standalone',
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
