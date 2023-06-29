export default {
  title: 'Components/Content',
  argTypes: {
    spaceAbove: {
      name: 'Space above',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
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
    videoUrl: {
      name: 'Video URL',
    },
    slug: {
      name: 'Slug',
    },
    slugColour: {
      name: 'Slug colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    mainTitle: {
      name: 'Main title',
    },
    mainTitleColour: {
      name: 'Main title colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    teaser: {
      name: 'Teaser',
    },
    teaserColour: {
      name: 'Teaser colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    buttonUrl: {
      name: 'Button url',
    },
    buttonLabel: {
      name: 'Button label',
    },
    primaryButtonColourScheme: {
      name: 'Button colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'clear-primary', 'clear-secondary', 'clear-tertiary', 'clear-white', 'clear-black'],
      },
    },
  },
};

const Template = args => `
          <biggive-video-feature
            space-above="${args.spaceAbove}"
            space-below="${args.spaceBelow}"
            default-text-colour="${args.defaultTextColour}"
            video-url="${args.videoUrl}"
            slug="${args.slug}"
            slug-colour="${args.slugColour}"
            main-title="${args.mainTitle}"
            main-title-colour="${args.mainTitleColour}"
            teaser="${args.teaser}"
            teaser-colour="${args.teaserColour}"
            button-url="${args.buttonUrl}"
            button-label="${args.buttonLabel}"
            button-colour-scheme="${args.buttonColourScheme}">
          </biggive-video-feature>
          `;

export const VideoFeatureComponent = Template.bind({});
VideoFeatureComponent.args = {
  spaceAbove: 0,
  spaceBelow: 4,
  defaultTextColour: 'primary',
  videoUrl: 'https://www.youtube.com/embed/Ru4vGXMavf4',
  slug: 'Test slug',
  slugColour: null,
  mainTitle: 'Test title',
  mainTitleColour: null,
  teaser: 'This is the teaser content for the video',
  teaserColour: null,
  buttonUrl: '#',
  buttonLabel: 'Find out more',
  buttonColourScheme: 'primary',
};
