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
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    imageUrl: {
      name: 'Image URL',
    },
    imageAltText: {
      name: 'Image alt text',
    },
    slug: {
      name: 'Slug',
    },
    slugColour: {
      name: 'Slug colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    mainTitle: {
      name: 'Main title',
    },
    mainTitleColour: {
      name: 'Main title colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    teaser: {
      name: 'Teaser',
    },
    teaserColour: {
      name: 'Teaser colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
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
        options: [
          'primary',
          'secondary',
          'tertiary',
          'brand-1',
          'brand-2',
          'brand-3',
          'brand-4',
          'brand-5',
          'brand-6',
          'white',
          'black',
          'clear-primary',
          'clear-secondary',
          'clear-tertiary',
          'clear-white',
          'clear-black',
        ],
      },
    },
  },
};

const Template = args => `
            <biggive-image-feature
              space-below="${args.spaceBelow}"
              default-text-colour="${args.defaultTextColour}"
              image-url="${args.imageUrl}"
              image-alt-text="${args.imageAltText}"
              slug="${args.slug}"
              slugColour="${args.slugColour}"
              mainTitle="${args.mainTitle}"
              mainTitleColour="${args.mainTitleColour}"
              teaser="${args.teaser}"
              teaserColour="${args.teaserColour}"
              buttonUrl="${args.buttonUrl}"
              buttonLabel="${args.buttonLabel}"
              buttonColourScheme="${args.buttonColourScheme}">
            </biggive-image-feature>
            `;

export const ImageFeatureComponent = Template.bind({});
ImageFeatureComponent.args = {
  spaceBelow: 4,
  defaultTextColour: 'primary',
  imageUrl: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  imageAltText: 'Image description',
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
