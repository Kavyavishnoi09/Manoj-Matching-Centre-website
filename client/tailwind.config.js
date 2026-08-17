/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7', 100: '#faf6ee', 200: '#f5ecd9', 300: '#eddfc0', 400: '#e0cca0', 500: '#d4b880',
        },
        maroon: {
          50: '#fdf3f3', 100: '#fce8e8', 200: '#f9d5d5', 300: '#f3b5b5', 400: '#e98080',
          500: '#d95454', 600: '#c0392b', 700: '#9b2d20', 800: '#7a2319', 900: '#5e1b13', 950: '#3d110b',
        },
        burgundy: {
          50: '#fdf4f5', 100: '#fce8ea', 200: '#f9d3d7', 300: '#f3b0b8', 400: '#e97f8d',
          500: '#db5366', 600: '#c5354b', 700: '#a3283c', 800: '#872332', 900: '#6f1f2c', 950: '#3e0e16',
        },
        gold: {
          50: '#fefbe8', 100: '#fdf6c3', 200: '#fbeb8a', 300: '#f7d849', 400: '#f0c420',
          500: '#d9a406', 600: '#bc7d04', 700: '#975a06', 800: '#7c4810', 900: '#6a3c12', 950: '#3d1e04',
        },
        brown: {
          50: '#fdf8f5', 100: '#faf0e9', 200: '#f4e0d2', 300: '#e9c4a8', 400: '#db9d78',
          500: '#cd8055', 600: '#c06942', 700: '#a25236', 800: '#84432f', 900: '#6c392b', 950: '#3a1c14',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
