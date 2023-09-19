/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'www.dovercourt.org',
      },
    ],
  },
};

module.exports = nextConfig;
