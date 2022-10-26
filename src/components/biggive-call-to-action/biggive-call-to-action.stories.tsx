export default {
  title: 'Components/Content',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    defaultTextColour: {
      name: 'Default text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    slugColour: {
      name: 'Slug colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    slug: {
      name: 'Slug',
    },
    mainTitleColour: {
      name: 'Main title colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    mainTitle: {
      name: 'Main title',
    },
    subtitleColour: {
      name: 'Subtitle colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    subtitle: {
      name: 'Subtitle',
    },
    teaserColour: {
      name: 'Teaser colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    teaser: {
      name: 'Teaser',
    },
    primaryButtonUrl: {
      name: 'Primary button url',
    },
    primaryButtonLabel: {
      name: 'Primary button label',
    },
    primaryButtonColourScheme: {
      name: 'Primary button colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'clear-primary', 'clear-secondary', 'clear-tertiary', 'clear-white', 'clear-black'],
      },
    },
    secondaryButtonUrl: {
      name: 'Secondary button url',
    },
    secondaryButtonLabel: {
      name: 'Secondary button label',
    },
    secondaryButtonColourScheme: {
      name: 'Secondary button colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'clear-primary', 'clear-secondary', 'clear-tertiary', 'clear-white', 'clear-black'],
      },
    },
  },
};

const Template = args => `
      <biggive-call-to-action
        space-below=${args.spaceBelow}
        default-text-colour="${args.defaultTextColour}"
        slug-colour="${args.slugColour}"
        slug="${args.slug}"
        main-title-colour="${args.mainTitleColour}"
        main-title="${args.mainTitle}"
        subtitle-colour="${args.subtitleColour}"
        subtitle="${args.subtitle}"
        teaser-colour="${args.teaserColour}"
        teaser="${args.teaser}"
        primary-button-url="${args.primaryButtonUrl}"
        primary-button-label="${args.primaryButtonLabel}"
        primary-button-colour-scheme="${args.primaryButtonColourScheme}"
        secondary-button-url="${args.secondaryButtonUrl}"
        secondary-button-label="${args.secondaryButtonLabel}"
        secondary-button-colour-scheme="${args.secondaryButtonColourScheme}"
      </biggive-call-to-action>
      `;

export const CallToActionComponent = Template.bind({});
CallToActionComponent.args = {
  spaceBelow: 0,
  defaultTextColour: 'primary',
  slugColour: '',
  slug: 'Test Slug',
  mainTitleColour: '',
  mainTitle: 'Test title',
  subtitleColour: '',
  subtitle: 'Test subtitle',
  teaserColour: '',
  teaser: 'Test teaser',
  primaryButtonUrl: '#',
  primaryButtonLabel: 'Click me',
  primaryButtonColourScheme: 'primary',
  secondaryButtonUrl: '#',
  secondaryButtonLabel: 'Click me',
  secondaryButtonColourScheme: 'clear-primary',
};
