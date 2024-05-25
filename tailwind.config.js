/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    extend: {
      animation: {
        typing: "zoom 0.25s linear 1",
      },
      keyframes: {
        zoom: {
          "0%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1.0)" },
        },
      },
    },
  },
  plugins: [],
};
