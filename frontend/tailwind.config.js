/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        popup: {
          '0%': {
            transfrom: 'scale(0)'
          },
          '100%': {
            transfrom: 'scale(1)'
          }
        } 
      },
      animation: {
        popup: 'popup 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}