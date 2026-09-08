/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "error-container": "#ffdad6",
        "on-surface": "#001d31",
        "tertiary-fixed-dim": "#4edea3",
        "surface-container-lowest": "#ffffff",
        outline: "#737686",
        "on-tertiary-fixed-variant": "#005236",
        "on-primary": "#ffffff",
        "secondary-fixed": "#dae2fd",
        "secondary-fixed-dim": "#bec6e0",
        "on-error": "#ffffff",
        "on-tertiary-fixed": "#002113",
        "surface-container-low": "#ecf4ff",
        error: "#ba1a1a",
        surface: "#f7f9ff",
        "surface-container-highest": "#cce5ff",
        "on-background": "#001d31",
        "outline-variant": "#c3c6d7",
        "primary-container": "#2563eb",
        "surface-variant": "#cce5ff",
        "surface-bright": "#f7f9ff",
        "on-secondary-container": "#5c647a",
        "primary-fixed-dim": "#b4c5ff",
        secondary: "#565e74",
        "surface-tint": "#0053db",
        "on-primary-fixed": "#00174b",
        "surface-container-high": "#d7eaff",
        "on-secondary-fixed-variant": "#3f465c",
        background: "#f7f9ff",
        primary: "#004ac6",
        "inverse-primary": "#b4c5ff",
        "on-secondary": "#ffffff",
        "on-primary-fixed-variant": "#003ea8",
        "surface-container": "#e2efff",
        "surface-dim": "#bcdeff",
        "primary-fixed": "#dbe1ff",
        "on-surface-variant": "#434655",
        "tertiary-fixed": "#6ffbbe",
        "inverse-on-surface": "#e7f2ff",
        "tertiary-container": "#007d55",
        "inverse-surface": "#003351",
        "on-tertiary-container": "#bdffdb",
        "secondary-container": "#dae2fd",
        "on-primary-container": "#eeefff",
        "on-secondary-fixed": "#131b2e",
        tertiary: "#006242",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a"
      },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Hanken Grotesk", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["56px", { lineHeight: "60px", letterSpacing: "-0.04em", fontWeight: "700" }],
        "headline-xl": ["40px", { lineHeight: "44px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "headline-lg": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["22px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", letterSpacing: "0.01em", fontWeight: "400" }],
        "spec-code": ["12px", { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "700" }],
        "label-caps": ["11px", { lineHeight: "14px", letterSpacing: "0.08em", fontWeight: "700" }]
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0px #001d31",
        "brutal": "3px 3px 0px #001d31",
        "brutal-md": "4px 4px 0px #001d31",
        "brutal-lg": "6px 6px 0px #001d31",
        "brutal-blue": "3px 3px 0px #2563eb",
        "brutal-primary": "4px 4px 0px #004ac6",
        "card-hover": "4px 4px 0px #004ac6"
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "spin-slow": "spin-slow 2.5s linear infinite"
      }
    }
  },
  plugins: []
};