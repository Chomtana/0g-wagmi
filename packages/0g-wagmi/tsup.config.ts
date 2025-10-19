import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "wagmi",
    "viem",
    "@tanstack/react-query",
    "ethers",
    "@0glabs/0g-serving-broker",
    "@0glabs/0g-ts-sdk",
  ],
  target: "es2020",
  platform: "browser",
});
