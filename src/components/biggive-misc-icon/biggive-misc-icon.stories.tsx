export default {
  title: 'Components/Icons',
  argTypes: {
    backgroundColour: {
      name: 'Background Colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    iconColour: {
      name: 'Icon Colour',
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
            background-colour="${args.backgroundColour}"
            icon-colour="${args.iconColour}"
            icon="${args.icon}"
            url="${args.url}"
          </biggive-misc-icon>
          `;

export const MiscIconComponent = Template.bind({});
MiscIconComponent.args = {
  backgroundColour: 'primary',
  iconColour: 'white',
  icon: 'AlarmClock',
  url: '#',
};
