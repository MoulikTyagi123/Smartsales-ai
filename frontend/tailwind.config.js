/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          900: "#14532d",
        },
        dark: {
          900: "#0a0f0d",
          800: "#0f1a14",
          700: "#162219",
          600: "#1e2e23",
          500: "#263a2c",
          400: "#344d3a",
        },
      },
    },
  },
  plugins: [],
};
