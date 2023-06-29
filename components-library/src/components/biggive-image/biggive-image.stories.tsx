export default {
  title: 'Components/Content',
  argTypes: {
    spaceAbove: {
      name: 'Space above',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
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
    imageAltText: {
      name: 'Image alt text',
    },
    width: {
      name: 'Width',
    },
    height: {
      name: 'Height',
    },
    sizeUnit: {
      name: 'Unit',
      control: {
        type: 'select',
        options: ['px', '%'],
      },
    },
  },
};

const Template = args => `
              <biggive-image
                space-above="${args.spaceAbove}"
                space-below="${args.spaceBelow}"
                width="${args.width}"
                height="${args.height}"
                size-unit="${args.sizeUnit}"
                image-url="${args.imageUrl}"
                image-alt-text="${args.imageAltText}"
                >
              </biggive-image>
              `;

export const ImageComponent = Template.bind({});
ImageComponent.args = {
  spaceAbove: 4,
  spaceBelow: 4,
  imageUrl: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  imageAltText: 'Image description',
  width: 0,
  height: 0,
  sizeUnit: null,
};
