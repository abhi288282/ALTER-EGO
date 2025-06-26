/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ego: {
          black: "#0a0a0a",
          gray: "#1f1f1f",
          pink: "#ff007f",
          red: "#ff1a1a",
          white: "#fefefe",
          neon: "#00f0ff",
        },
      },
    },
  },
  plugins: [],
};
