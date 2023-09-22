/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.dovercourt.org", "picsum.photos", "images.unsplash.com"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
