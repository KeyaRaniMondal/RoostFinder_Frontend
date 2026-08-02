import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#daefff",
          200: "#bde3ff",
          300: "#90d3ff",
          400: "#5cbaff",
          500: "#3599fc",
          600: "#1f7af1",
          700: "#1762de",
          800: "#1a50b4",
          900: "#1b468d",
          950: "#152c56",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
        },
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.07)",
      },
    },
  },
  plugins: [],
};
export default config;
