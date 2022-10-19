export default {
  title: 'Components/Demos',
};

const Template = args => `
            <biggive-image-feature
              colour-scheme="${args.colourScheme}"
              image-url="${args.imageUrl}"
              slug="${args.slug}"
              slugColour="${args.slugColour}"
              mainTitle="${args.mainTitle}"
              mainTitleColour="${args.mainTitleColour}"
              teaser="${args.teaser}"
              teaserColour="${args.teaserColour}"
              buttonUrl="${args.buttonUrl}"
              buttonLabel="${args.buttonLabel}"
              buttonColourScheme="${args.buttonColourScheme}">
            </biggive-image-feature>
            `;

export const ImageFeatureComponent = Template.bind({});
ImageFeatureComponent.args = {
  colourScheme: 'primary',
  imageUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
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
