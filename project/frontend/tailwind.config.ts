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
      bold: '900',
    },
    fontSize: {
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      h3: '20px',
      h2: '22px',
      h1: '24px',
    },
    spacing: {
      '0': '0',
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '24px',
    },
    colors: {},
    dropShadow: {
      none: '0 0 #0000',
      md: '0px 10px 30px #00000020',
    },
  },
};
