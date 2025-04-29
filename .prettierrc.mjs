/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  // prettier defaults to 80 and tries to persuade us to keep it that way at
  // https://prettier.io/docs/options#print-width but 120 is a lot closer to what we have had up to now, and I think
  // preferable.
  printWidth: 120,
};

export default config;
