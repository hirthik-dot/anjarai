/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#2d6a4f',
          light: '#52b788',
          pale: '#d8f3dc',
        },
        warm: '#F5C542',
        cream: '#fefae0',
        sale: '#e63946',
        dark: '#1b1b1b',
        mid: '#666666',
        light: '#f9f9f5',
      },
      fontFamily: {
        head: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
