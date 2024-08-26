/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"]
      },
      colors: {
        lightfont: "#242424",
        lightbg: "#f8f8f8",
        progress: "#646cff"
      }
    },
  },
  plugins: [],
}

