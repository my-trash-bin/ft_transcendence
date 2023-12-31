import { Config } from 'tailwindcss';
import { screens } from './script/constants.cjs';

export default <Config>{
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens,
    borderRadius: {
      sm: '6px',
      md: '12px',
      lg: '24px',
      full: '9999px',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      semibold: '600',
      bold: '700',
    },
    fontSize: {
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      h3: '20px',
      h2: '24px',
      h1: '30px',
    },
    spacing: {
      '0': '0',
      xs: '4px',
      sm: '10px',
      md: '15px',
      lg: '20px',
      xl: '30px',
      '2xl': '60px',
      '3xl': '80px',
    },
    width: {
      xs: '30px',
      sm: '50px',
      md: '75px',
      lg: '100px',
      xl: '300px',
      '2xl': '600px',
    },
    height: {
      xs: '30px',
      sm: '50px',
      md: '75px',
      lg: '100px',
      xl: '300px',
      '2xl': '600px',
    },
    dropShadow: {
      none: '0 0 #0000',
      md: '0px 10px 30px #00000020',
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    extend: {
      fontFamily: {
        sejong: ['KingSejongInstitute-Regular'],
        taebaek: ['TAEBAEKfont'],
        jeonju: ['JeonjuCraftGoR'],
        danjo: ['Danjo-bold-Regular'],
        mayo: ['Dovemayo_gothic'],
        agro: ['SBAggroB'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
