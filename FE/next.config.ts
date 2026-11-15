import type { NextConfig } from "next";
import path from "node:path";

const root = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  turbopack: {
    root,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  outputFileTracingRoot: root,
};

export default nextConfig;
