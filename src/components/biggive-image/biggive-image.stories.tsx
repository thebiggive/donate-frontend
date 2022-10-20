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
    imageUrl: {
      name: 'Image URL',
    },
  },
};

const Template = args => `
              <biggive-image
                space-below="${args.spaceBelow}"
                image-url="${args.imageUrl}">
              </biggive-image>
              `;

export const ImageComponent = Template.bind({});
ImageComponent.args = {
  spaceBelow: 4,
  imageUrl: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
};
