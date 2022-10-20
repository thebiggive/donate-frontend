export default {
  title: 'Components/Layout',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    columnCount: {
      name: 'Column count',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4],
      },
    },
    columnGap: {
      name: 'Column gap',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
  },
};

const Template = args => `
          <biggive-grid
            space-below="${args.spaceBelow}"  
            column-count="${args.columnCount}"    
            column-gap="${args.columnGap}">
          </biggive-grid>
          `;

export const GridComponent = Template.bind({});
GridComponent.args = {
  spaceBelow: 4,
  columnGap: '3',
  coloumnGap: '4',
};
