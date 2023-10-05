/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      white: "#ffffff",
      "gray-100": "#f7fafc",
      "gray-200": "#edf2f7",
      "gray-300": "#e2e2e2",
      "gray-550": "#9fa4c4",
      "gray-600": "#868c9e",
      "gray-700": "#4a4f61",
      "gray-750": "#343643",
      "gray-800": "#2e2f3b",
      "gray-900": "#1A202C",
      "slate-750": "#3e4155",
      "blue-100": "#dbeafe",
      "blue-200": "#bfdbfe",
      "blue-300": "#93c5fd",
      "blue-400": "#60a5fa",
      "blue-500": "#3b82f6",
      "blue-600": "#2563eb",
      "blue-700": "#1d4ed8",
      "blue-800": "#1e40af",
      "blue-900": "#1e3a8a",
      "brown-100": "#f3e8e8",
      "brown-200": "#e1cfcf",
      "brown-300": "#d0b6b6",
      "brown-400": "#be9d9d",
      "brown-500": "#ac8484",
      "brown-600": "#9a6b6b",
      "brown-700": "#885252",
      "brown-800": "#733f3f",
      "yellow-400": "#fbbf24",
      "yellow-600": "#d97706",
      "red-400": "#ef4444",
    },
  },
  daisyui: {
    themes: [
      {
        pastel: {
          ...require("daisyui/src/colors/themes")["[data-theme=pastel]"],
          neutral: "black",
          "neutral-focus": "gray",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
