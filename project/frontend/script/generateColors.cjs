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
  )
  .flatMap(([key, value]) =>
    properties.map(
      (property) =>
        `.${property}-${key}-interactive { @apply ${clsx(
          `${property}-[${value}]`,
          `dark:${property}-[${colors[`${key}-dark`]}]`,
          `hover:${property}-[${colors[`${key}-hover`]}]`,
          `hover:dark:${property}-[${colors[`${key}-hover-dark`]}]`,
          `active:${property}-[${colors[`${key}-hover`]}]`,
          `active:dark:${property}-[${colors[`${key}-hover-dark`]}]`,
          `focus:${property}-[${colors[`${key}-hover`]}]`,
          `focus:dark:${property}-[${colors[`${key}-hover-dark`]}]`
        )}; }`,
    ),
  )
  .join('\n')}
}`);
