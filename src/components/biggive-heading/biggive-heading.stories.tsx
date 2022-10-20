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
    colour: {
      name: 'Heading colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
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
  },
};

const Template = args => `
            <biggive-heading
              space-below=${args.spaceBelow}
              colour="${args.colour}"
              html-element="${args.htmlElement}"
              size="${args.size}"
              text="${args.text}"
              >
              </biggive-heading>
            `;

export const HeadingComponent = Template.bind({});
HeadingComponent.args = {
  spaceBelow: 0,
  colour: 'primary',
  htmlElement: 'h1',
  size: '1',
  text: 'This is the heading',
};
