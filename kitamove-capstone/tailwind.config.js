/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F28C28',
        'brand-orange-dark': '#D4751A',
        'brand-background': '#FFF9F5',
      }
    },
  },
  plugins: [],
}