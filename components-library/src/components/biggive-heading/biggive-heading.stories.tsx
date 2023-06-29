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
    colour: {
      name: 'Heading colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    htmlElement: {
      name: 'HTML element',
      control: {
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4', 'h5'],
      },
    },
    size: {
      name: 'Heading size',
      control: {
        type: 'select',
        options: [1, 2, 3, 4, 5],
      },
    },
    align: {
      name: 'Text alignment',
      control: {
        type: 'select',
        options: ['left', 'right', 'center', 'justify'],
      },
    },
  },
};

const Template = args => `
            <biggive-heading
              space-above=${args.spaceAbove}
              space-below=${args.spaceBelow}
              colour="${args.colour}"
              html-element="${args.htmlElement}"
              size="${args.size}"
              align="${args.align}"
              text="${args.text}"
              >
              </biggive-heading>
            `;

export const HeadingComponent = Template.bind({});
HeadingComponent.args = {
  spaceAbove: 0,
  spaceBelow: 0,
  colour: 'primary',
  htmlElement: 'h1',
  size: '1',
  align: 'left',
  text: 'This is the heading',
};
