export default {
  title: 'Components/Layout',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
  },
};

const Template = args => `
    <biggive-page-columns
      space-below: "${args.spaceBelow}"
    </biggive-page-columns>
    `;

export const PageColumnsComponent = Template.bind({});
PageColumnsComponent.args = {
  spaceBelow: '4',
};
