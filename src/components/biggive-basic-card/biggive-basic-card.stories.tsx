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
    backgroundImageUrl: {
      name: 'Background image URL',
    },
    iconColour: {
      name: 'Icon colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'clear-primary', 'clear-secondary', 'clear-tertiary', 'clear-white', 'clear-black'],
      },
    },
    mainTitle: {
      name: 'Title',
    },
    subtitle: {
      name: 'Subtitle',
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
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'clear-primary', 'clear-secondary', 'clear-tertiary', 'clear-white', 'clear-black'],
      },
    },
  },
};

const Template = args => `
              <biggive-basic-card
                space-below="${args.spaceBelow}"
                background-colour="${args.backgroundColour}"
                background-image-url="${args.backgroundImageUrl}"
                icon-colour="${args.iconColour}"
                mainTitle="${args.mainTitle}"
                subtitle="${args.subtitle}"
                buttonLabel="${args.buttonLabel}"
                buttonUrl="${args.buttonUrl}"
                buttonColourScheme="${args.buttonColourScheme}"
                >
              </biggive-basic-card>
              `;

export const BasicCardComponent = Template.bind({});
BasicCardComponent.args = {
  spaceBelow: 4,
  iconColour: 'primary',
  backgroundColour: 'white',
  backgroundImageUrl: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  mainTitle: 'Sample main title',
  subtitle: 'Sample subtitle',
  buttonUrl: '#',
  buttonLabel: 'Click here',
  buttonColourScheme: 'clear-primary',
};
