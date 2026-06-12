import type { Config } from "tailwindcss";

const config: Config = {
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
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
        "highlight-bg": "var(--highlight-bg)",
        "highlight-border": "var(--highlight-border)",
        "urgency-bg": "var(--urgency-bg)",
        "urgency-border": "var(--urgency-border)",
        "urgency-text": "var(--urgency-text)",
        "achievement-bg": "var(--achievement-bg)",
        "achievement-border": "var(--achievement-border)",
        "achievement-text": "var(--achievement-text)",
        "error-bg": "var(--error-bg)",
      },
      typography: {
        sm: {
          css: {
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
          },
        },
        base: {
          css: {
            fontSize: "1rem",
            lineHeight: "1.75rem",
          },
        },
        lg: {
          css: {
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
          },
        },
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
      borderRadius: {
        none: "0px",
        sm: "0.25rem",
        base: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        none: "none",
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      minHeight: {
        "touch-target": "44px",
      },
      minWidth: {
        "touch-target": "44px",
      },
    },
  },
  plugins: [],
};

export default config;
