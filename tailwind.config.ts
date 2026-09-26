import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B0A10",
        surface: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.08)",
        accentFrom: "#E8A6D9",
        accentTo: "#8C6FE0",
        blocker: "#E88A8A",
        conditional: "#E8C56A",
        informational: "#8AC0E8",
      },
      fontFamily: {
        display: ["'EB Garamond'", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
