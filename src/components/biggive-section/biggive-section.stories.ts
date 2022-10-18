export default {
  title: 'Components/Demos',
};

const Template = args => `
        <biggive-section
          colour-scheme="${args.colourScheme}"
          space-after="${args.spaceAfter}"
          section-style-top="${args.sectionStyleTop}"
          section-style-bottom="${args.sectionStyleBottom}">
        </biggive-section>
        `;

export const SectionComponent = Template.bind({});
SectionComponent.args = {
  colourScheme: 'primary',
  spaceAfter: 4,
  sectionStyleTop: 'straight',
  sectionStyleBottom: 'straight',
};
