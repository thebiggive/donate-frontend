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
    backgroundColour: {
      name: 'Background colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'transparent'],
      },
    },
    backgroundColourHover: {
      name: 'Hover background colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'transparent'],
      },
    },
    textColour: {
      name: 'Text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black', 'transparent'],
      },
    },
    slug: {
      name: 'Slug',
    },
    date: {
      name: 'Date',
    },
    mainTitle: {
      name: 'Title',
    },
    imageUrl: {
      name: 'Image URL',
    },
    imageLabel: {
      name: 'Image Label',
    },
    buttonUrl: {
      name: 'Button URL',
    },
    buttonLabel: {
      name: 'Button label',
    },
  },
};

const Template = args => `
              <biggive-article-card
                space-below="${args.spaceBelow}"
                background-colour="${args.backgroundColour}"
                background-colour-hover="${args.backgroundColourHover}"
                text-colour="${args.textColour}"
                slug="${args.slug}"
                date="${args.date}"
                main-title="${args.mainTitle}"
                image-url="${args.imageUrl}"
                image-label="${args.imageLabel}"
                button-label="${args.buttonLabel}"
                button-url="${args.buttonUrl}"
                >
              </biggive-article-card>
              `;

export const ArticleCardComponent = Template.bind({});
ArticleCardComponent.args = {
  spaceBelow: 4,
  backgroundColour: 'white',
  backgroundColourHover: 'tertiary',
  textColour: 'black',
  slug: '• Blog Post   • Mental Health',
  date: 'September 2022',
  mainTitle: 'Sample main title',
  imageUrl: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  imageLabel: 'By Joe Bloggs',
  buttonUrl: '#',
  buttonLabel: 'Click here',
};
