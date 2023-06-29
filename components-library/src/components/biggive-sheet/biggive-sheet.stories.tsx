export default {
  title: 'Components/Content',
  argTypes: {
    backgroundColour: {
      name: 'Background colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    textColour: {
      name: 'Text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
  },
};

const Template = args => `
            <biggive-sheet
                id="${args.id}"
                background-colour="${args.backgroundColour}"
                text-colour="${args.textColour}"            
            >
            </biggive-sheet>
            <div><a href="#test-sheet">Click here to open</a></div>
            `;

export const SheetComponent = Template.bind({});
SheetComponent.args = {
  id: 'test-sheet',
  backgroundColour: 'primary',
  textColour: 'white',
};
