/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        oled: "#000000",
        panel: "#0a0a0a",
        edge: "#1a1a1a",
        ink: "#fafafa",
        muted: "#737373",
        accent: "#22c55e",
        accentLow: "#0a3d1a",
        accentMid: "#15803d",
        warn: "#f59e0b",
        danger: "#ef4444",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(34,197,94,0.45)" },
          "50%": { boxShadow: "0 0 0 12px rgba(34,197,94,0)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        pop: "pop 220ms ease-out",
      },
    },
  },
  plugins: [],
};
