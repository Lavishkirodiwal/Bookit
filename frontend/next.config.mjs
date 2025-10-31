/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['media.tacdn.com'], // add all external domains you use
  },
};

export default nextConfig;

