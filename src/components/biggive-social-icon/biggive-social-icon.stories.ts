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
    service: {
      name: 'Service',
      control: {
        type: 'select',
        options: ['Twitter', 'Facebook', 'Instagram', 'LinkedIn'],
      },
    },
    url: {
      name: 'Url',
    },
  },
};

const Template = args => `
          <biggive-social-icon
            colour-scheme="${args.colourScheme}"
            service="${args.service}"
            url="${args.url}"
          </biggive-social-icon>
          `;

export const SocialIconComponent = Template.bind({});
SocialIconComponent.args = {
  colourScheme: 'primary',
  service: 'Twitter',
  url: '#',
};
