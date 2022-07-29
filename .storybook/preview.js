import {defineCustomElements} from '../loader';

defineCustomElements();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // This makes the preview a little more cramped but is necessary to avoid `iframe.html` in the static build having outer padding.
  // This is necessary for our current Salesforce Experiences workaround of directly embedding the built Storybook iframe for simple,
  // fixed-input components.
  layout: 'fullscreen',
}
