/** @type {import('tailwindcss').Config} */ 
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // 🌙 Dark Theme Colors
        'primary-100': '#C9ADA7',
        'primary-200': '#ab908b',
        'primary-300': '#69514c',
        'accent-100': '#F2CCB8',
        'accent-200': '#8e6d5b',
        'text-100': '#FFFFFF',
        'text-200': '#c4c3c3',
        'bg-100': '#44496b',
        'bg-200': '#555a7d',
        'bg-300': '#707499',

        // ☀️ Light Theme Overrides
        'light-primary-100': '#2C3E50',
        'light-primary-200': '#57687c',
        'light-primary-300': '#b4c7dd',
        'light-accent-100': '#F7CAC9',
        'light-accent-200': '#926b6a',
        'light-text-100': '#333333',
        'light-text-200': '#5c5c5c',
        'light-bg-100': '#F2F2F2',
        'light-bg-200': '#e8e8e8',
        'light-bg-300': '#bfbfbf',
      },
    },
  },
  plugins: [],
};
