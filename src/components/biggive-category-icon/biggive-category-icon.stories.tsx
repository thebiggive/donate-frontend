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
    label: {
      name: 'Label',
    },
  },
};

const Template = args => `
            <biggive-category-icon
              background-colour="${args.backgroundColour}"
              icon-colour="${args.iconColour}"
              icon="${args.icon}"
              url="${args.url}"
              label="${args.label}"
            </biggive-category-icon>
            `;

export const CategoryIconComponent = Template.bind({});
CategoryIconComponent.args = {
  backgroundColour: 'primary',
  iconColour: 'white',
  icon: 'Animals',
  url: '#',
  label: 'Category label',
};
