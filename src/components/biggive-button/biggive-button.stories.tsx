export default {
  title: 'Components/Buttons',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    colourScheme: {
      name: 'Colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    label: {
      name: 'Label',
    },
    url: {
      name: 'Url',
    },
    fullWidth: {
      name: 'Full width',
    },
    size: {
      name: 'Size',
      control: {
        type: 'select',
        options: ['small', 'medium'],
      },
    },
    rounded: {
      name: 'Rounded',
    },
  },
};

const Template = args => `
    <biggive-button
      space-below="${args.spaceBelow}"
      colour-scheme="${args.colourScheme}"
      label="${args.label}"
      url="${args.url}"
      full-width=${args.fullWidth}
      size=${args.size}
      rounded=${args.rounded}
    </biggive-button>
    `;

export const ButtonComponent = Template.bind({});
ButtonComponent.args = {
  spaceBelow: 0,
  colourScheme: 'primary',
  label: 'Donate now',
  url: 'http://www.google.com',
  fullWidth: false,
  size: 'medium',
  rounded: false,
};
