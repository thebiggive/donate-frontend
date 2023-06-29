export default {
  title: 'Components/Icons',
  argTypes: {
    backgroundColour: {
      name: 'Background Colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    iconColour: {
      name: 'Icon Colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    iconGroup: {
      name: 'Icon Group',
      control: {
        type: 'select',
        options: ['beneficiary', 'misc', 'social', 'category'],
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
            <biggive-generic-icon
              background-colour="${args.backgroundColour}"
              icon-colour="${args.iconColour}"
              icon-group="${args.iconGroup}"
              icon="${args.icon}"
              url="${args.url}"
            </biggive-misc-icon>
            `;

export const GenericIconComponent = Template.bind({});
GenericIconComponent.args = {
  backgroundColour: 'primary',
  iconColour: 'white',
  iconGroup: 'misc',
  icon: 'AlarmClock',
  url: '#',
};
