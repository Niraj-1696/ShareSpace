/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Softer Blue (blue-500)
        secondary: "#059669", // Muted Emerald Green (emerald-600)
        accent: "#f59e0b", // Amber (kept for highlights)
        success: "#16a34a", // Softer Green (green-600)
        warning: "#eab308", // Softer Yellow (yellow-500)
        danger: "#dc2626", // Softer Red (red-600)
        background: "#f9fafb", // Light Gray
        card: "#ffffff", // White for cards
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
