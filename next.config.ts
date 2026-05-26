import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aumentar limite de body para API routes (máximo permitido pela Vercel Hobby: 4.5MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nrnhybqaeseatuqkiasn.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
