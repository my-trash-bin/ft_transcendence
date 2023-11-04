// @ts-check

const layoutTabletMinWidth = 768;
const layoutDesktopMinWidth = 1024;

/** @type {Record<string, `${number}px`>}  */
const screens = {
  tablet: `${layoutTabletMinWidth}px`,
  desktop: `${layoutDesktopMinWidth}px`,
};

/** @type {Record<string, `#${string}`>}  */
const colors = {
  'dark-purple': '#5B3F9A',
  'dark-purple-dark': '#5B3F9A',
  'dark-hover': '#4A3E7A',
  'dark-hover-dark': '#4A3E7A',
  default: '#E7E1F3',
  'default-dark': '#E7E1F3',
  'background-hover': '#D3C1EA',
  'background-hover-dark': '#D3C1EA',
  'light-background': '#F8F5FD',
  'light-background-dark': '#F8F5FD',
  'char-color1': '#8E8CDC',
  'char-color1-dark': '#8E8CDC',
  'char-color2': '#EAEAFB',
  'char-color2-dark': '#EAEAFB',
  black: '#000000',
  'black-dark': '#000000',
  'dark-gray': '#545459',
  'dark-gray-dark': '#545459',
  gray: '#A9A9A9',
  'gray-dark': '#A9A9A9',
  'light-gray': '#F2F2F2',
  'light-gray-dark': '#F2F2F2',
  white: '#FFFFFF',
  'white-dark': '#FFFFFF',
  live: '#2FD236',
  'live-dark': '#2FD236',
};

module.exports = {
  screens,
  colors,
};
