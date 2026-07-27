/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { dark: '#0a1535', DEFAULT: '#1a2d6b', light: '#2a4494' },
        brand: {
          blue: '#3366cc',
          green: '#2dd36f',
          orange: '#ff9800',
          red: '#eb445a',
          purple: '#7c4dff',
        },
        page: '#f4f6f9',
        border: '#e8ecf1',
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
    },
  },
  plugins: [],
}
