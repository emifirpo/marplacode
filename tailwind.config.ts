import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        brand: {
          black: "#0A0A0A",
          white: "#F5F5F3",
          accent: "#E8FF47",
          gray: {
            100: "#F0F0EE",
            200: "#D8D8D6",
            400: "#9A9A98",
            600: "#5A5A58",
            800: "#2A2A28",
          },
        },
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 8rem)", { lineHeight: "0.95" }],
        "display-lg": ["clamp(2.5rem, 5vw, 5.5rem)", { lineHeight: "1" }],
        "display-md": ["clamp(1.75rem, 3vw, 3rem)", { lineHeight: "1.1" }],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
