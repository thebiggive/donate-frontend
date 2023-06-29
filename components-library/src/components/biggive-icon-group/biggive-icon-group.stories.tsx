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
                  label="${args.label}"      
                  >
                  <biggive-category-icon icon="Animals" url="#" background-colour="black" icon-colour="white" label="Icon category"></biggive-category-icon>
                  <biggive-category-icon icon="Animals" url="#" background-colour="black" icon-colour="white" label="Icon category"></biggive-category-icon>
                </biggive-icon-group>
                `;

export const IconGroupComponent = Template.bind({});
IconGroupComponent.args = {
  spaceBelow: 4,
  label: 'Icon Group',
};
