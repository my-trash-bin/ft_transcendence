const { colors } = require('./constants.cjs');
const { clsx } = require('clsx');

const properties = ['border', 'bg', 'text', 'caret'];

console.log(`@layer utilities {
${Object.entries(colors)
  .filter(([key]) => colors[`${key}-dark`])
  .flatMap(([key, value]) =>
    properties.map(
      (property) =>
        `.${property}-${key} { @apply ${clsx(
          `${property}-[${value}]`,
          `dark:${property}-[${colors[`${key}-dark`]}]`,
        )}; }`,
    ),
  )
  .join('\n')}
${Object.entries(colors)
  .filter(
    ([key]) =>
      colors[`${key}-dark`] &&
      colors[`${key}-hover`] &&
      colors[`${key}-hover-dark`] &&
      colors[`${key}-active`] &&
      colors[`${key}-active-dark`],
  )
  .flatMap(([key, value]) =>
    properties.map(
      (property) =>
        `.${property}-${key}-interactive { @apply ${clsx(
          `${property}-[${value}]`,
          `dark:${property}-[${colors[`${key}-dark`]}]`,
          `hover:${property}-[${colors[`${key}-hover`]}]`,
          `hover:dark:${property}-[${colors[`${key}-hover-dark`]}]`,
          `active:${property}-[${colors[`${key}-active`]}]`,
          `active:dark:${property}-[${colors[`${key}-active-dark`]}]`,
          // if you want to make focus color, activate this
          // `focus:${property}-[${colors[`${key}-active`]}]`,
          // `focus:dark:${property}-[${colors[`${key}-active-dark`]}]`
        )}; }`,
    ),
  )
  .join('\n')}
}`);
