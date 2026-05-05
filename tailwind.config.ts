import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#f6f0e4",
        parchment: "#efe4d1",
        cedar: "#9b7b58",
        moss: "#31473a",
        clay: "#725741",
        ink: "#1f2937"
      },
      fontFamily: {
        sans: ["'Noto Sans SC'", "'PingFang SC'", "'Microsoft YaHei'", "sans-serif"],
        serif: ["'Noto Serif SC'", "'STSong'", "serif"]
      },
      boxShadow: {
        paper: "0 12px 36px rgba(49, 71, 58, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
