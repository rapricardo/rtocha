import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Desabilitar verificação de tipos durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Desabilitar lint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configurar domínios de imagens permitidos
  images: {
    domains: ['cdn.sanity.io'],
  }
};

export default nextConfig;
