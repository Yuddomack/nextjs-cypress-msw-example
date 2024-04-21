/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  cacheHandler: path.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0,
};

export default nextConfig;
