/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // 開発時のみSSRを無効化
  ...(process.env.NODE_ENV === "development" && {
    output: "export",
  }),
};

module.exports = nextConfig;
