/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, options) => {
    config.externals.push('@mangayomu/puppeteer');
    return config;
  },
};

module.exports = nextConfig;
