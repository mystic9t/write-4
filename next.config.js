/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests during development
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.1.39:3000',
    'http://192.168.1.39:3001',
  ],

  // Other Next.js configuration options
  reactStrictMode: true,
};

module.exports = nextConfig;
