export default {
  title: 'Components/Demos',
};

const Template = args => `
        <biggive-section
          colour-scheme="${args.colourScheme}"
          section-style="${args.sectionStyle}"
        </biggive-section>
        `;

export const SectionComponent = Template.bind({});
SectionComponent.args = {
  colourScheme: 'primary',
  sectionStyle: 'standard',
};
