import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Disable automatic dark mode
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
