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
    colourScheme: {
      name: 'Colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    sectionStyleTop: {
      name: 'Section style - top',
      control: {
        type: 'select',
        options: ['straight', 'crop-left', 'crop-right'],
      },
    },
    sectionStyleBottom: {
      name: 'Section style - bottom',
      control: {
        type: 'select',
        options: ['straight', 'crop-left', 'crop-right'],
      },
    },
  },
};

const Template = args => `
        <biggive-page-section
          space-below="${args.spaceBelow}"  
          colour-scheme="${args.colourScheme}"    
          section-style-top="${args.sectionStyleTop}"
          section-style-bottom="${args.sectionStyleBottom}">
        </biggive-page-section>
        `;

export const PageSectionComponent = Template.bind({});
PageSectionComponent.args = {
  colourScheme: 'primary',
  spaceBelow: 4,
  sectionStyleTop: 'straight',
  sectionStyleBottom: 'straight',
};
