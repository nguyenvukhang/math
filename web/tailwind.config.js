const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg0: colors.neutral[700],
        bg1: colors.neutral[600],
        bg2: '#696969',
        bg3: colors.neutral[400],
        fg0: colors.stone[50],
        fg1: colors.stone[200],
        fg2: colors.stone[400],
      },
    },
  },
  plugins: [],
}
