/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // força gerar .next/standalone
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
