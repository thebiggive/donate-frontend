export default {
  title: 'Components/Content',
  argTypes: {
    charityLocation: {
      name: 'Charity Location',
    },
    charityName: {
      name: 'Charity Name',
    },
    charityUrl: {
      name: 'Charity URL',
    },
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    imageUrl: {
      name: 'Image URL',
    },
    logoUrl: {
      name: 'Logo URL',
    },
    slug: {
      name: 'Slug',
    },
  },
};

const Template = args => `
            <biggive-branded-image
              charity-location="${args.charityLocation}"
              charity-name="${args.charityName}"
              charity-url="${args.charityUrl}"
              space-below="${args.spaceBelow}"  
              image-url="${args.imageUrl}"   
              logo-url="${args.logoUrl}"    
              slug="${args.slug}"
              >
            </biggive-branded-image>
            `;

export const BrandedImageComponent = Template.bind({});
BrandedImageComponent.args = {
  charityLocation: 'London',
  charityName: 'The Big Give Trust',
  charityUrl: 'https://thebiggive.org.uk',
  spaceBelow: 4,
  imageUrl: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  logoUrl: 'https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/10/attachment_98611730-e1539290946446.png?auto=format&q=60&fit=max&w=930',
  slug: 'white',
};
