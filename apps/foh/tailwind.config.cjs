const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    screens: {
      xs: '380px',
      ...defaultTheme.screens,
    },
  },
  plugins: [require('flowbite/plugin')],
};
