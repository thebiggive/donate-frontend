export default {
  title: 'Components/Demos',
};

const Template = args => `
        <biggive-page-section
          colour-scheme="${args.colourScheme}"
          space-below="${args.spaceBelow}"
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
