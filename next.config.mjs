/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "qr-food-ordering.s3.ap-southeast-2.amazonaws.com",
      "lh3.googleusercontent.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
