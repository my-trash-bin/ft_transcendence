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
      normal: '400',
      bold: '700',
    },
    fontSize: {
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      h3: '20px',
      h2: '30px',
      h1: '36px',
    },
    spacing: {
      '0': '0',
      xs: '4px',
      sm: '10px',
      md: '15px',
      lg: '20px',
      xl: '25px',
      '2xl': '60px',
    },
    width: {
      xs: '30px',
      sm: '50px',
      md: '75px',
      lg: '100px',
      xl: '300px',
    },
    height: {
      xs: '30px',
      sm: '50px',
      md: '75px',
      lg: '100px',
    },
    colors: {
      color1: '#4662B0',
      color2: '#3A89C0',
      color3: '#545459',
      color4: '#443183',
      color5: '#5B3F9A',
      color6: '#E7E1F3',
      color7: '#F8F5FD',
      color8: '#8E8CDC',
      colorNine: '#FAF9FD',
      color10: '#EAEAFB',
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
  },
};
