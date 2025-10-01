import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Setup global polyfills for browser compatibility
import process from "process";

// Import and setup Buffer polyfill
import { Buffer } from "buffer";

// Make Buffer available globally
(globalThis as any).Buffer = Buffer;

// Make process available globally
(globalThis as any).process = process;

// Make global available as well
(globalThis as typeof globalThis & { global: typeof globalThis }).global =
  globalThis;

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
