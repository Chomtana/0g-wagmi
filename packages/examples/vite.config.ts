import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      child_process: "/src/empty.js",
      "fs/promises": "/src/empty.js",
      fs: "/src/empty.js",
      path: "/src/empty.js",
    },
    // Make sure the app and the library share ONE instance
    dedupe: ["react", "react-dom", "wagmi", "viem", "@tanstack/react-query"],
    // Keep default: false, helps avoid duplicate module graphs via symlinks
    preserveSymlinks: false,
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["buffer"],
    exclude: ["child_process", "fs/promises", "fs", "path"],
  },
});
