export default {
  title: 'Components/Content',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
  },
};

const Template = args => `
    <biggive-hero-image
      space-below="${args.spaceBelow}"
      colour-scheme="${args.colourScheme}"
      slug="${args.slug}"
      slug-colour="${args.slugColour}"
      logo="${args.logo}"
      logo-height="${args.logoHeight}"
      logo-alt-text="${args.logoAltText}"
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
  spaceBelow: 0,
  colourScheme: 'primary',
  slug: 'Test slug',
  slugColour: null,
  logo: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  logoHeight: 'medium',
  logoAltText: 'Logo description',
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
