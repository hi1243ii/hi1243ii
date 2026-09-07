import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Raw industrial palette — use directly for chips, charts, illustrations.
        steel: {
          50: "#f7f8f9",
          100: "#eef0f2",
          200: "#dde1e6",
          300: "#c3c9d1",
          400: "#9aa3b1",
          500: "#737e8f",
          600: "#5a6475",
          700: "#474f5e",
          800: "#363c48",
          900: "#22262e",
          950: "#15171c",
        },
        safety: {
          yellow: {
            50: "#fffbea",
            100: "#fff3c4",
            200: "#ffe58a",
            300: "#ffd54f",
            400: "#ffc61e",
            500: "#f5b700",
            600: "#d69e00",
            700: "#ad7c00",
            800: "#855f00",
            900: "#5c4300",
            950: "#3d2c00",
          },
          orange: {
            50: "#fff4ed",
            100: "#ffe4d3",
            200: "#ffc4a3",
            300: "#ff9d66",
            400: "#ff7a33",
            500: "#ff5a1f",
            600: "#eb4709",
            700: "#c23606",
            800: "#9a2d0c",
            900: "#7c280f",
            950: "#431004",
          },
        },
        // Kept as an alias of safety.orange so existing scaffold components
        // (which reference brand-*) pick up the new palette automatically.
        brand: {
          50: "#fff4ed",
          100: "#ffe4d3",
          200: "#ffc4a3",
          300: "#ff9d66",
          400: "#ff7a33",
          500: "#ff5a1f",
          600: "#eb4709",
          700: "#c23606",
          800: "#9a2d0c",
          900: "#7c280f",
          950: "#431004",
        },

        // Semantic tokens — driven by CSS variables so they flip with .dark.
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display sizes pair with font-display (condensed/industrial headings).
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["2.25rem", { lineHeight: "1.15" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2" }],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 6px)",
        DEFAULT: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 6px)",
        "2xl": "calc(var(--radius) + 12px)",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 17 21 / 0.04), 0 1px 3px 0 rgb(15 17 21 / 0.06)",
        card: "0 2px 8px -2px rgb(15 17 21 / 0.08), 0 4px 16px -4px rgb(15 17 21 / 0.08)",
        elevated: "0 8px 24px -6px rgb(15 17 21 / 0.16), 0 4px 10px -4px rgb(15 17 21 / 0.1)",
        plate: "inset 0 1px 0 0 rgb(255 255 255 / 0.08), 0 1px 0 0 rgb(15 17 21 / 0.2)",
      },
      backgroundImage: {
        "hazard-stripes":
          "repeating-linear-gradient(45deg, hsl(var(--warning)) 0, hsl(var(--warning)) 10px, hsl(var(--foreground)) 10px, hsl(var(--foreground)) 20px)",
      },
    },
  },
  plugins: [],
};

export default config;
