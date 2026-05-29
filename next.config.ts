import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['192.168.1.11', '192.168.1.18', 'localhost'],
};

export default nextConfig;
