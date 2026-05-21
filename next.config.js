/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "haoshih-assets.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
};

module.exports = nextConfig;
