/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        input: "var(--input)",
        border: "var(--border)",

        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        "primary-hover": "var(--primary-hover)",

        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        "secondary-hover": "var(--secondary-hover)",
      },
      borderColor: (theme) => ({
        DEFAULT: theme("colors.border"),
      }),
      animation: {
        typing: "zoom 0.25s linear 1",
        overlayOpen: "dimBg 0.33s ease 1",
        overlayClose: "lightenBg 0.33s ease 1",
        dialogShow: "dialogShow 0.66s ease 1",
      },
      keyframes: {
        zoom: {
          "0%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1.0)" },
        },
        dimBg: {
          "0%": { "background-color": "transparent" },
          "100%": { "background-color": "rgba(0,0,0,0.5)" },
        },
        lightenBg: {
          "0%": { "background-color": "rgba(0,0,0,0.5)" },
          "100%": { "background-color": "transparent" },
        },
        dialogShow: {
          "0%": { opacity: 0.9 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
