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
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["buffer"],
    exclude: ["child_process", "fs/promises", "fs", "path"],
  },
});
