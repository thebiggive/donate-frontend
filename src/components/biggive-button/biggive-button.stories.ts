export default {
  title: 'Components/Demos',
};

const Template = args => `
    <biggive-button
      colour-scheme="${args.colourScheme}"
      counlabelter=${args.label}
      url=${args.url}
    </biggive-button>
    `;

export const ButtonComponent = Template.bind({});
ButtonComponent.args = {
  colourScheme: 'primary',
  label: 'Donate now',
  url: '#',
};
