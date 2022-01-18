module.exports = {
  content: ['./html/**/*.html', './src/**/*.css'],
  theme: {
    extend: {},
    screens: {
      sm: '480px',
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
