export default {
  title: 'Components/Demos',
};

const Template = args => `
    <biggive-hero-image
      colour-scheme="${args.colourScheme}"
      slug="${args.slug}"
      logo="${args.logo}"
      main-image="${args.mainImage}"
      main-title="${args.mainTitle}"
      teaser="${args.teaser}"
      button-url="${args.buttonUrl}"
      button-label="${args.buttonLabel}"
    </biggive-hero-image>
    `;

export const HeroImageComponent = Template.bind({});
HeroImageComponent.args = {
  colourScheme: 'primary',
  slug: 'Test slug',
  logo: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  mainImage: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  mainTitle: 'Test title',
  teaser: 'We run match funding campaigns to make an extraordinary difference to the world’s big challenges.',
  buttonUrl: '#',
  buttonLabel: 'Donate now',
};
