/** @type {import('next').NextConfig} */
const nextConfig = {
  serverless: true,
  webpack: (config) => {
    config.externals = {
      canvas: "canvas",
    };
    return config;
  },
};

module.exports = nextConfig;
