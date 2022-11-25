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
    maxWidth: {
      name: 'Max width',
      control: {
        type: 'select',
        options: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
      },
    },
    colourScheme: {
      name: 'Colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
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
          max-width="${args.maxWidth}"  
          colour-scheme="${args.colourScheme}"    
          section-style-top="${args.sectionStyleTop}"
          section-style-bottom="${args.sectionStyleBottom}">
        </biggive-page-section>
        `;

export const PageSectionComponent = Template.bind({});
PageSectionComponent.args = {
  colourScheme: 'primary',
  spaceBelow: 4,
  maxWidth: 100,
  sectionStyleTop: 'straight',
  sectionStyleBottom: 'straight',
};
