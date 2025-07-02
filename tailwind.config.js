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
          "primary": "#06d6a0",         // vivid minty green
          "primary-focus": "#00b386",   // deeper teal-green
          "primary-content": "#ffffff",

          "secondary": "#3a86ff",       // bright electric blue
          "secondary-focus": "#265df2", 
          "secondary-content": "#ffffff",

          "accent": "#ff006e",          // hot pink for pop
          "accent-focus": "#d4005c",
          "accent-content": "#ffffff",

          "neutral": "#f1f5f9",         // light cool neutral
          "neutral-focus": "#d1d5db",
          "neutral-content": "#1f2937",

          "base-100": "#ffffff",        
          "base-200": "#fef3c7",        // warm creamy base
          "base-300": "#fde68a",        
          "base-content": "#1f2937",
        },
      },
      {
        dark: {
          "primary": "#06d6a0",         
          "primary-focus": "#00b386",
          "primary-content": "#ffffff",

          "secondary": "#3a86ff",       
          "secondary-focus": "#265df2",
          "secondary-content": "#ffffff",

          "accent": "#ff006e",          
          "accent-focus": "#d4005c",
          "accent-content": "#ffffff",

          "neutral": "#1e293b",         // deep cool gray
          "neutral-focus": "#0f172a",
          "neutral-content": "#e2e8f0",

          "base-100": "#0f172a",        // dark indigo background
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f8fafc",
        },
      },
    ],
  }

};

