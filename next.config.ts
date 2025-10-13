import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ Mantém as rotas de API funcionando
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
