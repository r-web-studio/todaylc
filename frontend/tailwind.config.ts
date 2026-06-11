const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "#0B1D3A", foreground: "#FFFFFF" },
        accent: { DEFAULT: "#F5A623", foreground: "#0B1D3A" },
        destructive: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
        muted: { DEFAULT: "#F7F8FA", foreground: "#6B7280" },
        card: { DEFAULT: "#FFFFFF", foreground: "#1F2937" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#1F2937" },
        sidebar: { DEFAULT: "#0B1D3A", foreground: "#FFFFFF", hover: "#F5A623" },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        heading: ["Plus Jakarta Sans", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
