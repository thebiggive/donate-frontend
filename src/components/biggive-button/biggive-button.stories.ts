export default {
  title: 'Components/Demos',
};

const Template = args => `
    <biggive-button
      colour-scheme="${args.colourScheme}"
      counlabelter=${args.label}
      url=${args.url}
      full-width=${args.fullWidth}
      space-below=${args.spaceBelow}
    </biggive-button>
    `;

export const ButtonComponent = Template.bind({});
ButtonComponent.args = {
  spaceBelow: 0,
  colourScheme: 'primary',
  label: 'Donate now',
  url: '#',
  fullWidth: false,
};
