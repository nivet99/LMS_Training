import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Plearn colour tokens ────────────────────────────────────────
      colors: {
        // Core neutrals
        ink: {
          DEFAULT: "#1A1715",
          2: "#2E2A26",
          3: "#5B544D",
          4: "#8F877E",
        },
        line: {
          DEFAULT: "#E8E1D2",
          2: "#D5CCB8",
        },
        cream: {
          DEFAULT: "#F6F1E7",
          2: "#EDE5D2",
        },
        paper: "#FFFCF6",
        // Brand primary — Vermilion
        vermilion: {
          DEFAULT: "#FF4D2E",
          2: "#E83B1C",
          soft: "#FFE6DE",
        },
        // Brand secondary — Pine
        pine: {
          DEFAULT: "#1F3D2E",
          2: "#2D5742",
          soft: "#DDEAE0",
        },
        // Accent — Mustard
        mustard: {
          DEFAULT: "#F4C430",
          soft: "#FDF3CE",
        },
      },
      // ─── Plearn font stack ────────────────────────────────────────────
      fontFamily: {
        thai: ["IBM Plex Sans Thai", "IBM Plex Sans", "system-ui", "sans-serif"],
        serif: ["IBM Plex Serif", "IBM Plex Sans Thai", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        sans: ["IBM Plex Sans Thai", "IBM Plex Sans", "system-ui", "sans-serif"],
      },
      // ─── Font sizes matching design scale ────────────────────────────
      fontSize: {
        "display-xl": ["64px", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-l":  ["48px", { lineHeight: "1.08", letterSpacing: "-0.020em" }],
        "display-m":  ["42px", { lineHeight: "1.10", letterSpacing: "-0.020em" }],
        "display-s":  ["36px", { lineHeight: "1.10", letterSpacing: "-0.020em" }],
        h1: ["32px", { lineHeight: "1.15", letterSpacing: "-0.020em" }],
        h2: ["24px", { lineHeight: "1.25", letterSpacing: "-0.010em" }],
        h3: ["20px", { lineHeight: "1.30", letterSpacing: "-0.010em" }],
        h4: ["17px", { lineHeight: "1.35" }],
        "body-l": ["17px", { lineHeight: "1.55" }],
        body: ["15px", { lineHeight: "1.65" }],
        "body-s": ["14px", { lineHeight: "1.50" }],
        caption: ["13px", { lineHeight: "1.45" }],
        "caption-s": ["12px", { lineHeight: "1.40" }],
        label: ["11px", { lineHeight: "1.30", letterSpacing: "0.08em" }],
        "label-xs": ["10px", { lineHeight: "1.20", letterSpacing: "0.08em" }],
      },
      // ─── Border radius ───────────────────────────────────────────────
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        pill: "999px",
        lg2: "12px",
      },
      // ─── Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        card: "0 1px 0 rgba(26,23,21,0.04), 0 8px 24px -8px rgba(26,23,21,0.08)",
        lift: "0 4px 0 rgba(26,23,21,0.04), 0 12px 36px -8px rgba(26,23,21,0.16)",
        enroll: "0 20px 60px -10px rgba(0,0,0,0.4)",
      },
      // ─── Max width ────────────────────────────────────────────────────
      maxWidth: {
        container: "1440px",
      },
      // ─── Transitions ──────────────────────────────────────────────────
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "200ms",
        slow: "250ms",
      },
      // ─── Keyframes ────────────────────────────────────────────────────
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        "fade-in": "fade-in 0.25s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
