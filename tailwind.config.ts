import type { Config } from "tailwindcss";

/**
 * OUTORA · Tailwind mapping
 * הערכים מגיעים מ-lib/design-tokens.ts דרך משתני CSS ב-globals.css
 */

export default {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Figma palette (שמות ישירים) ──
        white:    "#FFFFFF",
        offwhite: "#FBFBFB",
        stroke:   "#E6E6E6",
        textgray: "#666666",
        black:    "#000000",
        beige:    "#D9C18A",
        beigedark:"#C7AC71",
        orange:   "#D9652C",
        error:    "#B3261E",
        errorbg:  "#FDECEA",
        success:  "#2F7A55",
        successbg:"#EAF5EF",

        // ── shadcn semantic ──
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card:       { DEFAULT: "hsl(var(--card))",       foreground: "hsl(var(--card-foreground))" },
        popover:    { DEFAULT: "hsl(var(--popover))",    foreground: "hsl(var(--popover-foreground))" },
        primary:    { DEFAULT: "hsl(var(--primary))",    foreground: "hsl(var(--primary-foreground))" },
        secondary:  { DEFAULT: "hsl(var(--secondary))",  foreground: "hsl(var(--secondary-foreground))" },
        muted:      { DEFAULT: "hsl(var(--muted))",      foreground: "hsl(var(--muted-foreground))" },
        accent:     { DEFAULT: "hsl(var(--accent))",     foreground: "hsl(var(--accent-foreground))" },
        destructive:{ DEFAULT: "hsl(var(--destructive))",foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },

      fontSize: {
        h1:       ["48px", { lineHeight: "1.15", fontWeight: "600" }],
        // ⚠️ לא מהפיגמה · מדרגת H1 למובייל, ממתין לאישור
        "h1-sm":  ["28px", { lineHeight: "1.2",  fontWeight: "600" }],
        h2:       ["28px", { lineHeight: "1.25", fontWeight: "600" }],
        h3:       ["22px", { lineHeight: "1.3",  fontWeight: "600" }],
        subtitle: ["20px", { lineHeight: "1.5",  fontWeight: "400" }],
        body:     ["16px", { lineHeight: "1.6",  fontWeight: "400" }],
        button:   ["16px", { lineHeight: "1.2",  fontWeight: "500" }],
        tag:      ["14px", { lineHeight: "1.35", fontWeight: "500" }],
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.33, 1, 0.68, 1)",
      },

      boxShadow: {
        // ⚠️ אסור לקרוא לזה בשם של צבע קיים · Tailwind יעדיף את הצבע
        drop: "0 5px 15px 2px #00000033",
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
