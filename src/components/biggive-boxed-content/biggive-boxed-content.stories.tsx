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
    horizontalPadding: {
      name: 'Horizontal padding',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    verticalPadding: {
      name: 'Vertical padding',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    backgroundColour: {
      name: 'Background colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    shadow: {
      name: 'Shadow',
    },
  },
};

const Template = args => `
            <biggive-boxed-content
              space-below="${args.spaceBelow}"  
              horizontal-padding="${args.horizontalPadding}"   
              vertical-padding="${args.verticalPadding}"    
              background-colour="${args.backgroundColour}"
              shadow="${args.shadow}"
              >
  
              <biggive-quote 
                attribution="Joe Bloggs"
                quote="Lorem ipsum">
              </biggive-quote>

            </biggive-boxed-content>
            `;

export const BoxedContentComponent = Template.bind({});
BoxedContentComponent.args = {
  spaceBelow: 4,
  horizontalPadding: '3',
  verticalPadding: '4',
  backgroundColour: 'white',
  shadow: true,
};
