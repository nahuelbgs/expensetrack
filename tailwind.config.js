const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,jsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '90': '90vh',
      },
      colors:{
        'green-electric': '#A2F263',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
