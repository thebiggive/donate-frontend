export default {
  title: 'Components/Demos',
};

const Template = args => `
          <biggive-social-icon
            service="${args.service}"
            url="${args.url}"
          </biggive-social-icon>
          `;

export const SocialIconComponent = Template.bind({});
SocialIconComponent.args = {
  service: 'twitter',
  url: '#',
};
