export default {
  title: 'Components/Demos',
};

const Template = args => `
  <biggive-progress-bar
    colour-scheme="${args.placeholderText}"
    counter=${args.counter}
  </biggive-progress-bar>
  `;

  export const ProgressBarComponent = Template.bind({});
  ProgressBarComponent.args = {
  colourScheme: 'primary',
  counter: 50,
};