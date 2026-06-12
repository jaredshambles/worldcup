/**
 * Design System Tokens
 * Light theme with ESPN-inspired colors and Jony Ive minimalism
 */

export const theme = {
  colors: {
    /* Primary palette */
    background: "#ffffff",
    foreground: "#1f2937",
    surface: "#f9fafb",
    "surface-hover": "#f3f4f6",
    border: "#e5e7eb",

    /* Text hierarchy */
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
      tertiary: "#9ca3af",
    },

    /* Brand colors */
    accent: {
      primary: "#ef4444", // ESPN Red
      secondary: "#3b82f6", // Sports Blue
    },

    /* Status colors */
    success: "#34d399", // Green - user position, correct predictions
    warning: "#fbbf24", // Amber - medals, warnings
    danger: "#dc2626", // Dark red - urgent, errors
    info: "#dbeafe", // Light blue - micro-interactions, info states

    /* Semantic colors */
    highlight: {
      bg: "#f0fdf4", // Your position background
      border: "#86efac", // Your position border
    },
    urgency: {
      bg: "#fef3c7", // Deadline background
      border: "#fde047", // Deadline border
      text: "#dc2626", // Deadline text
    },
    achievement: {
      bg: "#dbeafe", // Achievement background
      border: "#93c5fd", // Achievement border
      text: "#0369a1", // Achievement text
    },
    error: {
      bg: "#fee2e2", // Error background
    },

    /* Medal colors (for leaderboard) */
    medals: {
      gold: "#eab308",
      silver: "#94a3b8",
      bronze: "#d97706",
    },
  },

  /* Typography scale */
  typography: {
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    lineHeight: {
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontFamily: {
      sans: "var(--font-geist-sans), Arial, sans-serif",
      mono: "var(--font-geist-mono), monospace",
    },
  },

  /* Spacing scale */
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  /* Border radius */
  borderRadius: {
    none: "0px",
    sm: "0.25rem", // 4px
    base: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  /* Shadows - Jony Ive inspired (subtle, refined) */
  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  /* Breakpoints - mobile first */
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  /* Touch targets (48px minimum) */
  touchTargets: {
    sm: "32px",
    base: "40px",
    md: "44px",
    lg: "48px",
  },

  /* Transitions & animations */
  transitions: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },

  /* Z-index scale */
  zIndex: {
    hide: "-1",
    base: "0",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    "modal-backdrop": "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
  },
} as const;

/* Type exports for TypeScript */
export type Theme = typeof theme;
export type Color = keyof typeof theme.colors;
export type Spacing = keyof typeof theme.spacing;
export type BorderRadius = keyof typeof theme.borderRadius;
export type Shadow = keyof typeof theme.shadows;
export type Breakpoint = keyof typeof theme.breakpoints;
