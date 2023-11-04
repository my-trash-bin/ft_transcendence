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
  background: '#FAFAFA',
  'background-dark': '#000000',
  text: '#000000',
  'text-dark': '#FFFFFF',
  primary: '#BBFF88',
  'primary-dark': '#668844',
  link: '#0070f3',
  'link-hover': '#0070f3',
  'link-active': '#0070f3',
  'link-focus': '#0070f3',
  example: '#E7E1F3',
  'example-dark': '#E7E1F3',
};

module.exports = {
  screens,
  colors,
};
