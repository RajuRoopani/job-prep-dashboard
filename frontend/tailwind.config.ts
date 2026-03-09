import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#07080C", surface: "#0D0F18", elevated: "#131621" },
        border: { DEFAULT: "rgba(255,255,255,0.06)", accent: "rgba(99,102,241,0.35)", glow: "rgba(99,102,241,0.5)" },
        text: { 1: "#F0F2FF", 2: "#8B8FA8", 3: "#4A4E66" },
        accent: { DEFAULT: "#6366F1", light: "#818CF8", glow: "rgba(99,102,241,0.18)" },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.25), transparent)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)",
        "accent-gradient": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        "amber-gradient": "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.3), 0 0 30px rgba(99,102,241,0.08)",
        glow: "0 0 20px rgba(99,102,241,0.3)",
        "glow-sm": "0 0 10px rgba(99,102,241,0.2)",
        "inner-top": "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "shimmer": "shimmer 1.5s infinite linear",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};
export default config;
