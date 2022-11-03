export default {
  title: 'Components/Content',
};

const Template = args => `
    <biggive-hero-image
      colour-scheme="${args.colourScheme}"
      slug="${args.slug}"
      slugColour="${args.slugColour}"
      logo="${args.logo}"
      main-image="${args.mainImage}"
      main-image-align-horizontal="${args.mainImageAlignHorizontal}"
      main-image-align-vertical="${args.mainImageAlignVertical}"
      main-title="${args.mainTitle}"
      main-titleColour="${args.mainTitleColour}"
      teaser="${args.teaser}"
      teaserColour="${args.teaserColour}"
      button-url="${args.buttonUrl}"
      button-label="${args.buttonLabel}"
      button-colour-scheme="${args.buttonColourScheme}"
    </biggive-hero-image>
    `;

export const HeroImageComponent = Template.bind({});
HeroImageComponent.args = {
  colourScheme: 'primary',
  slug: 'Test slug',
  slugColour: null,
  logo: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  mainImage: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  mainImageAlignHorizontal: 'center',
  mainImageAlignVertical: 'center',
  mainTitle: 'Test title',
  mainTitleColour: null,
  teaser: 'We run match funding campaigns to make an extraordinary difference to the world’s big challenges.',
  teaserColour: null,
  buttonUrl: '#',
  buttonLabel: 'Donate now',
  buttonColourScheme: 'primary',
  
};
