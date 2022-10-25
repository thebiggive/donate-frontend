export default {
  title: 'Components/Icons',
  argTypes: {
    colourScheme: {
      name: 'Colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    icon: {
      name: 'Service',
      control: {
        type: 'select',
        options: ['AlarmClock', 'Heart'],
      },
    },
    url: {
      name: 'Url',
    },
  },
};

const Template = args => `
          <biggive-misc-icon
            colour-scheme="${args.colourScheme}"
            icon="${args.icon}"
            url="${args.url}"
          </biggive-misc-icon>
          `;

export const MiscIconComponent = Template.bind({});
MiscIconComponent.args = {
  colourScheme: 'primary',
  icon: 'AlarmClock',
  url: '#',
};
