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
    textColour: {
      name: 'Default text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    selectedTextColour: {
      name: 'Selected text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    navigationHighlightColour: {
      name: 'Navigation highlight colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    selectedNavigationHighlightColour: {
      name: 'Selected navigation highlight colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    buttonBackgroundColour: {
      name: 'Button background colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    buttonIconColour: {
      name: 'Button icon colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
  },
};

const Template = args => `
                <biggive-tabbed-content
                  space-below="${args.spaceBelow}"  
                  text-colour="${args.textColour}"
                  selected-text-colour="${args.selectedTextColour}"
                  navigation-highlight-colour="${args.navigationHighlightColour}"
                  selected-navigation-highlight-colour="${args.selectedNavigationHighlightColour}"
                  button-background-colour="${args.buttonBackgroundColour}"
                  button-icon-colour="${args.buttonIconColour}"
                  >
                  <biggive-tab tab-title="this is my title">
                    This is the content for the first item
                  </biggive-tab>
                  <biggive-tab tab-title="this is my second title">
                    This is the content for the second item
                  </biggive-tab>
                </biggive-tabbed-content>
                `;

export const TabbedContentComponent = Template.bind({});
TabbedContentComponent.args = {
  spaceBelow: 4,
  textColour: 'black',
  selectedTextColour: 'primary',
  navigationHighlightColour: 'grey-medium',
  selectedNavigationHighlightColour: 'primary',
  buttonBackgroundColour: 'white',
  buttonIconColour: 'primary',
};
