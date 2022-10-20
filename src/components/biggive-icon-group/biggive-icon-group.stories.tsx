export default {
  title: 'Components/Icons',
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
                <biggive-icon-group
                  space-below="${args.spaceBelow}"      
                  >
                  <biggive-social-icon service="Twitter" url="#" colour-scheme="black"></biggive-social-icon>
                  <biggive-social-icon service="Facebook" url="#" colour-scheme="black"></biggive-social-icon>
                </biggive-icon-group>
                `;

export const IconGroupComponent = Template.bind({});
IconGroupComponent.args = {
  spaceBelow: 4,
};
