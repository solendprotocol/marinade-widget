/** @type {import('tailwindcss').Config} */

const isWidgetOnly = process.env.MODE === 'widget';
module.exports = {
  important: isWidgetOnly ? '#marinade-terminal' : false,
  corePlugins: {
    preflight: true,
  },
  mode: 'jit',
  darkMode: 'media',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xxs: ['0.625rem', '1rem'],
      },
    },
  },
};
