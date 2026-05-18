import nextTranslate from 'next-translate-plugin'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextTranslate(nextConfig, {turbopack: true});
