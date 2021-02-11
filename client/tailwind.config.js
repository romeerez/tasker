const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.js'],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: colors.white,
      black: colors.black,
      red: colors.red,
      gray: colors.blueGray,
      cyan: colors.cyan,
      blue: colors.lightBlue,
    },
    extend: {
      transformOrigin: {
        0: '0%',
      },
    },
  },
}
