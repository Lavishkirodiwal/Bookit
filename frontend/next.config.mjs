/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** @type {import('next').NextConfig} */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ottsworld.com',
        pathname: '/**',
      },
      // add more domains if needed
    ],
  },//other
};

export default nextConfig;
