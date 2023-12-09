const UPLOADS_HOSTNAME = process.env.UPLOADS_HOSTNAME;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' },
      ...(UPLOADS_HOSTNAME ? [{ hostname: UPLOADS_HOSTNAME }] : []),
    ],
  },
};

module.exports = nextConfig;
