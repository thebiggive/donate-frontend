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
    backgroundColour: {
      name: 'Background colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black', 'transparent'],
      },
    },
    backgroundImageUrl: {
      name: 'Background image URL',
    },
    cardColour: {
      name: 'Card colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black', 'transparent'],
      },
    },
    textColour: {
      name: 'Text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black', 'transparent'],
      },
    },
    icon: {
      name: 'Icon',
    },
    iconColour: {
      name: 'Icon colour',
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
          'red',
          'clear-primary',
          'clear-secondary',
          'clear-tertiary',
          'clear-brand-1',
          'clear-brand-2',
          'clear-brand-3',
          'clear-brand-4',
          'clear-brand-5',
          'clear-brand-6',
          'clear-white',
          'clear-black',
        ],
      },
    },
    mainTitle: {
      name: 'Title',
    },
    subtitle: {
      name: 'Subtitle',
    },
    teaser: {
      name: 'Teaser',
    },
    buttonUrl: {
      name: 'Button URL',
    },
    buttonLabel: {
      name: 'Button label',
    },
    buttonColourScheme: {
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
          'clear-brand-1',
          'clear-brand-2',
          'clear-brand-3',
          'clear-brand-4',
          'clear-brand-5',
          'clear-brand-6',
          'clear-white',
          'clear-black',
        ],
      },
    },
    clipBottomLeftCorner: {
      name: 'Clip bottom left corner',
    },
    clipTopRight: {
      name: 'Clip top right corner',
    },
  },
};

const Template = args => `
              <biggive-basic-card
                space-below="${args.spaceBelow}"
                background-colour="${args.backgroundColour}"
                background-image-url="${args.backgroundImageUrl}"
                card-colour="${args.cardColour}"
                text-colour="${args.textColour}"
                icon="${args.icon}"
                icon-colour="${args.iconColour}"
                mainTitle="${args.mainTitle}"
                subtitle="${args.subtitle}"
                teaser="${args.teaser}"
                button-label="${args.buttonLabel}"
                button-url="${args.buttonUrl}"
                button-colour-ccheme="${args.buttonColourScheme}"
                clip-bottom-left-corner="${args.clipBottomLeftCorner}"
                clip-top-right-corner="${args.clipTopRightCorner}"
                >
              </biggive-basic-card>
              `;

export const BasicCardComponent = Template.bind({});
BasicCardComponent.args = {
  spaceBelow: 4,
  icon: true,
  iconColour: 'primary',
  backgroundColour: 'white',
  backgroundImageUrl: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  cardColour: 'white',
  textColour: 'white',
  mainTitle: 'Sample main title',
  subtitle: 'Sample subtitle',
  teaser: 'teaser',
  buttonUrl: '#',
  buttonLabel: 'Click here',
  buttonColourScheme: 'clear-primary',
  clipBottomLeftCorner: true,
  clipTopRightCorner: true,
};
