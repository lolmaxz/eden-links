/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#b026ff',
        'neon-blue': '#4d4dff',
        'neon-pink': '#ff69b4',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(176, 38, 255, 0.7)',
      },
    },
  },
  plugins: [],
};