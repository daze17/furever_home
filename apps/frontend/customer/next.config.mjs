/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        hostname: "hips.hearstapps.com",
        protocol: "https",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "images.dog.ceo",
        protocol: "https",
      },
    ],
  },
  transpilePackages: ["@t3-oss/env-nextjs"],
};

export default nextConfig;
