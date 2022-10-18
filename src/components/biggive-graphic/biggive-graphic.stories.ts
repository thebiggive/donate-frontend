export default {
  title: 'Components/Demos',
};

const Template = args => `
            <biggive-graphic
              colour-scheme="${args.colourScheme}"
              graphic-url="${args.graphicUrl}"
              slug="${args.slug}"
              slugColour="${args.slugColour}"
              mainTitle="${args.mainTitle}"
              mainTitleColour="${args.mainTitleColour}"
              teaser="${args.teaser}"
              teaserColour="${args.teaserColour}"
              buttonUrl="${args.buttonUrl}"
              buttonLabel="${args.buttonLabel}"
              buttonColourScheme="${args.buttonColourScheme}">
            </biggive-graphic>
            `;

export const GraphicComponent = Template.bind({});
GraphicComponent.args = {
  colourScheme: 'primary',
  graphicUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
  slug: 'Test slug',
  slugColour: null,
  mainTitle: 'Test title',
  mainTitleColour: null,
  teaser: 'This is the teaser content for the video',
  teaserColour: null,
  buttonUrl: '#',
  buttonLabel: 'Find out more',
  buttonColourScheme: 'primary',
};
