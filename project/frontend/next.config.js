/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: 'localhost' }, { hostname: '127.0.0.1' }],
  },
};

module.exports = nextConfig;
