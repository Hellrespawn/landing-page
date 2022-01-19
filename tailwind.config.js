const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./html/**/*.html', './src/**/*.css'],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Open Sans'", ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: '480px',
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
