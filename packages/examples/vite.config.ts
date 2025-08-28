import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      child_process: "/app/empty.js",
      "fs/promises": "/app/empty.js",
      fs: "/app/empty.js",
      path: "/app/empty.js",
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
