/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /.node$/,
      loader: 'node-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
