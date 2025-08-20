import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // Disable automatic dark mode
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config