/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: { DEFAULT:'#2d6a4f', light:'#52b788', pale:'#d8f3dc' },
          warm:   '#f4a261',
          cream:  '#fefae0',
          sale:   '#e63946',
          dark:   '#1b1b1b',
          mid:    '#666666',
          light:  '#f9f9f5',
        }
      },
      fontFamily: {
        head: ['"Playfair Display"', 'serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
