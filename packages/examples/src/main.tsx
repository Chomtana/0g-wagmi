import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Setup global polyfills for browser compatibility
import { Buffer } from "buffer";

// Make Buffer available globally
(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;

// Make global available as well
(globalThis as typeof globalThis & { global: typeof globalThis }).global =
  globalThis;

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
