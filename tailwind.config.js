/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tran: {
          primary: '#8B1A1A',
          secondary: '#D4A017',
          bg: '#1A0F0A',
          card: '#2D1F1A',
          text: '#F5E6D0',
          textMuted: '#A08070',
          danger: '#FF4444',
          safe: '#4CAF50',
          border: '#5A3020',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'],
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
