/**
 * AP Enerfy Solar ERP & Billing Management Software
 * Centralized Design System & Semantic Theme Tokens
 * Derived from high-fidelity UI reference screenshots (images/)
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand & Sidebar (Dark Navy-Green)
    sidebar: {
      background: "#102A2A",
      secondary: "#163B35",
      activeBg: "#1B5E43",
      hoverBg: "#143731",
      foreground: "#F8FAFC",
      muted: "#94A3B8",
      border: "#1C443C",
    },
    // Primary Actions
    primary: {
      default: "#16834B",
      hover: "#116B3D",
      active: "#0D5630",
      foreground: "#FFFFFF",
      subtle: "#EAF7EE",
    },
    // Solar Brand Accents
    solar: {
      yellow: "#F4B740",
      gold: "#E5A823",
      amber: "#D97706",
      dark: "#0F2424",
    },
    // Application Canvas
    canvas: {
      background: "#F6F8FA",
      card: "#FFFFFF",
      subtle: "#F1F5F9",
      border: "#E2E8F0",
      divider: "#EDF2F7",
    },
    // Typography
    text: {
      primary: "#172B2A",
      secondary: "#64748B",
      muted: "#94A3B8",
      inverted: "#FFFFFF",
    },
    // Semantic States & Pastel Card Backgrounds
    status: {
      success: {
        text: "#166534",
        border: "#BBF7D0",
        bg: "#EAF7EE",
        solid: "#16A34A",
      },
      warning: {
        text: "#9A3412",
        border: "#FED7AA",
        bg: "#FEF8EC",
        solid: "#D97706",
      },
      error: {
        text: "#991B1B",
        border: "#FECACA",
        bg: "#FEF2F2",
        solid: "#DC2626",
      },
      info: {
        text: "#1E40AF",
        border: "#BFDBFE",
        bg: "#EFF6FF",
        solid: "#2563EB",
      },
      purple: {
        text: "#5B21B6",
        border: "#DDD6FE",
        bg: "#F4F0FF",
        solid: "#7C3AED",
      },
      neutral: {
        text: "#475569",
        border: "#E2E8F0",
        bg: "#F8FAFC",
        solid: "#64748B",
      },
    },
  },

  dimensions: {
    sidebarExpandedWidth: "248px",
    sidebarCollapsedWidth: "72px",
    headerHeight: "64px",
    pagePadding: {
      desktop: "24px",
      tablet: "20px",
      mobile: "16px",
    },
    cardPadding: {
      compact: "16px",
      normal: "20px",
      spacious: "24px",
    },
    radius: {
      sm: "6px",
      md: "8px",
      lg: "12px",
      xl: "16px",
      full: "9999px",
    },
  },

  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sizes: {
      pageHeading: "1.75rem", // 28px
      sectionHeading: "1.25rem", // 20px
      cardTitle: "0.9375rem", // 15px
      kpiValue: "1.875rem", // 30px
      body: "0.875rem", // 14px
      table: "0.8125rem", // 13px
      caption: "0.75rem", // 12px
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  shadows: {
    subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
    dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
    modal: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
