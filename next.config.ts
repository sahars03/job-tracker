import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  /* 10-12-2025 - I added these because I was getting a warning that there are multiple package.json files and npm picked the root one */
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;