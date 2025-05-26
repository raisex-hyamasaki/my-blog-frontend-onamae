/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静的HTML出力 (next export 相当)

  images: {
    domains: ['18.183.140.58'], // Strapi の画像URLが対象
    unoptimized: true,         // next/image最適化を無効化
  },

  // env: {
  //   NEXT_PUBLIC_API_URL: 'https://18.183.140.58:1337', // ← fetch に使う環境変数を HTTPS 指定
  // },

  // 自己署名SSLでの fetch エラー回避用
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
