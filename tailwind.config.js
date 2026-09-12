const { hairlineWidth } = require("nativewind/theme");

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: { DEFAULT: "hsl(var(--primary) / <alpha-value>)", foreground: "hsl(var(--primaryForeground) / <alpha-value>)" },
        secondary: { DEFAULT: "hsl(var(--secondary) / <alpha-value>)", foreground: "hsl(var(--secondaryForeground) / <alpha-value>)" },
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        muted: { DEFAULT: "hsl(var(--muted) / <alpha-value>)", foreground: "hsl(var(--mutedForeground) / <alpha-value>)" },
        card: { DEFAULT: "hsl(var(--card) / <alpha-value>)", foreground: "hsl(var(--cardForeground) / <alpha-value>)" },
      },
      borderWidth: { hairline: hairlineWidth() },
    },
  },
  plugins: [],
};
