export default {
  title: 'Components/Demos',
};

const Template = args => `
          <biggive-video
            colour-scheme="${args.colourScheme}"
            video-url="${args.videoUrl}"
            slug="${args.slug}"
            slug-colour="${args.slugColour}"
            main-title="${args.mainTitle}"
            main-title-colour="${args.mainTitleColour}"
            teaser="${args.teaser}"
            teaser-colour="${args.teaserColour}"
            button-url="${args.buttonUrl}"
            button-label="${args.buttonLabel}"
            button-colour-scheme="${args.buttonColourScheme}">
          </biggive-section>
          `;

export const VideoComponent = Template.bind({});
VideoComponent.args = {
  colourScheme: 'primary',
  videoUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
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
