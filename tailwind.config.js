/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#06d6a0", // minty green
          "primary-focus": "#00b386", // teal-green
          "primary-content": "#ffffff", // pure white

          "secondary": "#3a86ff", // electric blue
          "secondary-focus": "#265df2",  // deep blue
          "secondary-content": "#ffffff", // pure white

          "accent": "#ff006e", // hot pink
          "accent-focus": "#d4005c", // deep pink
          "accent-content": "#ffffff", // pure white

          "neutral": "#f1f5f9", // light cool gray
          "neutral-focus": "#d1d5db", // light gray
          "neutral-content": "#1f2937", // dark gray

          "base-100": "#ffffff", // pure white
          "base-200": "#fef3c7", // warm creamy 
          "base-300": "#fde68a", // light yellow
          "base-content": "#1f2937",  // dark gray
        },
      },
      {
        dark: {
          "primary": "#06d6a0", // minty green
          "primary-focus": "#00b386", // teal-green
          "primary-content": "#ffffff", // pure white

          "secondary": "#3a86ff", // electric blue
          "secondary-focus": "#265df2", // deep blue
          "secondary-content": "#ffffff", // pure white

          "accent": "#ff006e", // hot pink
          "accent-focus": "#d4005c", // deep pink
          "accent-content": "#ffffff", // pure white

          "neutral": "#1e293b", // deep cool gray
          "neutral-focus": "#0f172a", // darker gray
          "neutral-content": "#e2e8f0", // light gray

          "base-100": "#0f172a", // dark indigo
          "base-200": "#1e293b", // deep cool gray
          "base-300": "#334155", // darker gray
          "base-content": "#f8fafc", // light gray
        },
      },
    ],
  }

};