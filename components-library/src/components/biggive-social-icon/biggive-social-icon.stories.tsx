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
    service: {
      name: 'Service',
      control: {
        type: 'select',
        options: ['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'Web', 'Whatsapp', 'YouTube'],
      },
    },
    url: {
      name: 'Url',
    },
  },
};

const Template = args => `
          <biggive-social-icon
            background-colour="${args.backgroundColour}"
            icon-colour="${args.iconColour}"
            service="${args.service}"
            url="${args.url}"
          </biggive-social-icon>
          `;

export const SocialIconComponent = Template.bind({});
SocialIconComponent.args = {
  backgroundColour: 'primary',
  iconColour: 'white',
  service: 'Twitter',
  url: '#',
};
