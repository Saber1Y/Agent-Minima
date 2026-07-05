import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: "#6366f1",
        "accent-dark": "#4f46e5",
        surface: "#0a0a0f",
        card: "#12121a",
        border: "#1e1e2e",
        muted: "#6b7280",
        success: "#22c55e",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};

export default config;
