import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "bg-primary": "#0d0010",
        "bg-secondary": "#1a0030",
        "brand-purple": "#6b00b3",
        "brand-pink": "#e0408a",
        "brand-accent": "#e0f809",
      },
      fontFamily: {
        display: ["Syne", "Space Grotesk", "sans-serif"],
        body: ["DM Sans", "Plus Jakarta Sans", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-main":
          "linear-gradient(135deg, #1a0030 0%, #6b00b3 50%, #e0408a 100%)",
        "gradient-radial":
          "radial-gradient(ellipse at top left, #6b00b3, #e0408a 80%)",
        "gradient-dark": "linear-gradient(180deg, #0d0010 0%, #1a0030 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(224,64,138,0.4)",
        "glow-sm": "0 0 10px rgba(224,64,138,0.3)",
        "glow-accent": "0 0 20px rgba(224,248,9,0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
