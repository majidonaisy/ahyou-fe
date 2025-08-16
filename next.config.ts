import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // use remotePatterns (preferred) and scope to the Supabase storage path
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gevtbkasbudhtxspzwjf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/ahyou-bucket/**",
      },
    ],
  },
};

export default nextConfig;
