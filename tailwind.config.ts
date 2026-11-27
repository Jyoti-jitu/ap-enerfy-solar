import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#16834B",
          hover: "#116B3D",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#172B2A",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F4B740",
          foreground: "#172B2A",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#16834B",

        // AP Enerfy Solar Brand Palette (UI Screenshots matching)
        solar: {
          yellow: "#F4B740",
          gold: "#E5A823",
          amber: "#D97706",
          dark: "#102A2A",
          darker: "#0C1F1F",
          green: "#16834B",
          emerald: "#10b981",
          light: "#EAF7EE",
        },

        // Sidebar Specific Palette
        nav: {
          dark: "#102A2A",
          secondary: "#163B35",
          active: "#1B5E43",
          hover: "#143731",
          border: "#1C443C",
          text: "#F8FAFC",
          muted: "#A3B8B5",
        },

        // Semantic Pastel KPI Card Backgrounds
        kpi: {
          green: "#EAF7EE",
          blue: "#EFF6FF",
          amber: "#FEF8EC",
          purple: "#F4F0FF",
          red: "#FEF2F2",
          cyan: "#ECFEFF",
        },
      },
      borderRadius: {
        xl: "1rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
