/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5016',
        secondary: '#7CB342',
        accent: '#FF6F00',
        surface: {
          50: '#FAFAF5',
          100: '#F5F5DC',
          200: '#EEEED8',
          300: '#E6E6D3',
          400: '#DDDDCE',
          500: '#D4D4C9',
          600: '#CBCBC4',
          700: '#C2C2BF',
          800: '#B9B9BA',
          900: '#B0B0B5'
        },
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#29B6F6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Outfit', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}