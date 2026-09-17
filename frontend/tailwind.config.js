// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#d3e4fe",
        "secondary-container": "#8455ef",
        "secondary": "#6b38d4",
        "surface-tint": "#4d44e3",
        "secondary-fixed-dim": "#d0bcff",
        "on-tertiary-fixed-variant": "#46464f",
        "surface": "#f8f9ff",
        "tertiary": "#474751",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#c7c4d8",
        "on-primary-fixed-variant": "#3323cc",
        "surface-dim": "#cbdbf5",
        "tertiary-fixed": "#e3e1ed",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#1a1b23",
        "primary-container": "#4f46e5",
        "primary": "#3525cd",
        "on-background": "#0b1c30",
        "surface-container-low": "#eff4ff",
        "secondary-fixed": "#e9ddff",
        "inverse-primary": "#c3c0ff",
        "inverse-on-surface": "#eaf1ff",
        "on-secondary-container": "#fffbff",
        "outline": "#777587",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed": "#23005c",
        "on-secondary": "#ffffff",
        "surface-bright": "#f8f9ff",
        "error-container": "#ffdad6",
        "background": "#f8f9ff",
        "tertiary-fixed-dim": "#c7c5d1",
        "on-error": "#ffffff",
        "error": "#ba1a1a",
        "on-error-container": "#93000a",
        "surface-container": "#e5eeff",
        "on-primary-container": "#dad7ff",
        "on-primary-fixed": "#0f0069",
        "surface-container-high": "#dce9ff",
        "on-surface": "#0b1c30",
        "surface-container-highest": "#d3e4fe",
        "on-tertiary-container": "#dbdae5",
        "on-surface-variant": "#464555",
        "on-secondary-fixed-variant": "#5516be",
        "tertiary-container": "#5f5f69",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",
        "inverse-surface": "#213145"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "lg": "24px",
        "xxl": "48px",
        "xs": "4px",
        "md": "16px",
        "xl": "32px",
        "sm": "8px",
        "xxxl": "64px"
      },
      fontFamily: {
        "display-lg": ["Space Grotesk"],
        "body-md": ["Hanken Grotesk"],
        "body-lg": ["Hanken Grotesk"],
        "body-sm": ["Hanken Grotesk"],
        "headline-md": ["Space Grotesk"],
        "headline-lg": ["Space Grotesk"],
        "headline-sm": ["Space Grotesk"],
        "label-md": ["Hanken Grotesk"],
        "label-sm": ["Hanken Grotesk"]
      },
      fontSize: {
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "headline-sm": ["20px", { "lineHeight": "28px", "fontWeight": "500" }],
        "label-md": ["14px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }]
      }
    }
  },
  plugins: []
};