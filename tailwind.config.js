const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{css,ts,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Nunito'", ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: '560px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.neutral,
      indigo: colors.indigo,
      blue: colors.blue,
      sky: colors.sky,
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
