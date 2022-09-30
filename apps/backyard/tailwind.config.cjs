/** @type {import('tailwindcss').Config} */
const config = require('tailwind-config/tailwind.config.cjs');

config.plugins = [
  ...config.plugins,
  require('@tailwindcss/forms'),
  require('@headlessui/tailwindcss'),
];
module.exports = config;
